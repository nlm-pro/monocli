module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "settings": {
    "import/resolver": {
      typescript: {}
    }
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "project": ["tsconfig.json", "test/tsconfig.json"],
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-tsdoc"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "ignorePatterns": ["coverage-map.js", "publish.js", "node_modules/"],
  "rules": {
    "tsdoc/syntax": "warn",
    "no-console": "error",
    "no-process-env": "error",
    "no-warning-comments": "off",
    "import/no-unresolved": "error", 
    "import/default": "error",
    "import/export": "error",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/member-ordering": "error",
    "camelcase": "error",
    "curly": "error",
    "id-blacklist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"],
    "id-match": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-unassigned-import": "error",
    "import/order": "error",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-duplicate-imports": "error",
    "no-eval": "error",
    "no-redeclare": "error",
    "no-throw-literal": "error",
    "no-underscore-dangle": "error",
    "no-unused-expressions": "error",
    "no-var": "error",
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],
    "prefer-const": "error",
    "spaced-comment": "error",
    "quotes": ["error", "backtick"]
  }
}
