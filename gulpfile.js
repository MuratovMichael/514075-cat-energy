"use strict";

var gulp = require("gulp");
var csso = require("gulp-csso");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify =  require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var run = require("run-sequence");
var del = require("del");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var uglify = require("gulp-uglify");
var pump = require("pump");
var svgstore = require("gulp-svgstore");

// ============минификация стилей==========

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// ==================SVG спрайт==========
gulp.task("sprite", function() {
  return gulp.src("source/img/sprite/sp-*.svg")
  .pipe(svgstore({
    inlineSvg :true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

// ========минификация изображений=========
gulp.task("image", function() {
  return gulp.src("source/img/**/*.{png,svg,jpeg,jpg}")
  pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
      ]))
    .pipe(gulp.dest("build/img"));
});

// ===========минификация JS====================

gulp.task("compress", function (cb) {
  pump([
        gulp.src((["source/js/*.js","!js/*.min.js"])),
        uglify(),
      rename({suffix: ".min"}),
        gulp.dest("build/js")
    ],
    cb
  );
});

// ===============posthtml==============
gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build"));
});

// ==========Изображения WEBP===========
gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality:90}))
    .pipe(gulp.dest("build/img"));
});

// ===========копирование файлов=========
gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
  })

// ================удаление build========
gulp.task("clean", function() {
  return del("build");
});
// ==============Сервер====================
gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});
// =============Последовательный запуск===
gulp.task("build", function(done) {
  run(
         "clean",
         "copy",
         "compress",
         "style",
         "html",
         "image",
         "webp",
         "sprite",
         done
       );
});
