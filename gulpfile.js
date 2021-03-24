"use strict";

// Пакеты, использующиеся при обработке
const gulp = require("gulp");
const autoprefixer = require('autoprefixer'); // ставит префиксы
const browserSync = require("browser-sync").create(); //локальный сервер, автообновление страницы
const del = require("del"); // библиотека для удаления файлов/папок
const csso = require("gulp-csso"); // минификация css
const htmlmin = require("gulp-htmlmin");  // минификация HTML
const imagemin = require("gulp-imagemin"); // оптимизация PNG-JPEG-SVG
const plumber = require("gulp-plumber"); // формирует вывод об ошибке. Но при этом работа Gulp не прерывается.
const postcss = require('gulp-postcss'); //плагин для преобразования итогового css-код, подключает другие плагины для работы. Как и posthtml.
const posthtml = require("gulp-posthtml"); // шаблонизатор для html, занимается видоизменением html-файлов. Как и postcss.
const rename = require("gulp-rename"); // переименовывает файлы
const sass = require("gulp-sass"); // компиляция из sass в css
const sourcemap = require("gulp-sourcemaps"); //в браузере, в инструментах разработчика, показывает измененный контент(код) в первоначальном виде.
const svgstore = require("gulp-svgstore"); // собирает svg спрайт
const webp = require("gulp-webp"); // создает webp из jpeg
const include = require("posthtml-include"); // плагин для posthtml, добавляет новый тег <include>, инлайним svg-sprite
const webpack = require('webpack-stream'); // webpack
const ghPages = require('gh-pages'); // публикация файлов на gh-pages
const path = require('path'); // его использует 'gh-pages'

//удаляем папку build.
gulp.task("cleanFolderBuild", function () {
  return del("build");
});

//копируем папки из папки source в папку build.
gulp.task("copyFolderBuild", function () {
  return gulp.src([
    "source/favicons/**",
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "!source/img/*.psd", // .psd не копировать
    "!source/img/rastr/Background-*.jpg", //Background-*.jpg не копировать
    "!source/img/rastr/background-*.jpg", //background-*.jpg не копировать
    "source/js/ofi.min.js",
    "source/js/picturefill.min.js",
    "!source/js/README"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

/*делаем из scss-файлов css-файл (gulp-sass), далее расставляем префиксы (postcss + autoprefixer), далее минифицируем css-файл (gulp-csso), переименовываем (gulp-rename) его в "style.min.css", и сохраняем в build/css.*/
gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
  //.pipe(server.stream());
});

//собрать svg-спрайт (gulp-svgstore), переименовать спрайт в "svg_sprite.svg" (gulp-rename), и сохранить в build/img/vector.
gulp.task("svg_sprite", function () {
  return gulp.src("source/img/vector/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("svg_sprite.svg"))
    .pipe(gulp.dest("build/img/vector"));
});


//инклюдим html-файл-блок и svg-спрайт в разметку html-файла
gulp.task("include_html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

//минификация html-файлов
gulp.task("minify_html", function () {
  return gulp.src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

//webapck
gulp.task('webpack', function () {
  return gulp.src('source/js/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('build/js'));
});

//локальный сервер (browser-sync).
gulp.task("server", function () {
  browserSync.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  //используем browser-sync для перезапуска страницы
  gulp.task("refresh", function (done) {
    browserSync.reload();
    done();
  });

  //----------------------------------------------------------------
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("svg_sprite", "include_html", "refresh"));
  gulp.watch("source/*.html", gulp.series("include_html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("webpack", "refresh"));
  // можно добавить gulp.watch() на добавление/изменение img, bg, icon и т.д.
});

//----------------------------------------------------------------
gulp.task("build", gulp.series(
  "cleanFolderBuild",
  "copyFolderBuild",
  "css",
  "svg_sprite",
  "include_html",
  "minify_html",
  "webpack"
));

gulp.task("start", gulp.series("build", "server"));

//----------------------------------------------------------------
//оптимизируем PNG-JPEG с помощью gulp-imagemin
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 75, progressive: true })
    ]))
    .pipe(gulp.dest("source/img"));
});

//конвертируем jpg в webp (gulp-webp)
gulp.task("webp", function () {
  return gulp.src([
    "source/img/**/*.{png,jpg}",
    "!source/img/**/bg-*.jpg", //bg-*.jpg не конвертировать в webp
    "!source/img/**/bg-*.png" //bg-*.png не конвертировать в webp
  ])
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("source/img"));
});

//----------------------------------------------------------------
//задача публикации на gh-pages
function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}
exports.deploy = deploy;
