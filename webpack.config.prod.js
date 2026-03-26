const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const resolvePath = (filePath) => path.resolve(__dirname, filePath);
const isDev = process.env.NODE_ENV === 'development';
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

module.exports = [
  {
    mode: 'production',
    entry: ['@babel/polyfill', path.join(__dirname, 'src', 'index.tsx')],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: `connect-simple-push/js/${filename('js')}`,
      chunkFilename: '[id]-[chunkhash].js',
      publicPath: 'auto',
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
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false,
                modules: 'icss',
              },
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false,
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
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                plugins: [
                  [
                    'babel-plugin-styled-components',
                    {
                      displayName: true,
                      fileName: true,
                      namespace: 'widget-new-css',
                    },
                  ],
                ],
              },
            },
            {
              loader: 'ts-loader',
              options: { allowTsInNodeModules: true },
            },
          ],
          exclude: '/node_modules/',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
      }),
      new WebpackAssetsManifest({
        output: 'asset-manifest.json',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: resolvePath('public/connect-simple-push.html'),
        filename: 'connect-simple-push.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolvePath('public'),
            to: resolvePath('build'),
            globOptions: {
              dot: true,
              gitignore: false,
              ignore: ['**/connect-simple-push.html'],
            },
          },
        ],
      }),
    ],
  },
  {
    target: 'webworker',
    mode: 'production',
    entry: {
      serviceWorker: resolvePath('serviceWorker/serviceWorker.ts'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'build'),
      clean: {
        keep: (filename) => {
          return filename !== 'serviceWorker.js';
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.[j|t]s$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              },
            },
            {
              loader: 'ts-loader',
              options: { allowTsInNodeModules: true },
            },
          ],
        },
      ],
    },
  },
];
