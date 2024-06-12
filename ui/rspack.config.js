/**
 * @type {import('@rspack/cli').Configuration}
 */

const rspack = require('@rspack/core'); // eslint-disable-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv'); // eslint-disable-line @typescript-eslint/no-var-requires

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
          options: {
            presets: [
              '@babel/preset-typescript',
              // To avoid importing React
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: ['macros'],
          },
        },
      },
    ],
  },
};
