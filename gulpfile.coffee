gulp = require 'gulp'
browserify = require 'browserify'
source = require 'vinyl-source-stream'
header = require 'gulp-header'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
requireDir = require 'require-dir'
browserSync = require 'browser-sync'
pkg = require './package.json'

requireDir './tasks'

reload = browserSync.reload

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
DEMO = 'demo'

gulp.task 'browserify', ->
  browserify
    entries: ["./src/#{MAIN_FILE_NAME}.coffee"]
    extensions: ['.coffee', 'js']
  .bundle()
  .pipe source "#{DEST_FILE_NAME}.js"
  .pipe header(banner)
  .pipe gulp.dest("#{DEST}")
  .pipe gulp.dest("#{DEMO}")


gulp.task 'serve', ->
  browserSync
    startPath: '/'
    server:
      baseDir: './'
      index: 'demo/'
      routes:
        '/': 'demo/'

gulp.task 'default', ['serve'], ->
  gulp.watch ['src/*.coffee'], ['browserify', reload]

gulp.task 'build', ['browserify'], ->
  gulp.src "#{DEST}/#{DEST_FILE_NAME}.js"
    .pipe uglify
      preserveComments: 'some'
    .pipe rename
      extname: '.min.js'
    .pipe gulp.dest("#{DEST}")
