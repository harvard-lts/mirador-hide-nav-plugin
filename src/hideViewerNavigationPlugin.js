import { useEffect } from 'react';
import { getManifestoInstance } from 'mirador';

const isIndividualImage = (manifest) => {
  const individualValue = 'individuals';

  // IIIF v2
  if (
    manifest
    && manifest.getSequences()
    && manifest.getSequences()[0]
    && manifest.getSequences()[0].getProperty('viewingHint')
  ) return manifest.getSequences()[0].getProperty('viewingHint') == individualValue;

  // IIIF v3
  if (
    manifest
    && manifest.getBehavior()
  ) return manifest.getBehavior() == individualValue;

  return false;
};

function HideViewerNavigation({ manifest }) {
  useEffect(() => {
    if (isIndividualImage(manifest)) {
      window.document.querySelectorAll('.mirador-osd-info').forEach((elem) => elem.remove());
      window.document.querySelectorAll('.mirador-osd-navigation').forEach((elem) => elem.remove());
      window.document.querySelectorAll('[class*="Connect(WithPlugins(ZoomControls))-divider-"]').forEach((elem) => elem.remove());
    }
  });

  return null;
}

const mapStateToProps = (state, { windowId }) => ({
  manifestId: (getManifestoInstance(state, { windowId }) || {}).id,
  manifest: getManifestoInstance(state, { windowId }),
});

export default {
  name: 'HideViewerNavigationPlugin',
  target: 'Window',
  mode: 'add',
  component: HideViewerNavigation,
  mapStateToProps,
};
