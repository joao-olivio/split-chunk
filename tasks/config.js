const path = require('path');

module.exports = {
  directories: {
    src: 'src/',
    fractalDirectory: 'fractal/',
    featureDirectory: 'src/Feature/',
    projectDirectory: 'src/Project/',
    foundationDirectory: 'src/Foundation/',
    buildDirectory: './build',
    themeBuildDirectory: './build/Website/themes/',
  },

  currentWebsite: 'OAP',
  fractalProjectTitle: 'OAP Project Documentation',
  fractalExternalBuildPrefix: '/oap/',
  scssMixinsPath: path.join(__dirname, '../src/Project/OAP/code/Styles/00_base/mixins/_index.scss'),
  includeMixinsInComponents: true,
  enforceCommitTemplate: false,
  bundle: {
    cssBundleName: 'bundle.css',
    cssBundleNameAMP: 'amp.css',
    cssBundleNameWow: 'wow.css',
    cssBundleNameSalesForce: 'salesforce.css',
    jsBundleName: 'bundle.js',
    jsMapName: 'bundle.map.js',
    jsBundleNameWow: 'wow.js',
    jsMapNameWow: 'wow.map.js'
  }
};
