const production = require('gulp-environments').production;

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const es = require('event-stream');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const cssnano = require('cssnano');

const config = require('./../config');
const utils = require('./utils');

const timestamp = +new Date();

let scssMixinsOptions = {};
if (config.includeMixinsInComponents) {
  const scssMixinsPath = config.scssMixinsPath;
  const scssContent = fs.readFileSync(scssMixinsPath, 'utf-8');
  scssMixinsOptions = {
    data: scssContent,
    includePaths: [
      path.join(__dirname, '../../node_modules'),
      path.dirname(scssMixinsPath)
    ]
  };
}

module.exports = function (gulp) {
  return function () {
    return glob(`${config.directories.projectDirectory}**/amp.scss`, (err, files) => {
      const tasks = files.map((entry) => {
        const themeName = utils.getThemeName(entry);

        return gulp
          .src([`${config.directories.featureDirectory}**/amp.scss`, entry])
          .pipe(sass(scssMixinsOptions).on('error', sass.logError))
          .pipe(concat(config.bundle.cssBundleNameAMP))
          .pipe(postcss([
            autoprefixer(),
            cssnano({
              zindex: false
            })
          ]))
          .pipe(production(modifyCssUrls({
            append: `?c=${timestamp}`
          })))
          .pipe(production(cleanCSS()))
          .pipe(gulp.dest(config.directories.themeBuildDirectory + themeName));
      });

      // create a merged stream
      return es.merge.apply(null, tasks);
    });
  };
};
