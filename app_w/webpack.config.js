/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const buildLocales = require('./MakeDefaultMessagesWebpackPlugin');
const MakeDefaultMessagesWebpackPlugin = buildLocales.MakeDefaultMessagesWebpackPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const extractCSS = new ExtractTextPlugin({
    filename: "[name].css"
});

const isProduction = (process.env.NODE_ENV === 'production');

var plugins = isProduction
              ? [
                new webpack.DefinePlugin({
                  //Libs need this to know whether they are in production environment
                  'process.env': {
                    NODE_ENV: JSON.stringify('production')
                  },
                  PRODUCTION: JSON.stringify(true)
                }),
                new webpack.optimize.UglifyJsPlugin({sourceMap:true}),
                extractCSS,
                new CompressionPlugin({
                        asset: "[path].gz[query]",
                        algorithm: "gzip",
                        test: /\.js$|\.css$$/,
                        threshold: 10240,
                        minRatio: 0.8
                    }),
                new MakeDefaultMessagesWebpackPlugin()
                ]
              : [
                new webpack.DefinePlugin({
                  PRODUCTION: JSON.stringify(false)
                }),
                extractCSS,
                new MakeDefaultMessagesWebpackPlugin()
                ];

var devtool = isProduction ? 'source-map' : 'eval-source-map';

module.exports = {
  entry: './app_w/index.js',

  output: {
    path: "./public",
    publicPath: '/', //All relative url within the app will be absolutized with this prefix before sending to the host.
    filename: 'app.bundle.js'
  },

  module: {
    rules: [
              {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
              },
              {
                test: /\.scss$/,
                use: extractCSS.extract([
                    {
                      loader: "css-loader"
                    },
                    {
                      loader: 'resolve-url-loader'
                    },
                    {
                      loader: "sass-loader",
                      options: {sourceMap:true}
                    }
                ])
                // use: [
                //         {
                //           loader: 'style-loader'
                //         },
                //         {
                //           loader: 'css-loader',
                //         },
                //         // {
                //         //   loader: 'postcss-loader',
                //         //   options: {
                //         //     plugins: function () {
                //         //       return [
                //         //         require('autoprefixer')
                //         //       ];
                //         //     }
                //         //   }
                //         // },
                //         {
                //           loader: 'resolve-url-loader'
                //         },
                //         {
                //           loader: 'sass-loader',
                //           options: {sourceMap:true}
                //         }
                //     ]
              },
              {
                test: /\.(jpg|JPG|png|gif|mp4|m4v|svg)$/,
                use: 'file-loader?name=[path][name].[ext]'//[path]: The emitted file's path into public is the same as of in the source.
              }
           ]
  },

  plugins: plugins,

  devtool: devtool,


  // devServer: {
  //   port: 8080,
  //   proxy: {
  //         '*': {
  //               target: 'http://localhost:3000',
  //               secure: false
  //              }
  //         },
  //   contentBase: "./public",
  //   historyApiFallback: true,
  //   inline: true,
  //   progress: true
  // }
}
