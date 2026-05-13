import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

vi.mock('mirador', () => ({
  getManifestoInstance: vi.fn(),
}));

import { getManifestoInstance } from 'mirador';
import hideViewerNavigationPlugin from '../../src/hideViewerNavigationPlugin';

const HideNav = hideViewerNavigationPlugin.component;

const makeV2Manifest = (viewingHint) => ({
  id: 'urn:test:v2',
  getSequences: () => [
    {
      getProperty: (key) => (key === 'viewingHint' ? viewingHint : undefined),
    },
  ],
  getBehavior: () => undefined,
});

const makeV3Manifest = (behavior) => ({
  id: 'urn:test:v3',
  getSequences: () => [],
  getBehavior: () => behavior,
});

const seedNavChrome = () => {
  const make = (className) => {
    const el = document.createElement('div');
    el.className = className;
    document.body.appendChild(el);
    return el;
  };
  make('mirador-osd-info');
  make('mirador-osd-navigation');
  make('Connect(WithPlugins(ZoomControls))-divider-123');
  make('other-element');
};

describe('hideViewerNavigationPlugin export shape', () => {
  it('matches the v4 plugin shape', () => {
    expect(hideViewerNavigationPlugin).toMatchObject({
      target: 'Window',
      mode: 'add',
    });
    expect(hideViewerNavigationPlugin.component).toBeTypeOf('function');
    expect(hideViewerNavigationPlugin.mapStateToProps).toBeTypeOf('function');
  });
});

describe('hideViewerNavigationPlugin.mapStateToProps', () => {
  beforeEach(() => {
    getManifestoInstance.mockReset();
  });

  it('returns manifest and manifestId for the given window', () => {
    const fakeManifest = { id: 'urn:test:abc' };
    getManifestoInstance.mockReturnValue(fakeManifest);

    const props = hideViewerNavigationPlugin.mapStateToProps(
      { windows: {} },
      { windowId: 'w1' },
    );

    expect(getManifestoInstance).toHaveBeenCalledWith(
      { windows: {} },
      { windowId: 'w1' },
    );
    expect(props).toEqual({
      manifest: fakeManifest,
      manifestId: 'urn:test:abc',
    });
  });

  it('returns undefined manifestId when no manifest is loaded', () => {
    getManifestoInstance.mockReturnValue(undefined);

    const props = hideViewerNavigationPlugin.mapStateToProps(
      {},
      { windowId: 'w1' },
    );

    expect(props.manifest).toBeUndefined();
    expect(props.manifestId).toBeUndefined();
  });
});

describe('hideViewerNavigation component DOM cleanup', () => {
  let store;

  beforeEach(() => {
    store = createStore(() => ({}));
    seedNavChrome();
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  const mount = (props) =>
    render(
      <Provider store={store}>
        <HideNav {...props} />
      </Provider>,
    );

  it('removes nav chrome on update when IIIF v2 viewingHint is "individuals"', () => {
    const manifest = makeV2Manifest('individuals');
    const { rerender } = mount({ windowId: 'w1', manifest });

    rerender(
      <Provider store={store}>
        <HideNav windowId="w1" manifest={manifest} bump={1} />
      </Provider>,
    );

    expect(document.querySelector('.mirador-osd-info')).toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).toBeNull();
    expect(
      document.querySelector('[class*="Connect(WithPlugins(ZoomControls))-divider-"]'),
    ).toBeNull();
    expect(document.querySelector('.other-element')).not.toBeNull();
  });

  it('removes nav chrome on update when IIIF v3 behavior is "individuals"', () => {
    const manifest = makeV3Manifest('individuals');
    const { rerender } = mount({ windowId: 'w1', manifest });

    rerender(
      <Provider store={store}>
        <HideNav windowId="w1" manifest={manifest} bump={1} />
      </Provider>,
    );

    expect(document.querySelector('.mirador-osd-info')).toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).toBeNull();
    expect(
      document.querySelector('[class*="Connect(WithPlugins(ZoomControls))-divider-"]'),
    ).toBeNull();
  });

  it('leaves nav chrome alone on update when viewingHint is not "individuals"', () => {
    const manifest = makeV2Manifest('paged');
    const { rerender } = mount({ windowId: 'w1', manifest });

    rerender(
      <Provider store={store}>
        <HideNav windowId="w1" manifest={manifest} bump={1} />
      </Provider>,
    );

    expect(document.querySelector('.mirador-osd-info')).not.toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).not.toBeNull();
    expect(
      document.querySelector('[class*="Connect(WithPlugins(ZoomControls))-divider-"]'),
    ).not.toBeNull();
  });

  it('leaves nav chrome alone on update when IIIF v3 behavior is not "individuals"', () => {
    const manifest = makeV3Manifest('continuous');
    const { rerender } = mount({ windowId: 'w1', manifest });

    rerender(
      <Provider store={store}>
        <HideNav windowId="w1" manifest={manifest} bump={1} />
      </Provider>,
    );

    expect(document.querySelector('.mirador-osd-info')).not.toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).not.toBeNull();
  });

  it('treats a missing manifest as not-individual and leaves DOM untouched', () => {
    const { rerender } = mount({ windowId: 'w1', manifest: undefined });

    rerender(
      <Provider store={store}>
        <HideNav windowId="w1" manifest={undefined} bump={1} />
      </Provider>,
    );

    expect(document.querySelector('.mirador-osd-info')).not.toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).not.toBeNull();
  });

  it('renders an empty fragment (adds no DOM of its own)', () => {
    const manifest = makeV2Manifest('paged');
    const { container } = mount({ windowId: 'w1', manifest });

    expect(container.firstChild).toBeNull();
  });
});
