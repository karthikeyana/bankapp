'use strict';

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	// watch = require('gulp-watch'),
	babel = require('gulp-babel');
		
// =============================================================================
// the development procedures
// =============================================================================

gulp.task('default', ['nodemon'], function() {
	console.log('Done with development procedure!');
});

gulp.task('nodemon', ['compile:es6'], function () {
    nodemon({
        script: 'output/index.js',
		watch: 'src',
		tasks: ['recompile:es6'],
        env: { 'NODE_ENV': 'development' }
	}).on('restart', function(changed) {
		console.info(changed);
		console.log('restart');
	});
});

// gulp.task('watch:es6', ['compile:es6'], function() {
   // return gulp.watch([
			// '*.js',
			// 'src/**/*.js'
		// ], ['recompile:es6']);
// });

function compileEs6() {
	return gulp.src(['src/**/*.js'])
		.pipe(babel())
		.pipe(gulp.dest('output'));
}
gulp.task('compile:es6', compileEs6);
gulp.task('recompile:es6', compileEs6);

// =============================================================================
// the release procedures
// =============================================================================
gulp.task('release', ['compile:es6'], function(){
	console.log('Done with release procedure!');
});
