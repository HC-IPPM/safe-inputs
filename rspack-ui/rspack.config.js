/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.tsx',
    worker: './src/worker.ts',
  },
  output: {
    filename: '[name].js',
  },
  builtins: {
    html: [
      {
        template: './index.html',
        favicon: './src/assets/favicon_canadaFlag.ico',
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.tsx$/,
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
}
