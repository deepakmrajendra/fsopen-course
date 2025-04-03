const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactNative = require('eslint-plugin-react-native');
const babelParser = require('@babel/eslint-parser');

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
      },
    },
    plugins: {
      react: eslintPluginReact,
      'react-native': eslintPluginReactNative,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];