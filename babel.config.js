module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  // This enables proper ES modules support in Jest tests
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    }
  }
};

