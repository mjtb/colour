/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
const gulp = require('gulp');
const ts = require('gulp-typescript');
const jsdoc = require('gulp-jsdoc3');
const proj = ts.createProject('tsconfig.json');
const jasmine = require('gulp-jasmine');

gulp.task('default', function() {
	return proj.src().pipe(proj()).js.pipe(gulp.dest('lib'));
});
gulp.task('test', function() {
	return gulp.src([
		'lib/**/*[Ss]pec.js',
		'spec/helpers/**/*.js'
	]).pipe(jasmine());
});
gulp.task('doc', function(cb) {
	gulp.src([
		'README.md',
		'lib/colour.js',
		'lib/component.js',
		'lib/rgb.js',
		'lib/linear.js',
		'lib/hsl.js',
		'lib/hwb.js',
		'lib/xyz.js',
		'lib/lab.js',
		'lib/lch.js',
		'lib/yuv.js',
		'lib/ycc.js',
		'lib/palette.js',
		'lib/palettes.js'
	], { read: false }).pipe(jsdoc(cb));
});
