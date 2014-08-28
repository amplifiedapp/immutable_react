var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var glob = require('glob');
var path = require('path');
var gutil = require('gulp-util');

gulp.task('default', function() {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: ['./js/index.js'],
    debug: true
  });

  var bundler = watchify(bundler);

  // To support React Dev Tools, we need React to be requireable
  bundler.require('react');

  bundler.on('update', rebundle);
  bundler.on('log', gutil.log);

  var outFile = './examples/todomvc/js/app.js';
  function rebundle () {
    return bundler.bundle()
      .on('error', function(err) { gutil.log('ERROR: ' + err.message); gutil.beep(); })
      .pipe(source(path.basename(outFile)))
      .pipe(gulp.dest(path.dirname(outFile)));
  }

  return rebundle();
});
