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
    tsConfig: path.resolve(__dirname, './tsconfig.json'),
    // extensions to assume if none specified, .js, .json, and .wasm are the defaults (and need to be here
    // for npm package resolutions). We add .ts because graphql-codegen outputs relative imports to generated
    // .ts files without the file extension specified. Not a practice we wanted to allow, but our eslint configuration
    // will enforce that we still specifiy extensions in our own code so this is fine
    extensions: ['.js', '.json', '.wasm', '.ts'],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      favicon: './src/assets/favicon_canadaFlag.ico',
      publicPath: '/',
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
  experiments: {
    css: true,
  },
};
