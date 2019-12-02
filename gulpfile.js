var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var rimraf = require('rimraf');

gulp.task('clean', function(cb) {
	rimraf('product', cb);
});

gulp.task('compile', function(){

	return gulp.src([
		'app.ts',
		'main.ts',
		'models/**/*.ts',
		'server/**/*.ts',
		'types/**/*.ts'
	], { base: './' })
		.pipe(sourcemaps.init())
		.pipe(typescript({ target: "ES5", removeComments: true }))
		.js
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));

});

gulp.task('build', function () {

	return gulp.src([
		'config/*.json',
		'config/platform/logs.json',
		'config/default.js',
		'logs/*',
		'models/**/*.js',
		'models/**/*.json',
		'public/**/*.js',
		'public/**/*.css',
		'public/**/*.html',
		'public/images/*.*',
		'public/favicon/*.*',
		'server/**/*.js',
		'server/**/*.pug',
		'server/platform/**/*.js',
		'server/platform/assets/**/*.*',
		'views/**/*.pug',
		'types/**/*.js',
		'app.js',
		'patch.js',
		'package.json',
		'htdigest',
		'cluster.json'
	], { base: './', allowEmpty: true })
		.pipe(gulp.dest('product'));

});

gulp.task('default',gulp.series('clean', 'compile','build'), function(){

});
