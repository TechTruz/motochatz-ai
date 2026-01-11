import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js, prettier: prettierPlugin },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
    {
        // Override rules to ignore unused vars with "_" prefix
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    prettierConfig,
]);
