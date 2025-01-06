module.exports = function (_globalConfig, _projectConfig) {
  // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  // https://github.com/remix-run/react-router/issues/12363#issuecomment-2496226528
  if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
    const { TextDecoder, TextEncoder } = require('node:util');
    globalThis.TextEncoder = TextEncoder;
    globalThis.TextDecoder = TextDecoder;
  }
};
