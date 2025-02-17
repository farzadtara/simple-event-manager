const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/EventManger.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'eventemitter-ts.js',
    library: 'EventEmitter',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  target: ['web', 'node'],
  externals: [],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

module.exports = [
  {
    ...module.exports,
    output: {
      ...module.exports.output,
      filename: 'eventemitter-ts.node.js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
  },
  {
    ...module.exports,
    output: {
      ...module.exports.output,
      filename: 'eventemitter-ts.web.js',
      libraryTarget: 'umd',
    },
    target: 'web',
  },
];