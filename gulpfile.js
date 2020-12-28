var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

const configured_typescript = typescript.createProject("server_tsconfig.json");

var rimraf = require('rimraf');

gulp.task('dry', (cb) => {
	rimraf('backup', cb);
	rimraf('dist', cb);
	rimraf('dmg', cb);
	rimraf('documentation', cb);
	rimraf('logs/*.log.*', cb);
	rimraf('out-tsc', cb);
	rimraf('product', cb);
	rimraf('public', cb);
});

gulp.task('clean', (cb) => {
	rimraf('product', cb);
});

gulp.task('compile', () => {
	return gulp.src([
		'app.ts',
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
		'package-lock.json',
		'htdigest',
		'cluster.json',
		'*.p8'
	], {base: './', allowEmpty: true})
		.pipe(gulp.dest('product'));

});

gulp.task('default', gulp.series('clean', 'compile', 'prebuild', 'build'), () => {

});

// copy
gulp.task('base_core', () => {
	return gulp.src([
		'dualuse/*.*/*.*',
		'models/platform/**/*.ts',
		'models/plugins/**/*.ts',
		'server/applications/**/*.ts',
		'server/platform/**/*.ts',
		'server/platform/assets/**/*.*',
		'server/plugins/**/*.ts',
		'src/*.*',
		'src/app/*.*',
		'src/app/platform/**/*.*',
		'src/app/plugins/**/*.*',
		'src/assets/**/*.*',
		'src/environments/*.ts',
		'views/*.pug',
		'views/platform/**/*.pug',
		'views/plugins/**/*.pug',
		'types/platform/**/*.ts',
		'types/plugins/**/*.ts',
		'gulpfile.js',
		'app.ts',
		'patch.js',
		'package.json',
		'package-lock.json',
		'tsconfig*.json',
	], {base: './', allowEmpty: true})
		.pipe(gulp.dest('base_core'));
});
