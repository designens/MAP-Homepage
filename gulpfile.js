/*! gulpfile.js v1.0.0 © https://gitlab.dev.dnm.com/publishing/map-homepage */

// =======================================
// NPM 모듈 호출
// =======================================

var gulp        = require('gulp'),
    g_if        = require('gulp-if'),
    shell       = require('gulp-shell'),
    rename      = require('gulp-rename'),
    filter      = require('gulp-filter'),

    includer    = require('gulp-html-ssi'),

    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    csso        = require('gulp-csso'),

    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),

    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),

    bower       = require('bower'),
    preen       = require('preen'),

    browserSync = require('browser-sync'),
    reload      = browserSync.reload;


// =======================================
// 환경설정
// =======================================

// 디렉토리 설정
const SRC   = 'markup';
const BUILD = 'public';
const BOWER = 'bower_components';

// 파일 압축 설정 (true, false)
var compress = {
  'css_singleline' : true,
  'js' : true,
};

// 디렉토리 설정
var dir = {
  'css': SRC + '/css',
  'js' : SRC + '/js',
};

// js 플러그인(Plugin) 병합
var js_order = [
  dir.js + '/lib/svg-injector.min.js',
  dir.js + '/lib/flickity.pkgd.min.js',
];

// js 플러그인(Plugin) 이동
var moveJSLIB = [
  dir.js + '/lib/modernizr-3.3.1.min.js',
  dir.js + '/lib/jquery.min.js',
]

// js 유지관리 파일 이동
var moveJS = [
  dir.js + '/dnm-common.js',
];

// =======================================
// 기본 업무
// =======================================
gulp.task('default', ['remove', 'bower', 'bower:copy', 'preen', 'server']);

// =======================================
// 빌드 업무
// =======================================
gulp.task('build', function() {
  compress.css = true;
  compress.js  = true;
  gulp.start('remove');
  gulp.start('htmlSSI');
  gulp.start('sass');
  gulp.start('js');
  gulp.start('imagemin');
  setTimeout(function() {
    gulp.start('css:min');
  }, 7000);
 });

// =======================================
// 관찰 업무
// =======================================
gulp.task('watch', function() {
  gulp.watch( SRC + '/**/*.html', ['htmlSSI'] );
  gulp.watch( SRC + '/sass/**/*', ['sass']);
  gulp.watch( SRC + '/js/**/*', ['js']);
  gulp.watch( SRC + '/images/**/*', ['imagemin']);
  gulp.watch( SRC + '/**/*.html' ).on('change', reload);
  gulp.watch( 'gulpfile.js' ).on('change', reload);
 });

// =======================================
// 폴더 제거 업무
// =======================================
gulp.task('remove', shell.task('rm -rf ' + BUILD + ' ' + BUILD + '/assets/stylesheets/map ' + BUILD + '/assets/stylesheets/dum-style.css '));

// =======================================
// 서버 업무
// =======================================
gulp.task('server', ['imagemin', 'htmlSSI', 'sass', 'js'], function() {
  browserSync.init({
    // 알림 설정
    notify: !true,
    // 포트 설정
    port: 9090,
    // 서버 설정
    server: {
      // 기본 디렉토리 설정
      baseDir: [ BUILD ],
      // 라우트 설정
      routes: {
        '/bower_components' : 'bower_components',
      }
    },
  });
  gulp.start('watch');
 });

// =======================================
// HTML SSI(Server Side Include) 업무
// =======================================
// 로컬서버 설정하여 인크루드 사용
// [참고] https://www.npmjs.com/package/gulp-html-ssi
gulp.task('htmlSSI', function() {
  gulp.src( SRC + '/**/*.html' )
    .pipe( includer() )
    .pipe( gulp.dest( BUILD ) );
 });

// =======================================
// Sass 업무
// =======================================
gulp.task('sass', function() {
  return gulp.src( SRC + '/sass/**.{sass,scss}')
    .pipe(sourcemaps.init())
    .pipe( sass({
      'outputStyle': compress.css_singleline ? 'compact' : 'expanded'
    }).on('error', sass.logError) )
    .pipe( sourcemaps.write( './map' ) )
    .pipe( gulp.dest(BUILD + '/assets/stylesheets') )
    .pipe( filter("**/*.css") )
    .pipe( reload({stream: true}) );
 });

gulp.task('css:min', function() {
  gulp.src(BUILD + '/assets/stylesheets/dnm-style.css')
    .pipe( csso() )
    .pipe( rename('dnm_style.min.css') )
    .pipe( gulp.dest(BUILD + '/assets/stylesheets') );
 });

// =======================================
// JS 병합 업무
// =======================================
gulp.task('js', ['js:concat']);

// 공통 JS  파일 이동
gulp.task('js:moveJS', function() {
  gulp.src( moveJS )
    .pipe( gulp.dest( BUILD + '/assets/javascripts') );
  gulp.src( moveJSLIB )
    .pipe( gulp.dest( BUILD + '/assets/javascripts/lib') );
 });

// 공통 JS 파일 병합 후 이동
gulp.task('js:concat', ['js:moveJS'], function() {
  gulp.src( js_order )
    .pipe( concat('dnm-bundle.js') )
    .pipe( gulp.dest( BUILD + '/assets/javascripts' ) )
    .pipe( g_if(compress.js, uglify()) )
    .pipe( g_if(compress.js, rename( 'dnm-bundle.min.js' )) )
    .pipe( gulp.dest( BUILD + '/assets/javascripts' ) );
 });

// =======================================
// Images min 업무
// =======================================
gulp.task('imagemin', function () {
  return gulp.src( SRC + '/images/**/*' )
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe( gulp.dest( BUILD + '/assets/images' ) );
 });

// =======================================
// Bower 프래임워크 관리 업무
// =======================================
// Bower component : 프래임워크(Framework) 다운
gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
});

// 프래임워크(Framework) 불필요한 파일 제거
// [참고] https://www.npmjs.com/package/preen
gulp.task('preen', function(cb) {
  preen.preen({}, cb);
});

// 프래임워크(Framework) 폴더 관리
gulp.task('bower:copy', function() {
  // Susy
  gulp.src( BOWER + '/susy/sass/**' )
    .pipe ( gulp.dest( SRC + '/sass/lib/susy' ))
  // Font Awesome : fonts
  gulp.src( BOWER + '/font-awesome/fonts/**' )
    .pipe ( gulp.dest( BUILD + '/assets/fonts' ))
    .pipe ( gulp.dest( SRC + '/sass/lib/font-awesome/fonts' ))
  // Font Awesome : css
  gulp.src( BOWER + '/font-awesome/css/**' )
    .pipe ( gulp.dest( SRC + '/sass/lib/font-awesome/css' ))
  // jQuery
  gulp.src( BOWER + '/jquery/dist/jquery.min.js' )
    .pipe ( gulp.dest( BUILD + '/assets/javascripts/lib' ))
  // Svg injector
  gulp.src( BOWER + '/svg-injector/dist/svg-injector.min.js' )
    .pipe ( gulp.dest( SRC + '/js/lib' ));
});