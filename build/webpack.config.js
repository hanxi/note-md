var path = require('path')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrors = require('friendly-errors-webpack-plugin');
var parser = require('url');

var assetsPath = (_path) => {
	return path.join('assets', _path);
};
module.exports = {
	entry: {
		app: './src/main.js'
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: 'http://10.5.9.57:8080/',
		filename: assetsPath('js/[name].[hash].js'),
		chunkFilename: assetsPath('js/[id].[chunkhash].js')
	},
	module: {
		rules: [
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
					// the "scss" and "sass" values for the lang attribute to the right configs here.
					// other preprocessors should work out of the box, no loader config like this nessessary.
					'scss': 'vue-style-loader!css-loader!sass-loader',
					'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
				}
			    // other vue-loader options go here
			},
		},
		{
			test: /\.js$/,
			loader: 'babel-loader',
			include: [
				path.join(projectRoot, 'src')
			],
			exclude: /node_modules/
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 1,
				name: assetsPath('img/[name].[hash:7].[ext]')
			}
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: assetsPath('fonts/[name].[hash:7].[ext]')
			}
		}
		]
	},
	resolve: {
        extensions: ['.js', '.vue'], //后缀名自动补全
		alias: {
			'vue$': 'vue/dist/vue.common.js',
            store: path.resolve('src/store/'),
            util: path.resolve('src/util/index.js')
		}
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		inline: true,
        proxy: [
            {
                context: '/api/**',
                target: 'http://10.5.9.57:3000',
            }
        ]
	},
	performance: {
		hints: false
	},
	devtool: '#eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': '"development"'
		}),
		// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new FriendlyErrors()
	]
}
