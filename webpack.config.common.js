'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /**
     * These parameters will be used for rendering `index.html`.
     */
    metadata: {
        title: 'Exchange Rates Demo Application',
        baseUrl: '/'
    },

    entry: ['babel-polyfill', './src/app_rest.ts'],

    resolve: {
        extensions: ['', '.ts', '.js', '.sass', '.html'],
        modulesDirectories: ['node_modules', 'src']
    },

    node: {
        fs: "empty"
    },

    module: {
        loaders: [            
            { test: /\.ts$/, loader: 'babel-loader?presets[]=es2015!ts-loader' },
            //{ test: /\.json$/, loader: 'json-loader' },
            //{ test: /\.html$/, loader: 'html-loader' },
            { test: /\.sass$/, loaders:["style", "css", "sass"]}            
        ]
    },

    plugins: [

        /**
         * Quote from webpack docs: "Assign the module and chunk ids by occurrence count. Ids that are used often get
         * lower (shorter) ids. This make ids predictable, reduces total file size and is recommended."
         *
         * See https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
         */
        new webpack.optimize.OccurenceOrderPlugin(true),

        /**
         * This plugin simplifies generation of `index.html` file. Especially useful for production environment,
         * where your files have hashes in their names.
         *
         * We have auto-injection disabled here, otherwise scripts will be automatically inserted at the end
         * of `body` element.
         *
         * See https://www.npmjs.com/package/html-webpack-plugin for details.
         * 
         */
        new HtmlWebpackPlugin({
            title: 'Exchange Rates Demo Application',
            template: 'src/index.ejs',
            chunksSortMode: 'dependency',
            inject: false
        })
    ]
};
