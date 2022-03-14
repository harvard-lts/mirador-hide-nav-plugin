module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'hideViewerNavigation',
      externals: {
        react: 'React'
      }
    }
  }
}
