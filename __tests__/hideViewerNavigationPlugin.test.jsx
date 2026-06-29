import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render } from '@testing-library/react';

// Mock `mirador` so we control the selector and avoid loading the full bundle
// (which triggers a jsdom canvas error).
const getManifestoInstance = vi.fn();
vi.mock('mirador', () => ({
  getManifestoInstance: (...args) => getManifestoInstance(...args),
}));

// Import AFTER vi.mock so the mock is in effect.
const { default: plugin } = await import('../src/hideViewerNavigationPlugin.js');
const { component: HideViewerNavigation, mapStateToProps } = plugin;

describe('mapStateToProps', () => {
  beforeEach(() => getManifestoInstance.mockReset());

  it('maps manifest id + instance when present', () => {
    const instance = { id: 'manifest-1' };
    getManifestoInstance.mockReturnValue(instance);
    const props = mapStateToProps({}, { windowId: 'w1' });
    expect(props.manifestId).toBe('manifest-1');
    expect(props.manifest).toBe(instance);
  });

  it('falls back to undefined manifestId when no manifest', () => {
    getManifestoInstance.mockReturnValue(null);
    const props = mapStateToProps({}, { windowId: 'w1' });
    expect(props.manifestId).toBeUndefined();
    expect(props.manifest).toBeNull();
  });
});

describe('HideViewerNavigation component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const seedNavElements = () => {
    document.body.innerHTML = `
      <div class="mirador-osd-info"></div>
      <div class="mirador-osd-navigation"></div>
      <div class="Connect(WithPlugins(ZoomControls))-divider-1"></div>
    `;
  };

  it('renders nothing', () => {
    const { container } = render(<HideViewerNavigation manifest={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('removes navigation elements for an IIIF v2 individuals manifest', () => {
    seedNavElements();
    const manifest = {
      getSequences: () => [{ getProperty: () => 'individuals' }],
      getBehavior: () => undefined,
    };
    render(<HideViewerNavigation manifest={manifest} />);
    expect(document.querySelector('.mirador-osd-info')).toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).toBeNull();
    expect(document.querySelector('[class*="Connect(WithPlugins(ZoomControls))-divider-"]')).toBeNull();
  });

  it('removes navigation elements for an IIIF v3 individuals manifest', () => {
    seedNavElements();
    const manifest = {
      getSequences: () => [],
      getBehavior: () => 'individuals',
    };
    render(<HideViewerNavigation manifest={manifest} />);
    expect(document.querySelector('.mirador-osd-info')).toBeNull();
  });

  it('leaves navigation in place for a non-individuals manifest', () => {
    seedNavElements();
    const manifest = {
      getSequences: () => [{ getProperty: () => 'paged' }],
      getBehavior: () => 'paged',
    };
    render(<HideViewerNavigation manifest={manifest} />);
    expect(document.querySelector('.mirador-osd-info')).not.toBeNull();
    expect(document.querySelector('.mirador-osd-navigation')).not.toBeNull();
  });
});
