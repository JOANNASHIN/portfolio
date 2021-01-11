const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const config = {
module.exports = {
    mode: "none",
    devtool: "source-map", //배포용(빌드파일과 원본파일 연결)
    entry: {
        "js/main": ["./src/js/app.js", "./src/scss/app.scss"]
    },  

    devServer: {
        hot: true //브라우저를 새로 고치지 않아도 실시간 반영
    },

    output: {
        filename:"[name].js",
        path: path.resolve(__dirname, "dist")
    },


    //로더(index.js 에서 읽을때 읽도록 도와주는 애)
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/i, //로더를 적용할 파일 유형
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader", 
                    "postcss-loader", 
                    "sass-loader",
                ],
            },

            {
                test: /\.(png|jpg|gif|jpeg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                //include: path.resolve(__dirname, '../'),
                options: {
                    name: '[path][name].[ext]',
                    publicPath: '../../',
                    outputPath: '/',
                },
			},

            // {
            //     test: /\.hbs$/,
            //     loader: "handlebars-loader"
            // }
            {
                test: /\.html$/,
                exclude: [/node_modules/, require.resolve('./index.html')],
                use: {
                    loader: 'file-loader',
                    // query: {
                    //     name: '[name].[ext]'
                    // },
                },
            },
            
        ],
    },

    plugins: [
        new webpack.ProgressPlugin(), //빌드 진행율을 표시해주는 플러그인,
        // new CleanWebpackPlugin(),
        // new htmlWebpackPlugin({
        //     title: "test",
        //     footer: "<footer>footer</footer>",
        //     templateContent: ({htmlWebpackPlugin}) => `
        //         <html>
        //             <head lang="ko">
        //                 <meta charset="utf8">
        //                 ${htmlWebpackPlugin.options.title}
        //                 ${htmlWebpackPlugin.tags.headTags}
        //                 </head>
                        
        //                 <body>
        //                 <h1>Hello World</h1>
        //                 ${htmlWebpackPlugin.options.footer}
        //                 ${htmlWebpackPlugin.tags.bodyTags}
        //             </body>
        //         </html>
        //     `
        // }), 
        
        new MiniCssExtractPlugin({
            filename: "css/main.css"
        }),

        new webpack.ProvidePlugin({
            "window.$": "jquery",
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
