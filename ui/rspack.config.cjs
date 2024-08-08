/**
 * @type {import('@rspack/cli').Configuration}
 */

const path = require('node:path');

const rspack = require('@rspack/core');
const dotenv = require('dotenv');

const { parsed } = dotenv.config();

console.log(JSON.stringify(parsed));

module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.tsx',
    worker: './src/worker.ts',
  },
  output: {
    filename: '[name].js',
  },
  resolve: {
    tsConfigPath: path.resolve(__dirname, './tsconfig.json'),
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      favicon: './src/assets/favicon_canadaFlag.ico',
    }),
    new rspack.DefinePlugin({
      ENV: parsed,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
