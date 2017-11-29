import fs from 'fs';
import path from 'path';
import del from 'del';
import gulp from 'gulp';
import include from 'gulp-include';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import insert from 'gulp-insert';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import replace from 'gulp-replace';
import newer from 'gulp-newer';
import pug from 'gulp-pug';
import eslint from 'gulp-eslint';
import browserify from 'gulp-browserify';
import postcss from 'gulp-postcss';
import uglify from 'gulp-uglify';
import scss from 'gulp-sass';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import inlineComment from 'postcss-inline-comment';
import flexbugsFixes from 'postcss-flexbugs-fixes';
import colorFunction from 'postcss-color-function';
import spriteStyles from 'postcss-sprite-styles';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';
import imageDimensions from 'gulp-css-image-dimensions';
import base64 from 'gulp-base64';

const server = browserSync.create();

const config = {
  init() {
    const paths = {
      dev: 'src/',
      dist: 'dist/',
      include: 'inc/',
    };
    paths.pug = {
      dev: `${paths.dev}pug/`,
      dist: paths.dist,
    };
    paths.pages = {
      dev: `${paths.pug.dev}pages/`,
      dist: paths.dist,
    };
    paths.modules = {
      dev: `${paths.pug.dev}modules/`,
      dist: '.tmp/module-templates',
    };
    paths.scss = {
      dev: `${paths.dev}scss/`,
      dist: `${paths.dist}css/`,
    };
    paths.js = {
      dev: `${paths.dev}js/`,
      dist: `${paths.dist}js/`,
    };
    paths.img = {
      dev: `${paths.dev}img/`,
      dist: `${paths.dist}img/`,
    };
    paths.icons = {
      dev: `${paths.dev}icons/`,
      dist: `${paths.dist}img/`,
    };
    paths.static = {
      dev: `${paths.dev}static/`,
      dist: paths.dist,
    };

    this.paths = paths;

    this.getPath = (to, ext = to) => `${this.paths[to].dev}**/*.${ext}`;

    this.getPathExcludeInc = (to, ext = to) => [`${this.paths[to].dev}**/*.${ext}`, `!${this.paths[to].dev}inc/**/*.${ext}`];

    delete this.init;
    return this;
  },
}.init();

const errorHandler = function errorHandler(err) {
  notify.onError({
    title: `Gulp error in ${err.plugin}`,
    message: `\n${err.message.toString()}`,
  })(err);
  this.emit('end');
};

gulp.task('clean', () => {
  del.sync(`${config.paths.dist}**/**`);
  del.sync('.tmp');
  return gulp.run('default');
});

gulp.task('clean-tmp', () => del.sync('.tmp'));

// Pages

gulp.task('pages', () => gulp.src(config.getPathExcludeInc('pages', 'pug'))
  .pipe(plumber({ errorHandler }))
  .pipe(insert.prepend('//=include ../modules/*\n'))
  .pipe(include())
  .pipe(pug())
  .pipe(gulp.dest(config.paths.pages.dist)));

gulp.task('pages-watch', ['pages'], () => server.reload());

// Modules

