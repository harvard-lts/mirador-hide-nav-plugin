const path = require('path');

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
  },
  webpack: {
    aliases: {
      react: path.resolve('./', 'node_modules', 'react'),
      'react-dom': path.resolve('./', 'node_modules', 'react-dom'),
    },
  },
}
