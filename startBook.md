# webpack-es6-anyFrame

github新建一个仓库
本地新建一个文件夹
在文件夹下执行
```
echo "# webpack-es6-anyFrame" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/xxxxxxx/webpack-es6-anyFrame.git
git push -u origin master
```
记得创建.gitignore文件
```
# dependencies
/node_modules

# production
/build

```
# 初始化项目

```
npm i -D webpack webpack-cli webpack-dev-server
```

# 安装必要加载器

```
npm i -D autoprefixer style-loader css-loader sass node-sass sass-loader postcss-loader html-loader html-webpack-plugin uglifyjs-webpack-plugin mini-css-extract-plugin webpack-merge babel-plugin-import
```
创建postcss.config.js
```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
创建.browserslistrc
```
# Browsers that we support

defaults,
not ie < 9,
last 2 versions,
> 1%,
iOS 7,
last 3 iOS versions
```
# 安装bable解决在项目中使用ES6的问题

```
npm i -D babel-loader @babel/core @babel/preset-env  @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators

npm i -D @babel/react @babel/preset-react // 编译react
```
创建.babelrc
```
{
  "presets": [
      "@babel/preset-env",
      "@babel/react"
  ],
  "plugins": ["@babel/transform-runtime", ["@babel/plugin-proposal-decorators", {"legacy": true}], "@babel/plugin-proposal-class-properties"]
}
```
# 开始构建项目基本架构
创建src文件，新建index.html及indes.js作为项目入口

# 开始配置webpack
- 创建webpack.common.config
    ```
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
    ```
- 创建webpack.dev.config.js
    ```
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
    ```
- 创建webpack.config.js
    ```
    const common = require("./webpack.common.config");
    const merge = require("webpack-merge");
    module.exports = merge(common, {
    devtool: "none",
    mode:"production"
    });
    ```


# 配置启动命令
```
//package.son
{
    ···
    "scripts": {
        "start": "node_modules/.bin/webpack",
        "dev": "node_modules/.bin/webpack-dev-server  --config ./webpack.dev.config.js --process  --color --host localhost --mode development"
    },
    ···
}
```

# 简单的使用

 -  在src下创建style.scss
	```
	body{
	    background: skyblue;
	}
	```

- 在src/index.js中导入样式文件并编写ES6代码

	```
	import './style.scss';
	{
	    let a = 'hi~';
	    alert(a);
	}
	```

效果感人~

Chrome的表现
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191215130444317.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dSaWFuX0Jhbg==,size_16,color_FFFFFF,t_70)

IE9的表现
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191215133147985.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1dSaWFuX0Jhbg==,size_16,color_FFFFFF,t_70)