gulp.task('modules', () => {
  let loaded = [];
  let dependencies = [];

  function getDependencies(content) {
    const matched = content.match(/^[ \t]{0,}\+([A-z0-9_-]{0,}[(\n])/gm);
    const result = [];

    if (matched !== null) {
      matched.forEach((item) => {
        const name = item.trim().slice(1, -1);
        if (result.indexOf(name) === -1) {
          result.push(name);
        }
      });
    }
    return result;
  }

  function diff(a, b) {
    return a.filter(i => b.indexOf(i) < 0);
  }

  let first = true;
  return gulp.src(config.getPathExcludeInc('modules', 'pug'))
    .pipe(plumber({ errorHandler }))
    .pipe(insert.transform((contents) => {
      if (first) {
        first = false;
      } else {
        return contents;
      }

      let result = contents;
      let mixin = 'mixin ';
      let pos = result.indexOf(mixin) + mixin.length;
      let parsing = true;
      let brackets = 0;
      while (parsing) {
        const char = contents[pos];
        mixin += char;
        if (char === '(') {
          brackets += 1;
        } else if (char === ')') {
          brackets -= 1;

          if (brackets === 0) {
            parsing = false;
          }
        }
        pos += 1;
      }

      dependencies = getDependencies(result);

      const loadModules = (item) => {
        if (fs.existsSync(`${config.paths.modules.dev}${item}.pug`)) {
          const data = fs.readFileSync(`${config.paths.modules.dev}${item}.pug`, 'utf-8');
          result = `${data}\n${result}`;
        }
      };

      while (dependencies.length !== loaded.length) {
        diff(dependencies, loaded).forEach(loadModules);

        loaded = dependencies;
        dependencies = getDependencies(result);
      }
      result += `\n+${mixin}`;
      dependencies = [];
      loaded = [];
      return result;
    }))
    .pipe(pug({
      client: true,
      compileDebug: false,
    }))
    .pipe(replace('function template(locals)', 'module.exports = function(locals)'))
    .pipe(gulp.dest(config.paths.modules.dist));
});

gulp.task('modules-watch', ['modules'], () => server.reload());

// SCSS

gulp.task('scss-task-2', () => gulp.src('.tmp/css/*.*')
  .pipe(base64({
    baseDir: 'dist/css',
    // maxImageSize: 8*1024, // bytes,
    deleteAfterEncoding: false,
    debug: false,
  }))
  .pipe(cssnano())
  .pipe(gulp.dest(config.paths.scss.dist))
  .pipe(server.stream()));

gulp.task('scss-task-1', () => {
  const processors = [
    inlineComment,
    colorFunction,
    normalize,
    spriteStyles({
      to: path.resolve(__dirname, '.tmp/css'),
    }),
    autoprefixer(),
    flexbugsFixes,
  ];

  return gulp.src(config.getPathExcludeInc('scss'))
    .pipe(plumber({ errorHandler }))
    .pipe(include())
    .pipe(scss())
    .pipe(imageDimensions())
    .pipe(postcss(processors))
    .pipe(gulp.dest('.tmp/css'));
});

gulp.task('scss', (done) => {
  runSequence('scss-task-1', 'scss-task-2', () => {
    done();
  });
});

gulp.task('scss-watch', ['scss']);

// Images

gulp.task('images', () => gulp.src(config.getPath('img', '*'))
  .pipe(plumber({ errorHandler }))
  .pipe(newer(config.paths.img.dist))
  .pipe(imagemin())
  .pipe(gulp.dest(config.paths.img.dist)));


gulp.task('images-watch', ['images'], () => server.reload());

// Images-SCSS

gulp.task('images-scss', (done) => {
  runSequence('images', 'scss', () => {
    done();
  });
});

// JavaScript

gulp.task('js-task-1', () => gulp.src(config.getPath('js'))
  .pipe(plumber({ errorHandler }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(gulp.dest('.tmp/js')));

gulp.task('js-task-2', () => gulp.src('.tmp/js/main.js')
  .pipe(plumber({ errorHandler }))
  .pipe(browserify({
    insertGlobals: true,
    transform: ['babelify'],
  }))
  .pipe(uglify())
  .pipe(gulp.dest(config.paths.js.dist)));

gulp.task('js-task', (done) => {
  del.sync('.tmp/js/**');

  runSequence('js-task-1', 'js-task-2', () => {
    done();
  });
});

gulp.task('js-modules', (done) => {
  runSequence('modules', 'js-task', () => {
    done();
  });
});
gulp.task('js', ['js-task']);
gulp.task('js-watch', ['js'], () => server.reload());

// Static

gulp.task('static', () => gulp.src(config.getPathExcludeInc('static', '*'))
  .pipe(plumber({ errorHandler }))
  .pipe(newer(config.paths.dist))
  .pipe(gulp.dest(config.paths.static.dist)));

gulp.task('static-watch', ['static'], () => server.reload());

// Watcher

gulp.task('watcher', () => {
  gulp.watch(config.getPath('pages', 'pug'), ['pages-watch']);
  gulp.watch(config.getPath('modules', 'pug'), ['js-watch', 'pages-watch']);
  gulp.watch(config.getPath('scss'), ['scss-watch']);
  gulp.watch(config.getPath('js'), ['js-watch']);
  gulp.watch(config.getPath('static', '*'), ['static-watch']);
  gulp.watch(config.getPath('img', '*'), ['images-watch', 'scss-watch']);
});

// Server

gulp.task('server', () => {
  server.init({
    server: config.paths.dist,
  });
});

gulp.task('default', ['pages', 'js-modules', 'images-scss', 'static']);
gulp.task('watch', ['default', 'watcher', 'server']);
gulp.task('build', ['clean', 'default']);
