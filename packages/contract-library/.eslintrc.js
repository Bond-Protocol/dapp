export default {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "prefer-const": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unsafe-call": "off",
      },
    },
  ],
};
