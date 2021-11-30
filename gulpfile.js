const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();

// Normalize.css

const normalize = () => {
  return gulp.src('source/normalize.css')
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('normalize.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

exports.normalize = normalize;

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src('source/*.html')
    // .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
    // .pipe(terser())
    // .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimiseImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
}

exports.optimiseImages = optimiseImages;

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('build/img'))
}

exports.copyImages = copyImages;

// WebP

const createWebp = () => {
  return gulp.src('source/img/jpg/*.jpg')
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest('build/img/webp'))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src('source/img/svg/icons/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/svg'))
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/manifest.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimiseImages,
  gulp.parallel(
    normalize,
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    normalize,
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
