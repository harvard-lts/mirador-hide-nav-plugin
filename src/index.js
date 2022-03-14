import React, { Component } from 'react';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';

class hideViewerNavigation extends Component {

  viewingHint() {
    const { manifest } = this.props;
    if (!(
      manifest
      && manifest.getSequences()
      && manifest.getSequences()[0]
      && manifest.getSequences()[0].getProperty('viewingHint')
    )) return [''];

    return manifest.getSequences()[0].getProperty('viewingHint');
  }

  render() {

    return (
      <></>
    );
  }

  componentDidUpdate() {
    let viewingHint = this.viewingHint();

    if (viewingHint == 'individuals') {
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
