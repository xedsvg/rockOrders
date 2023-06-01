module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "universe/web"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "react/jsx-filename-extension": "off",
    "no-underscore-dangle": "off",
    "no-return-assign": "off",
  },
};