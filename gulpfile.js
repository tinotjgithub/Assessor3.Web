var gulp = require('gulp');
var jsonlint = require('gulp-jsonlint');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var exec = require('child_process').exec;
var del = require('del');
var fs = require('fs');
var colors = require('colors');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");
var inject = require('gulp-inject');

// create a single instance of the compiler to allow caching
var webpackHash = '';

var gulpConfig = {
    'dest': './build/generated/',
    'root': './',
    'webpackConfig': './webpack.config.js',
    'html': {
        'src': './index.html'
    },
    'config': {
        'src': './config.js'
    },
    'languages': {
        'src': './languages.js'
    },
    'resourcesSrc': './content/resources/',
    'langsDest': './build/generated/tinymce/langs/'
}

gulp.task('dist', function (callback) {
    runSequence(
        'json-lint',
        'clean-build',
        'webpack-build',
        'copy-config',
        'copy-languages',
        'dist-html',
        'dist-content',
        'dist-tinymce-js',
        'dist-synchronisers',
        'dist-mce-lang-gen',
        'inject-html',
        function (error) {
            if (error) {
                gutil.error(error.message.bold.red);
            }
            callback(error);
        });
});

gulp.task('dist-html', function () {
    return gulp.src(['javascriptdisabled.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('dist-js', function () {
    return gulp.src('js/**')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dist-tinymce-js', function () {
    return gulp.src(['src/utility/tinymce/**/*'], {}).pipe(gulp.dest('build/generated/tinymce'));
});

gulp.task('dist-content', function () {
    return gulp.src('content/**')
        .pipe(gulp.dest('dist/content/'));
});

gulp.task('dist-synchronisers', function () {
    return gulp.src('src/utility/backgroundworkers/synchronisers/**')
        .pipe(gulp.dest('build/generated/synchronisers'));
});


// Cleaning build and dist folders.
gulp.task('clean-build', function () {
    gutil.log(gutil.colors.grey('Files and folders will be deleted in folders: [build/generated/**, dist/**]'));
    return del(['build/generated/**', 'dist/**', 'index.html']);
    // Commented on purpose to avoid unwanted log inti the build output
    // .then(paths => {
    //     if (paths.length > 0) {
    //         gutil.log(gutil.colors.grey('Files and folders that would be deleted: \n', paths.join('\n')));
    //     }
    // });
});

// checks for JSON breaks in resource files
gulp.task('json-lint', function () {
    return gulp.src(['./src/**/*.json', './content/**/*.json'])
        .pipe(jsonlint())
        .pipe(jsonlint.failOnError())
        .pipe(jsonlint.reporter(function (file) {
            gutil.log(gutil.colors.yellow('File is not valid JSON => ' + file.path));
        }));
});

gulp.task('dist-mce-lang-gen', function () {
    fs.readdir(gulpConfig.resourcesSrc, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            fs.readFile(gulpConfig.resourcesSrc + filename, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                try {
                    var mceLangFileName = filename.split('.')[0];
                    var json = JSON.parse(content.toString().trim());
                    var mce = json['messaging']['compose-message']['tiny-mce'];

                    fs.writeFile(gulpConfig.langsDest + mceLangFileName + '.js',
                        "tinymce.addI18n('" + mceLangFileName + "'," + JSON.stringify(mce) + ");", null);

                } catch (ex) {
                    gutil.error('FileName : ' + filename + ex);
                }
            });
        });
    });
});


gulp.task('webpack-build', function (done) {
    var compiler = webpack(require(gulpConfig.webpackConfig));
    // compiler.apply(new webpack.ProgressPlugin());
    compiler.run(function (err, stats) {
        console.log('Generating minified bundle for production use via Webpack...'.blue.bold);
        if (err) {
            throw new gutil.PluginError('webpack:build', error.red);
        };
        var jsonStats = stats.toJson();
        if (jsonStats.errors && jsonStats.errors.length) {
            // Formatting errors 
            formatWebpackError(jsonStats.errors);

            throw new gutil.PluginError({
                plugin: 'webpack-build',
                message: '[WEBPACK-BUILD FAILED]'
            });
        }

        if (jsonStats.warnings && jsonStats.warnings.length) {
            gutil.log('Webpack generated the following warnings: '.bold.yellow);
            jsonStats.warnings.map(warning => gutil.log(warning.yellow));
        }

        // If you require detailed webpack build log, uncomment the following line.   
        gutil.log('[webpack:build]', colors.bgBlack(stats.toString({
            colors: true,
            children: false,
            publicPath: true,
            chunks: false,
            modules: false,
        })));

        gutil.log('Your app has been compiled in production mode. It\'s ready to roll!'.bold.green);
        // Setting the webpack hash 
        webpackHash = jsonStats.hash;

        done();
    });
});

gulp.task('copy-config', function (done) {
    var configFileName = 'config.' + webpackHash + '.js';

    if (webpackHash != null && webpackHash.length > 0) {
        gutil.log('Copying config and language files. Hash: '.cyan + webpackHash.bold.green);

        // rename config file with hash
        return gulp.src(gulpConfig.config.src)
            .pipe(rename(configFileName))
            .pipe(gulp.dest(gulpConfig.dest));
    }
});

gulp.task('copy-languages', function () {
    var languagesFileName = 'languages.' + webpackHash + '.js';

    if (webpackHash != null && webpackHash.length > 0) {
        gutil.log('Copying language file. Hash: '.cyan + webpackHash.bold.green);

        // rename languages file with hash
        return gulp.src(gulpConfig.languages.src)
            .pipe(rename(languagesFileName))
            .pipe(gulp.dest(gulpConfig.dest));
    }
});

gulp.task('inject-html', function () {

    if (webpackHash != null && webpackHash.length > 0) {

        var configFileName = 'config.' + webpackHash + '.js';
        var languagesFileName = 'languages.' + webpackHash + '.js';
        var target = gulp.src(gulpConfig.html.src);

        // inject files to the index.html file.
        var sources = gulp.src([
            gulpConfig.dest + configFileName,
            gulpConfig.dest + languagesFileName
        ], {
            read: false
        });

        return target.pipe(inject(sources))
            .pipe(gulp.dest(gulpConfig.root));
    }
});

/* Format the webpack & lint errors.
 *
 */
function formatWebpackError(statsErrors) {
    var error = {}
    var errorLogs = [];

    statsErrors.forEach(function (errorLine) {
        if (errorLine.indexOf('\n')) {
            var errors = errorLine.split('\n');
            if (errors.length > 0) {

                // Find the element from the array.
                var found = errorLogs.find(function (el) {
                    if (el.fileName === errors[0])
                        return el;
                });

                if (!(found !== undefined)) {
                    error = {
                        fileName: errors[0],
                        errors: [] // Initialise new error collection.
                    }
                    error.errors.push(errors[1]);
                    errorLogs.push(error);
                } else {
                    found.errors.push(errors[1]);
                }
            }
        }
    }, this);

    console.log();
    gutil.log(colors.cyan('Webpack Build failed. Correct the following errors...').bold);
    errorLogs.map(error => {
        console.log(colors.magenta(error.fileName).bold);
        error.errors.forEach(function (error) {
            console.log(colors.red('\t' + error));
        }, this);
    });
}

//gulp command to run default task
gulp.task('default', ['dist']);