import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("plugin:react/recommended", "google"),

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        "react-hooks": fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 13,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "max-len": "off",
        "require-jsdoc": "off",

        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "object-curly-spacing": [2, "always"],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "operator-linebreak": [2, "before"],
        "import/no-default-export": "error",
        "import/export": "error",
        "no-invalid-this": "off",
        "@typescript-eslint/no-invalid-this": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-closing-tag-location": "error",
        "react/jsx-closing-bracket-location": "error",
        "react/jsx-wrap-multilines": "error",
        "react/hook-use-state": "error",
        "react/no-danger": "error",
        "react/no-this-in-sfc": "error",
        "react/no-unsafe": "error",
        "react/no-unstable-nested-components": "error",
        "react/jsx-curly-brace-presence": "error",
        "react/jsx-no-useless-fragment": "error",
    },
}]);