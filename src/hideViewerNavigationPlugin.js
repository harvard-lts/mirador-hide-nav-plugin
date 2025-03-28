import React, { Component } from 'react';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';

class hideViewerNavigation extends Component {

  isIndividualImage() {
    const { manifest } = this.props;
    const individualValue = 'individuals';

    // IIIF v2
    if (
      manifest
      && manifest.getSequences()
      && manifest.getSequences()[0]
      && manifest.getSequences()[0].getProperty('viewingHint')
    ) return manifest.getSequences()[0].getProperty('viewingHint') == individualValue

    // IIIF v3
    if (
      manifest
      && manifest.getBehavior()
    ) return manifest.getBehavior() == individualValue

    return false;
  }

  render() {

    return (
      <></>
    );
  }

  componentDidUpdate() {
    if (this.isIndividualImage()) {
      window.document.querySelectorAll('.mirador-osd-info').forEach((elem) => elem.remove());
      window.document.querySelectorAll('.mirador-osd-navigation').forEach((elem) => elem.remove());
      window.document.querySelectorAll('[class*="Connect(WithPlugins(ZoomControls))-divider-"]').forEach((elem) => elem.remove());
    }
  }
}

const mapStateToProps = (state, { windowId }) => ({
  manifestId: (getManifestoInstance(state, { windowId }) || {}).id,
  manifest: getManifestoInstance(state, { windowId }),
});

export default {
  target: 'Window',
  mode: 'add',
  component: hideViewerNavigation,
  mapStateToProps,
}
