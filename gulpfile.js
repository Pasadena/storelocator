const gulp = require("gulp");

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");
var gutil = require('gulp-util');

// Configuration for Gulp
var config = {
  js: {
    src: './src/app.jsx',
    watch: './src/**/*',
    outputDir: './public/',
    outputFile: './public/bundle.js',
  }
};

function scripts(watch) {
  var bundler = watchify(browserify(config.js.src, { debug: true, cache: {}, packageCache: {}, fullPaths: true, extensions: ['.jsx'] })
  .transform(babelify, { presets: ['es2015', 'react']}));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

gulp.task('watchify', function() {
  gutil.log('Starting shit', gutil.colors.magenta('123'));
  return scripts(true);
});
