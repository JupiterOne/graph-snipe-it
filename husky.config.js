module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/husky'),
  // TODO: This override is to make sure the hooks use yarn. It can be removed once this integration is using npm.
  hooks: {
    'pre-commit':
      'yarn j1-integration document && git add docs/jupiterone.md && lint-staged',
    'pre-push': 'yarn prepush',
  },
};
