const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const resolvePath = (filePath) => path.resolve(__dirname, filePath);
const isDev = process.env.NODE_ENV === 'development';
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

module.exports = () => {
  return {
    mode: 'development',
    entry: ['@babel/polyfill', path.join(__dirname, 'src', 'index.tsx')],
    output: {
      path: '/',
      filename: 'static/js/[name].bundle.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      chunkFilename: 'static/js/[name].chunk.js',
      publicPath: '/',
    },
    optimization: {
      minimize: false,
      runtimeChunk: 'single',
    },
    target: 'web',
    devtool: 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@src': resolvePath('src/'),
        '@app': resolvePath('src/App/'),
        '@common': resolvePath('src/App/common/'),
      },
    },
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      port: 3002,
      overlay: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: { allowTsInNodeModules: true },
          },
          exclude: '/node_modules/',
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: 'icss',
              },
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: 'module',
              },
            },
          ],
        },
        {
          test: /\.(?:|gif|png|jpg|jpeg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `./img/${filename('[ext]')}`,
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|woff|woff2|otf)$/,
          loader: 'file-loader',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                dimensions: false,
                svgProps: { focusable: '{false}' },
              },
            },
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new WebpackAssetsManifest({
        output: 'asset-manifest.json',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: resolvePath('public/connect-simple-push.html'),
      }),
    ],
  };
};
