module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    // so that React doesn't need to be explicitly imported in every jsx file
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: ['@lingui/babel-plugin-lingui-macro'],
};
