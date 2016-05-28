var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname,'public/');
var APP_DIR = path.resolve(__dirname,'./resources/assets');

var LiveReloadPlugin = require('webpack-livereload-plugin');

var config = {
  entry: APP_DIR + '/js/app.js',
  watch: true,
  output: {
    path: BUILD_DIR,
    filename: '/js/bundle.js'
  },
  devtool: 'source-map',
  debug: true,
  plugins: [
    new LiveReloadPlugin()
  ],  
  module : {
    loaders : [
      {
        test : /(\.jsx|\.js)$/,
        include : APP_DIR,
        loader : 'babel',
        exclude: /(node_modules|bower_components)/        
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  }
}

module.exports = config;
