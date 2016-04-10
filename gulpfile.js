// jscs:disable disallowAnonymousFunctions
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webpack = require('webpack');
var webpackConf = require('./tools/webpack.config.js');
var del = require('del');
var ChromeExtension = require("crx");
var fs = require("fs");

var resource = [
    './chrome/**/*',
    '!./chrome/scripts/*',
    '!./chrome/styles/*'];
var scssPath = './chrome/styles/*.scss';
var jsPath = './chrome/scripts/*.js';

gulp.task('clean', function (callback) {
    del.sync(['./build/*']);
    callback();
});

gulp.task('copy', ['clean'], function (callback) {
    var stream = gulp.src(resource).pipe(gulp.dest('build'));
    stream.on('error', function (err) {
        gutil.log("[COPY] Error: ", err);
        callback(err);
    });
    stream.on('end', function () {
        gutil.log("[COPY] Resource copy finished.");
        callback();
    });
});

gulp.task('scss', ['clean'], function (callback) {
    var stream = gulp.src(scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/styles'));
    stream.on('error', function (err) {
        gutil.log("[SCSS] Error:", err);
        callback(err);
    });
    stream.on('end', function () {
        gutil.log("[SCSS] Compile finished.");
        callback();
    });
});

gulp.task('webpack', ['clean'], function (callback) {
    webpack(webpackConf, function(err, stats) {
        if (err) {
            gutil.log("[WEB-PACK] Error:", err);
            callback(err);

        } else {
            gutil.log("[WEB-PACK] Success", stats.toString());
            callback();
        }
    });
});

gulp.task('build', ['copy', 'scss', 'webpack'], function (callback) {
    var crx = new ChromeExtension({
        privateKey: fs.readFileSync("./src.pem")
    });
    crx.load('./build').then(function(){
        return crx.loadContents();

    }).then(function(archiveBuffer){
        fs.writeFile('./build/Github-Stars-Categorizer.zip', archiveBuffer);
        return crx.pack(archiveBuffer);

    }).then(function(crxBuffer){
        fs.writeFile('./build/Github-Stars-Categorizer.crx', crxBuffer);

    }).then(callback);
});

gulp.task('watch', function () {
    gulp.watch(scssPath, ['build']);
    gulp.watch(jsPath, ['build']);
});


gulp.task('default', ['build']);
