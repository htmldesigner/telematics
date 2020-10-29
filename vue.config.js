module.exports = {
	transpileDependencies: [],
	// outputDir: '../wwwroot/js',
	// configureWebpack: {
	// 	output: {
	// 		filename: '[name].js',
	// 		chunkFilename: '[name].js',
	// 	},
	// },
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
};
