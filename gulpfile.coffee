gulp = require 'gulp'
browserify = require 'browserify'
source = require 'vinyl-source-stream'
header = require 'gulp-header'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
bump = require 'gulp-bump'
browserSync = require 'browser-sync'
pkg = require './package.json'

banner = """
/*!
 * @license #{pkg.name} v#{pkg.version}
 * (c) #{new Date().getFullYear()} #{pkg.author} #{pkg.homepage}
 * License: #{pkg.license}
 */

"""

MAIN_FILE_NAME = 'main'
DEST_FILE_NAME = 'waltz'
DEST = 'dest'

gulp.task 'browserify', ->
  browserify
    entries: ["./src/#{MAIN_FILE_NAME}.coffee"]
    extensions: ['.coffee', 'js']
  .bundle()
  .pipe source "#{DEST_FILE_NAME}.js"
  .pipe header(banner)
  .pipe gulp.dest("#{DEST}")


gulp.task 'serve', ->
  browserSync
    server:
      baseDir: './'
      index: 'demo/index.html'

gulp.task 'default', ['serve'], ->
  gulp.watch ["src/*.coffee"], ['browserify', browserSync.reload]

gulp.task 'major', ->
  gulp.src './*.json'
    .pipe bump(
      type: 'major'
    )
    .pipe gulp.dest('./')

gulp.task 'minor', ->
  gulp.src './*.json'
    .pipe bump(
      type: 'minor'
    )
    .pipe gulp.dest('./')

gulp.task 'patch', ->
  gulp.src './*.json'
    .pipe bump(
      type: 'patch'
    )
    .pipe gulp.dest('./')

gulp.task 'build', ['browserify'], ->
  gulp.src "#{DEST}/#{DEST_FILE_NAME}.js"
    .pipe uglify
      preserveComments: 'some'
    .pipe rename
      extname: '.min.js'
    .pipe gulp.dest("#{DEST}")
