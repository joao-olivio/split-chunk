const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const config = require('./../config');

module.exports = function (gulp) {
  return function () {
    return gulp
      .src(`${config.directories.fractalDirectory}theme/assets/styles/scss/fractal.scss`)
      .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded'
      }).on('error', sass.logError))
      .pipe(concat('fractal.css'))
      .pipe(postcss([autoprefixer()]))
      .pipe(gulp.dest(`./${config.directories.fractalDirectory}theme/assets/styles/css`));
  }
};
