import { describe, it, expect, vi } from 'vitest';

vi.mock('mirador', () => ({ getManifestoInstance: vi.fn() }));

import plugins, { hideViewerNavigationPlugin } from '../src/index.js';

describe('mirador-hide-nav-plugin smoke test', () => {
  it('exports the hide viewer navigation plugin', () => {
    expect(hideViewerNavigationPlugin).toBeDefined();
  });

  it('exports an array of plugins as the default export', () => {
    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins).toHaveLength(1);
    expect(plugins).toContain(hideViewerNavigationPlugin);
  });

  it('configures each plugin with a target and component', () => {
    plugins.forEach((plugin) => {
      expect(typeof plugin.target).toBe('string');
      expect(plugin.target.length).toBeGreaterThan(0);
      expect(plugin.component).toBeDefined();
    });
  });

  it('registers the hide viewer navigation plugin against the window', () => {
    expect(hideViewerNavigationPlugin.target).toBe('Window');
    expect(hideViewerNavigationPlugin.mode).toBe('add');
    expect(typeof hideViewerNavigationPlugin.mapStateToProps).toBe('function');
  });
});
