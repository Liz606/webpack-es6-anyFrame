//webpack.common.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const paths = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
};
 
const evn = process.argv.pop();//获取当前的环境，生产或开发
const EVN = {
  pro: "production",
  dev: "development"
};
 
module.exports = {
  entry: [
    path.join(paths.src, "index.html"),
    // "@babel/polyfill",
    path.join(paths.src, "index.js"),
  ],
  output: {
    path: paths.dist,
    chunkFilename: evn === EVN.dev ? "[name].[hash].js" : "[name].js",
    filename: evn === EVN.dev ? "[name].[hash].js" : "[name].js",
  },
  module: {
    rules: [
      {
        //处理jsx,js
        test: /\.(jsx?)$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: evn === EVN.dev,
            sourceMap: evn === EVN.dev,
          },
        }
      },
      {
        ///处理html
        test: /\.html?/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "html-loader",
          options: {
            minimize: evn === EVN.dev,  //压缩html代码
            sourceMap: evn === EVN.dev  //生产环境可以不用资源映射
          }
        }
      },
      {// 规则数组
        test: /\.css|scss|less$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.src, "index.html"),
      filename: "index.html",
      title: "react"
    }),
    new MiniCssExtractPlugin({
      filename: evn === EVN.dev ? "[name].[hash].css" : "[name].css",
      chunkFilename: evn === EVN.dev ? "[id].[hash].css" : "[id].css"
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'react-native': 'react-native-web'
    }
  }
};