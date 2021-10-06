const coreJsVersion = require('core-js/package.json').version;

/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  api.cache.never();

  return {
    presets: [['@babel/preset-env', { useBuiltIns: 'entry', corejs: { version: coreJsVersion, proposals: true } }]],
  };
};
