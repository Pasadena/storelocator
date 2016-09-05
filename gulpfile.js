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

gulp.task('watchify', ['generate-service-worker'], function() {
  return scripts(true);
});

gulp.task('generate-service-worker', (callback) => {
  const path = require('path');
  const swPrecache = require('sw-precache');
  const rootDir = 'public';

  //swPrecache.write(path.join(__dirname, 'service-worker.js'), {
  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    //staticFileGlobs: [rootDir + '/**/*.{html,css,png,jpg,gif,svg,eot,ttf,woff}',  rootDir + '/index.html'],
    staticFileGlobs: [rootDir + '/index.html', rootDir + '/manifest.json', rootDir + '/images/*', rootDir +'/css/styles.css',
    '/bower_components/**/*.html'],
    stripPrefix: rootDir
  }, callback);
});
