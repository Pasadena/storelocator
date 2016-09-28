const gulp = require("gulp");

const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const browserify = require("browserify");
const watchify = require("watchify");
const babelify = require("babelify");
const uglify = require("gulp-uglify");
const envify = require("envify/custom");
const gutil = require('gulp-util');

// Configuration for Gulp
const config = {
  js: {
    src: './src/app.jsx',
    outputDir: './public/',
    outputFile: './public/bundle.js',
  }
};
const bundler = browserify("./server.js", { debug: true, cache: {}, packageCache: {}, fullPaths: true, extensions: ['.jsx'] })
.transform(babelify, { presets: ['es2015', 'react']});

const wathedBundler = watchify(bundler);

const scripts = (watch) => {
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

gulp.task('dist', ['generate-service-worker'], () => {
  gutil.log("Current mode is " + process.env.NODE_ENV);
  //TODO: Find out why gulp task hangs forever when bundler is declared in it's own variable
  return browserify({ entries: config.js.src, debug: false, extensions: ['.jsx'] })
  .transform(envify())
  .transform(babelify, { presets: ['es2015', 'react']})
  .bundle()
  .on('error', (err) => { console.error(err); this.emit('end'); })
  .pipe(source("bundle.js"))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest("./public"));
});

gulp.task('watchify', ['generate-service-worker'], () => {
  return scripts(true);
});

gulp.task('generate-service-worker', (callback) => {
  const path = require('path');
  const swPrecache = require('sw-precache');
  const rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/index.html', rootDir + '/manifest.json', rootDir + 'images/*', rootDir +'/css/styles.css',
      'bower_components/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: rootDir
  }, callback);
});
