import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules', '.runtime', 'QA/Backups', '99_ARCHIV_ACC_TEST_HARNESS_20261008'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // ESLint core does not mark JSX component identifiers as variable usages.
      // Capitalised component bindings are therefore ignored here; ordinary
      // variables and all lower-case helpers remain fully checked.
      'no-unused-vars': ['error', { argsIgnorePattern: '^(?:_|[A-Z])', varsIgnorePattern: '^[A-Z]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
