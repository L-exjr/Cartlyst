import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactNative from "eslint-plugin-react-native";
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
      },
      globals: globals.node,
    },
    plugins: { js, react, "react-native": reactNative },
    rules: {
      ...react.configs.recommended.rules,
      ...reactNative.configs.all.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
