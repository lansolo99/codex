// REQUIREMENTS

var gulp = require('gulp')
var sass = require('gulp-sass')

var cleanCSS = require('gulp-clean-css')
var del = require('del')
var git = require('gulp-git')
var gitignore = require('gulp-gitignore')
var runSequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var stripDebug = require('gulp-strip-debug')
var strip = require('gulp-strip-comments')
var stripCssComments = require('gulp-strip-css-comments')
var removeHtmlComments = require('gulp-remove-html-comments')
var tinyPng = require('gulp-tinypng')
var useref = require('gulp-useref')
var cleanCSS = require('gulp-clean-css')
var uglify = require('gulp-uglify')
var terser = require('gulp-terser')
var rename = require('gulp-rename')
var pump = require('pump')
var iconfont = require('gulp-iconfont')
var iconfontCss = require('gulp-iconfont-css')
var retina = require('gulp-retina-workflow')
var cssRetina = require('gulp-css-retina')
var imagemin = require('imagemin')
var imageminWebp = require('imagemin-webp')
var webp = require('gulp-webp')

// Iconfont
var runTimestamp = Math.round(Date.now() / 1000)
var fontName = 'iconfont'

// VARS

var projectURL = 'localhost:8888'
var retinaWorkflowOpts = {
  flags: [{
    suffix: '@1x',
    scale: 1,
    suffixOut: ''
  },
  {
    suffix: '@2x',
    scale: 2,
    suffixOut: '@2x'
  },
  {
    suffix: '@3x',
    scale: 3,
    suffixOut: '@3x'
  },
  {
    suffix: '@4x',
    scale: 4,
    suffixOut: '@4x'
  }
  ],
  extensions: ['jpg', 'jpeg', 'png'],
  roundUp: true,
  quality: 1
}

// TESTING

gulp.task('hello', function () {
  console.log('Hello')
})

gulp.task('iconfont', function () {
  gulp.src(['./src/assets/images/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: './src/styles/templates/_icons.scss',
      targetPath: '../../../styles/icons.scss',
      fontPath: '~@/assets/fonts/icons/'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      timestamp: runTimestamp,
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest('./src/assets/fonts/icons/'))
})

// Retina workflow
gulp.task('retina-workflow', function () {
  return gulp
    .src('./src/assets/images/**/*')
    .pipe(retina(retinaWorkflowOpts))
    .pipe(gulp.dest('./src/assets/images'))
})

// tinyPng (to execute once -> limited amount of usage (500/month))
gulp.task('tinyPng', function () {
  gulp
    .src([
      'src/images/**/*',
      '!src/images/**/*.svg',
      '!src/images/favicons/*',
      '!src/images/icons/*'
    ])
    .pipe(imagemin('xyz7960IcsVcK4JsjkU96KtGS5xvdfhI'))
    .pipe(gulp.dest('src/images'))
})

// ImgToWebp
gulp.task('imgToWebp', () =>
  gulp.src('src/images/temp-webp/*')
    .pipe(webp())
    .pipe(gulp.dest('src/images/temp-webp/optimized'))
)
