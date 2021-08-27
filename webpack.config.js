const path = require('path');
let HtmlWebpackPlugin=require('html-webpack-plugin');
const MiniCssExtractPlugin=require("mini-css-extract-plugin");
// 项目根目录
const basePath = path.join(__dirname);

// 获取文件绝对路径
function resolve(...pathNames) {
  const paths = [basePath, ...pathNames];
  return path.resolve(...paths);
}

module.exports = {
    // entry: './src/index.js',
    entry: {
        index: path.resolve(__dirname,'src/index.js'),
        // two: './src/js/two.js'
    },
    output: {
        filename: 'bundle.js',

        //设置的资源打包后的输出路径
        path: path.resolve(__dirname, 'dist'),

        //用来打包require.ensure(按需引入)方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
        //chunkFilename: 'dist/[chunkhash:8].chunk.js'

        // publicPath: '/sbb' 
        //是资源打包的基础路径; 配置引入变编译后的文件的路径，给所以文件加前缀/sbb，可查看打包后的index.html里script, link引入的链接除了路径图片,前缀有它
    },
    //Webpack 5使用webpack serve；如果使用webpackdevServer，contentBase,inline都已经移除了
    //devServer 构建的文件是在内存里的，而非你电脑的磁盘上，但是如果内存中找不到想要的文件时，devServer 会根据文件的路径尝试去电脑的磁盘上找即dist文件夹下，如果这样还找不到才会 404
    devServer: {
        // contentBase: './', // 本地服务器所加载的页面所在的目录，控制它果内存中找不到想要的文件时去哪里访问电脑磁盘上的资源

        //如果我们没有给它这个值，它就会去拼凑output中publicPath中的值，但如果在DevServer中设置了publicPath，那它就不会去管output中publicPath设置的值了
        //设置的是资源会被打包到哪里
        publicPath: '/', //内存中的文件路径只能通过加这个前缀查询到

        historyApiFallback: true,   // 输入找不到的路径资源自动跳转到首页
        inline: true,               // 实时刷新
        port: 3002,                 // 项目所使用的端口
        open: true,                 // 自动打开浏览器
    },
    resolve:{
        alias:{
            '@': path.join(__dirname, 'src'),
            'common': path.join(__dirname, 'src/components')
            //表示设置路径别名这样在import的文件在src下的时候可以直接 @/component/...
        },
        modules: [
            resolve('src/components'),
            resolve('src'),
            resolve('src/asset'),
            'node_modules',
            './node_modules'
        ],
        extensions:['.js','.jsx','.json'],	//表示在import 文件时文件后缀名可以不写
    },
    plugins: [
        //多个页面入口
        // new HtmlWebpackPlugin({
        //     filename: 'list.html',
        //     template: 'src/html/list.html',
        //     thunks: ['common', 'list']
        // }), 
        new HtmlWebpackPlugin({
            template: './index.html', //模版文件
            filename: 'index.html',	// 开发服务器中生成的临时文件
            title: 'sbb',
            showErrors: true,		//是否将错误信息输出到html页面中	
            favicon: './src/asset/logosbb.jpg',
            minify: {
                removeAttributeQuotes: false,	// 是否去除文件中的双引号
                collapseWhitespace: false		// 是否去除文件中的空行
            },
            hash: true,         //// 引入文件的时候添加哈希值，防止缓存的问题;会在打包好的bundle.js后面加上hash串
        }),
        /* 提取单独打包css文件 */
        new MiniCssExtractPlugin({
            filename: "[name].css", //文件会放在output的path文件夹
            //chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
            //chunkFilename: "[id].css"
        })
    ],
    module:{
        rules:[
            {
                test:/\.(jsx|js)$/,
                exclude:/(node_modules)/,  //排除掉nod_modules,优化打包速度
                use:{
                    loader:'babel-loader',
                    options:{   //env针对的是ES的版本，它会自动选择。react针对的就是react
                        presets: ['env','react'],
                    }
                     //options的内容类似于.babelrc文件的配置，有了这个就不需要.babelrc文件了
                },
                // query:{
                //     presets:["react","es2015"]        //加载loader的presets
                // }
                include: path.resolve(__dirname,'src'),   //直接规定查找的范围
            },
            {
                test:/\.(scss|css)$/,
                
                use:[
                    // "style-loader",
                    {
						loader:MiniCssExtractPlugin.loader,
						options:{   //所有的配置参数都要放在这个对象里面
                           // publicPath:'../'    //这个表示在css文件里但凡用到地址的地方在其前面加个目录'../'，这个是为了能找到图片
                        }
					},//这个代替了style-loader
                    //webpack4去掉了"css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]"的css-mudules的配置
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    // "css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]",
                    "sass-loader"
                ]
            },
            {
				test:/\.(jpg|png|gif)$/,
                //use:['file-loader'] // 解析地址
                use:[
                    {
                        loader:'url-loader',    //把图片转成base64
                        options:{
                            limit:50*1024,  //小于50k就会转成base64
                            outputPath: 'imagesaaa' //图片的url域名后面拼接这个
                        }
                    }
                ]
                //use:'url-loader?limit=50000&outputPath=images'    //loader的另一种写法，与get请求方式相同
			}
        ]
    }
}