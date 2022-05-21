module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'flowtype',
    'jsx-a11y',
    'import',
    'react'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      },
      node: {
        paths: [''],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      modules: true,
      jsx: true
    },
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  env: {
    browser: true,
    es6: true
  },
  rules: {
    // OFF
    'default-case': [0],
    'linebreak-style': [0],
    'react/prop-types': [0],
    'consistent-return': [0],
    'max-classes-per-file': [0],
    'import/no-absolute-path': [0],
    'react/state-in-constructor': [0],
    'react/require-default-props': [0],
    'react/jsx-props-no-spreading': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    'import/no-named-as-default-member': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    'react/function-component-definition': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    '@typescript-eslint/no-unsafe-argument': [0],
    'jsx-a11y/no-static-element-interactions': [0],
    '@typescript-eslint/no-floating-promises': [0],
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/no-non-null-assertion': [0],
    '@typescript-eslint/no-unsafe-member-access': [0],
    '@typescript-eslint/no-misused-promises': [0],

    // WARN
    'max-len': [1, { code: 120 }],
    'import/no-cycle': [1],
    'no-await-in-loop': [1],
    'arrow-body-style': [1, 'as-needed'],
    'no-param-reassign': [1],
    'no-restricted-syntax': [1],
    'react/jsx-no-target-blank': [1],
    'react-hooks/exhaustive-deps': [1],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/destructuring-assignment': [1, 'always', { ignoreClassFields: true }],
    '@typescript-eslint/ban-ts-comment': [1],
    'react/no-unstable-nested-components': [1, { allowAsProps: true }],

    // ERROR
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
    'comma-dangle': [2, 'never'],
    'import/extensions': [2, { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', json: 'ignorePackages' }],
    'operator-linebreak': [2, 'after'],
    'react-hooks/rules-of-hooks': [2],
    '@typescript-eslint/comma-dangle': [2, 'never'],
    'react/static-property-placement': [2, 'static public field'],
    'import/no-extraneous-dependencies': [1],
    'object-curly-newline': [2, {
      ImportDeclaration: 'never',
      ExportDeclaration: { multiline: true, minProperties: 3 }
    }],
    'import/order': [2, {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc'
      },
      groups: ['external', 'builtin', 'index', 'parent', 'sibling', 'type'],
      'newlines-between': 'never',
      pathGroups: [
        { group: 'external', pattern: 'react', position: 'before' },
        { group: 'external', pattern: '@react-native/**', position: 'after' },
        { group: 'external', pattern: '@ui-kitten/**', position: 'after' },
        { group: 'type', pattern: '/constants/**', position: 'after' },
        { group: 'index', pattern: '/**', position: 'after' }
      ],
      pathGroupsExcludedImportTypes: ['builtin']
    }]
  }
};
