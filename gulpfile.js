var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

const configured_typescript = typescript.createProject("server_tsconfig.json");

var rimraf = require('rimraf');

gulp.task('dry', (cb) => {
	gulp.src(['backup', 'dist', 'dmg', 'documentation', 'logs/*.log', 'out-tsc', 'product', 'public'], {read: false}).pipe(rimraf());
});

gulp.task('clean', (cb) => {
	rimraf('product', cb);
});

gulp.task('compile', () => {
	return gulp.src([
		'app.ts',
		'main.ts',
		'models/**/*.ts',
		'bridge/**/*.ts',
		'server/**/*.ts',
		'types/**/*.ts'
	], {base: './'})
		.pipe(sourcemaps.init())
		.pipe(configured_typescript())
		.js
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
});

// switch config
gulp.task('prebuild', () => {
	return gulp.src([
		'defaults/platform/default.js'
	], {base: './defaults/platform', allowEmpty: true})
		.pipe(gulp.dest('config'));
});

// copy
gulp.task('build', () => {
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
		'bridge/**/*.js',
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
		'cluster.json',
		'*.p8'
	], {base: './', allowEmpty: true})
		.pipe(gulp.dest('product'));

});

gulp.task('default', gulp.series('clean', 'compile', 'prebuild', 'build'), () => {

});
