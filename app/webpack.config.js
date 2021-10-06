const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/** @type {(env: Record<string, unknown>) => import('webpack').Configuration} */
module.exports = (_env, argv) => {
  const mode = argv.mode || 'production';

  return {
    mode,
    target: 'web',
    entry: [__dirname + '/out/polyfills.js', __dirname + '/src'],
    output: {
      path: __dirname + '/dist',
      filename: 'bundle/[name].[chunkhash:8].js',
      assetModuleFilename: 'bundle/[name].[contenthash:8].[ext]',
      publicPath: '/',
    },
    stats: 'minimal',
    performance: { hints: false },
    devtool: 'source-map',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
        {
          test: /\.(woff2?)$/,
          type: 'asset/inline',
        },
        {
          test: /\.(gif|jpe?g|png|apng|svg|webp)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlPlugin({
        inject: true,
        minify: false,
        template: __dirname + '/public/index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            context: __dirname + '/public',
            from: '**',
            to: __dirname + '/dist',
            force: true,
            globOptions: { ignore: [__dirname + '/public/index.html'] },
          },
        ],
      }),
    ],
    devServer: {
      static: __dirname + '/public',
      compress: true,
      port: 8080,
      open: true,
    },
  };
};
