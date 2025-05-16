var gulp   = require("gulp"),
    stylus = require("gulp-stylus"),
    sass = require('gulp-sass');
    watch  = require("gulp-watch"),
    nib    = require("nib");
    sourcemaps = require('gulp-sourcemaps');
    gutil = require("gulp-util");
    styledocco = require("gulp-styledocco")
    less = require('gulp-less')


    var sourcemaps = require('gulp-sourcemaps');

gulp.task("default", ["stylus"]);

// Stylus
gulp.task("stylus", function () {
    var s = stylus({
            compress: false,
            use: nib()
        })
    return gulp.src("src/css/*.styl")
    .pipe(sourcemaps.init())
        .pipe(s.on('error',function(e){ 
            gutil.log(e)
            s.end()
        }))
       .pipe(gulp.dest("public/css"));
});



gulp.task('less', function () {
  return gulp.src('src/css/semantic-ui/semantic.less')
    .pipe(less().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});


//Sass
gulp.task('sass', function () {
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("public/css"));
});


gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest("public/css"));
});


gulp.task("images", function () {
       gulp.src("src/images/**/*.*")
       .pipe(gulp.dest("./public/images"));

       return  gulp.src("src/css/fonts/*.*")
       .pipe(gulp.dest("./public/css/fonts"));

});

gulp.task("html", function () {
    return gulp.src("src/index.html")
       .pipe(gulp.dest("./public/"));
});




gulp.task('styledocco', function () {
  gulp.src('public/css/app.css')
    .pipe(styledocco({
      out: 'public/docs',
      name: 'si3rc style',
      'no-minify': true
    }));
});


// Watch Files For Changes
gulp.task("watch",["images","html","sass","css","stylus"], function() {
    gulp.watch(["src/css/**/*","src/index.html","src/images/**/*.*"], ["images","sass","html","css","stylus"]);
    gulp.watch(["src/css/**/*.less","src/css/**/*.variables"], ["less"]);
})

gulp.task("watchless",["less"], function() {
    gulp.watch(["src/css/**/*.less"], ["less"]);

})




// var gulp = require('gulp');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
// var gutil = require("gulp-util");
// var webpack = require("webpack");
// var WebpackDevServer = require("webpack-dev-server");
// var webpackConfig = require("./webpack.config.js");
// var stream = require('webpack-stream');


// gulp.task('webpack', [], function() {
//     return gulp.src(path.ALL)
//         .pipe(sourcemaps.init())
//         .pipe(stream(webpackConfig))
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.DEST_BUILD));
// });



// gulp.task("webpack-dev-server", function(callback) {
//     // modify some webpack config options
//     var myConfig = Object.create(webpackConfig);
//     myConfig.devtool = "eval";
//     myConfig.debug = true;

//     // Start a webpack-dev-server
//     new WebpackDevServer(webpack(myConfig), {
//         publicPath: "/" + myConfig.output.publicPath,
//         stats: {
//             colors: true
//         }
//     }).listen(8080, "localhost", function(err) {
//         if (err) throw new gutil.PluginError("webpack-dev-server", err);
//         gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
//     });
// });

// var path = {
//     HTML: 'src/index.html',
//     ALL: ['src/**/*.jsx', 'src/**/*.js'],
//     MINIFIED_OUT: 'build.min.js',
//     DEST_SRC: 'dist/src',
//     DEST_BUILD: 'dist/build',
//     DEST: 'dist'
// };



// gulp.task('watch', function() {
//     gulp.watch(path.ALL, ['webpack']);
// });


// gulp.task('default', ['webpack-dev-server', 'watch']);
// });