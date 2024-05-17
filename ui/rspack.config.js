/**
 * @type {import('@rspack/cli').Configuration}
 */

const rspack = require('@rspack/core'); // eslint-disable-line @typescript-eslint/no-var-requires

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
