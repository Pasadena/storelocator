const gulp = require("gulp");

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");
var uglify = require("gulp-uglify");
var envify = require("envify");
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
var bundler = browserify(config.js.src, { debug: true, cache: {}, packageCache: {}, fullPaths: true, extensions: ['.jsx'] })
.transform(babelify, { presets: ['es2015', 'react']});

var wathedBundler = watchify(bundler);

function scripts(watch) {
  function rebundle() {
    wathedBundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public'));
  }

  if (watch) {
    wathedBundler.on('update', function() {
      gutil.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function buildProd() {
  function bundle() {
    bundler.trasform(envify({
      NODE_ENV: 'production'
    }));
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./public'));
  }
  bundle();
}

gulp.task('dist', ['generate-service-worker'], function() {
  return buildProd();
});

gulp.task('watchify', ['generate-service-worker'], function() {
  return scripts(true);
});

gulp.task('generate-service-worker', (callback) => {
  const path = require('path');
  const swPrecache = require('sw-precache');
  const rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/index.html', rootDir + '/manifest.json', rootDir + '/images/*', rootDir +'/css/styles.css',
    '/bower_components/**/*.html'],
    stripPrefix: rootDir
  }, callback);
});
