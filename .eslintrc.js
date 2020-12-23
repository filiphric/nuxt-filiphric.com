module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    "cypress/globals": true
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "plugin:cypress/recommended"],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error"
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  plugins: [
    "cypress"
  ]
};
