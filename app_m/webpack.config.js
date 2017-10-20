/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const extractCSS = new ExtractTextPlugin({
    filename: "management-[name].css"
});

const isProduction = (process.env.NODE_ENV === 'production');

var plugins = isProduction
              ? [
                new webpack.DefinePlugin({
                  //Libs need this to know, whether they are in production environment
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
                    })
                ]
              : [
                new webpack.DefinePlugin({
                  PRODUCTION: JSON.stringify(false)
                }),
                extractCSS
                ];

var devtool = isProduction ? 'source-map' : 'eval-source-map';

module.exports = {
  entry: './app_m/index.js',

  output: {
    path:     __dirname + '/../public',
    publicPath: '/', //All relative url within the app will be absoluteize with this prefix before sending to the host.
    filename: 'management-app.bundle.js'
  },

  plugins: plugins,

  devtool: devtool,


  module: {
    loaders: [
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
      },

      {//WARNING. DO NOT USE MORE RULES TOGETHER FOR THE SAME FILE: E.G THIS GLOBAL RULE AND A SPECIAL ONE LIKE THIS
       //require('file?name=[path][name].[ext]!../assets/videos/engraved-apearance-animation.gif')
      test: /\.(jpg|JPG|png|gif|mp4|m4v|svg)$/,
      use: 'file-loader?name=[path][name].[ext]'//[path]: The emitted file's path into public is the same as of in the source.
      }
    ]
  },

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
  // },

  //To include gsap Draggable, which is not an es6 module
  resolve: {
    modules: [
         path.join(__dirname,'..'),
         "node_modules"
       ],
    alias: {
        "TweenLite": "node_modules/gsap/src/uncompressed/TweenLite",
        "CSSPlugin": "node_modules/gsap/src/uncompressed/plugins/CSSPlugin"
      }
  }
}
