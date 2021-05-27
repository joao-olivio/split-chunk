const gulp = require('gulp');
const browserify = require('browserify');
const globby = require('globby');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const exorcist = require('exorcist');
const production = require('gulp-environments').production;
const es = require('event-stream');
const envify = require('envify/custom');

const config = require('./../config');
const utils = require('./utils');

let FeaturesFondationsSrc;

/**
 * On get Error on promess of this task
 * @param err
 */
const onError = err => console.error('onError', err);

/**
 * on getting the paths of all code in project level
 * @param paths
 */
const onGetProjectcode = (files) => {
  const tasks = files.map((entry) => {
    const themeName = utils.getThemeName(entry);
    const themeDir = config.directories.themeBuildDirectory + themeName;
    return browserify({
      entries: [...FeaturesFondationsSrc, entry],
      ignore: '!**/*.spec.js',
      debug: true,
      fullPaths: true
    })
      .transform(envify({ _: 'purge', NODE_ENV: production() ? 'production' : 'development' }), { global: true })
      .transform('babelify')
      .transform('vueify')
      .bundle()
      .pipe(exorcist(`${themeDir}/${config.bundle.jsMapNameWow}`))
      .pipe(source(config.bundle.jsBundleNameWow))
      .pipe(production(buffer()))
      .pipe(production(uglify()))
      .pipe(gulp.dest(themeDir));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
};

/**
 * on get the paths of all code in feature and foundation level
 * @param paths
 */
const onGetFondationFeatureCode = (paths) => {
  FeaturesFondationsSrc = paths;
  return globby([`${config.directories.projectDirectory}**/*/women-of-worth.js`, `!**/obj/**/entry.js`])
    .then(onGetProjectcode, onError);
};

module.exports = function () {
  return function () {
    return globby([`${config.directories.foundationDirectory}**/women-of-worth.js`, `${config.directories.featureDirectory}**/women-of-worth.js`])
      .then(onGetFondationFeatureCode, onError);
  };
};
