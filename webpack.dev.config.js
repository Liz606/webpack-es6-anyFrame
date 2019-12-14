//webpack.dev.config.js
const common = require("./webpack.common.config");
const {resolve, join} = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
 
module.exports = merge(common, {   //合并两个webpack文件
  devServer: {
    port: 8000,
    contentBase: join(__dirname, "dist"),
    compress: true,  // 对所有的服务器资源采用gzip压缩
    hot: true,                     //模块热加载
    inline: true,
    open: 'Chrome',                //构建完成时自动打开浏览器
    openPage: "",
    stats: "errors-only" // 只打印错误
  },
  devtool: "inline-source-map",      //方便调试，将src目录下的资源映射到浏览器中
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //使用模块热加载插件
  ]
});