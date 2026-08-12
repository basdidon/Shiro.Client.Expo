// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const { allExtensions } = require("eslint-config-expo/flat/utils/extensions.js");

module.exports = defineConfig([
  expoConfig,
  {
    // The "@/*" alias is only resolved by the typescript resolver (the node
    // resolver has no concept of tsconfig path mapping), and its default
    // extension list drops the platform sub-extensions (.native.ts, .web.ts,
    // ...), so import/no-unresolved false-positives on files split by
    // platform. Give it the platform-aware extension list instead.
    files: ["**/*.ts", "**/*.tsx"],
    settings: {
      "import/resolver": {
        typescript: { extensions: allExtensions },
      },
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
