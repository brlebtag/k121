'use strict';

const { series, src, dest, parallel } = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack-stream');

sass.compiler = require('node-sass');

function limparCompilados(cb) {
    return src([
            './public/js/*.js',
            './public/css/*.css'
        ])
        .pipe(clean());
}

function compilarJs() {
    return src('./resources/js/index.js')
        .pipe(webpack({
            mode: 'development',
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                        presets: ['@babel/preset-env']
                        }
                    }
                }]
            }
        }))
        .pipe(concat('bundle.js'))
        .pipe(dest('./public/js'));
}

function compilarCss() {
    const plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];

    const sassStream = src('./resources/scss/index.scss')
        .pipe(sass().on('error', sass.logError));

    const cssStream = src('./resources/css/*.css');

    return merge(sassStream, cssStream)
        .pipe(concat('style.css'))
        .pipe(postcss(plugins))
        .pipe(dest('./public/css'));
}

exports.default =
    series(
        limparCompilados,
        parallel(compilarJs, compilarCss)
    );