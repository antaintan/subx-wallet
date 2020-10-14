const path = require('path');
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const buffer = require("buffer");

module.exports = {
  entry: ['./src/index.ts'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    global: true,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
    }
  },
  experiments: {
    topLevelAwait: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: false,
    })],
    splitChunks: {
      chunks: 'all',
      minSize: 2000,
      minRemainingSize: 0,
      maxSize: 50000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '-',
      enforceSizeThreshold: 5000,
      cacheGroups: {
        chunk: {
          name: false,
          test: /[\\/]node_modules[\\/]/,
          enforce: true
        },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true
        // }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
      template: './public/index.html' 
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: './' }
      ],
      options: {
        concurrency: 100,
      },
    }),
    new webpack.ProvidePlugin({
      Buffer:  ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      // 解决浏览器里没有process对象
      'process.browser': true,
      'process.env': {
        CRYPTO_ASM: '1' // any truth-y value will do
      },
      //'Buffer': buffer.Buffer,
    }),
  ],
  output: {
    filename: 'chunk-[contenthash].js',
    //filename: 'main.js',
    //path: path.resolve(__dirname, 'dist'),
    path: path.resolve(process.cwd(), 'dist'),
  },
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    contentBase: path.resolve(process.cwd(), 'dist'),
    compress: true,
    writeToDisk: true,
    //open: true,
    port: 9000
  }
};