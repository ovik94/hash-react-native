module.exports = {
  extends: 'airbnb-typescript',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ['flowtype', 'react-hooks'],
  globals: {},
  rules: {
    '@typescript-eslint/comma-dangle': [2, 'never'],
    'max-classes-per-file': [0],
    'max-len': ['error', { code: 120 }],
    'import/no-extraneous-dependencies': [1],
    'import/extensions': [2, { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
    'comma-dangle': [2, 'never'],
    'object-curly-newline': [0],
    'consistent-return': [0],
    'react/require-default-props': [0],
    'react/destructuring-assignment': [1, 'always', { ignoreClassFields: true }],
    'react/static-property-placement': [2, 'static public field'],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-no-target-blank': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/state-in-constructor': [0],
    'react/prop-types': [0],
    'react-hooks/rules-of-hooks': [2],
    'react-hooks/exhaustive-deps': [1],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'no-param-reassign': [1],
    'default-case': [0],
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-restricted-syntax': [1],
    'no-await-in-loop': [1],
    'arrow-body-style': [1, 'as-needed'],
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
    'operator-linebreak': [2, 'after'],
    'linebreak-style': [0],
    'import/no-absolute-path': [0]
  }
};
