module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es6: true,
  },
  extends: ["prettier", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "object-shorthand": "off",
    "prettier/prettier": "error",
    camelcase: "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
      },
    ],
  },
};
