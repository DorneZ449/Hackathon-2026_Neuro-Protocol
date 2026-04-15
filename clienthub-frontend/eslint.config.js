/**
 * ESLint Configuration (Flat Config)
 * ----------------------------------
 * ESLint — линтер для поиска и исправления проблем в JavaScript/TypeScript коде.
 *
 * Используется новый "Flat Config" формат (eslint.config.js),
 * который заменил устаревший .eslintrc.
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  /**
   * Global Ignores — Игнорируемые папки/файлы
   * -----------------------------------------
   * Эти файлы не будут проверяться линтером.
   */
  globalIgnores([
    'dist',           // Production сборка
    'coverage',       // Отчёты покрытия тестами
    'node_modules',   // Зависимости
    '*.config.js',    // Файлы конфигурации (опционально)
  ]),

  /**
   * TypeScript & React Configuration
   * ---------------------------------
   * Основная конфигурация для исходного кода приложения.
   */
  {
    /** Применять к TypeScript файлам */
    files: ['**/*.{ts,tsx}'],

    /**
     * Extends — Наборы рекомендованных правил
     */
    extends: [
      /** Базовые правила ESLint (no-unused-vars, no-undef и т.д.) */
      js.configs.recommended,

      /** TypeScript-специфичные правила (@typescript-eslint/*) */
      tseslint.configs.recommended,

      /**
       * React Hooks правила:
       * - react-hooks/rules-of-hooks: правила вызова хуков
       * - react-hooks/exhaustive-deps: проверка зависимостей useEffect
       */
      reactHooks.configs.flat.recommended,

      /**
       * React Refresh правила:
       * - Предупреждения о компонентах, несовместимых с HMR
       */
      reactRefresh.configs.vite,
    ],

    /**
     * Language Options — Настройки парсера
     */
    languageOptions: {
      /** Версия ECMAScript для парсинга */
      ecmaVersion: 2023,

      /**
       * Глобальные переменные браузера:
       * window, document, console, setTimeout и т.д.
       */
      globals: {
        ...globals.browser,
        ...globals.es2023,
      },
    },

    /**
     * Rules — Кастомизация правил (опционально)
     * -----------------------------------------
     * Переопределите или добавьте правила по необходимости.
     *
     * Severity levels:
     * - 'off' или 0: отключено
     * - 'warn' или 1: предупреждение
     * - 'error' или 2: ошибка
     */
    rules: {
      /**
       * Пример: разрешить неиспользуемые переменные с префиксом _
       * '@typescript-eslint/no-unused-vars': ['error', {
       *   argsIgnorePattern: '^_',
       *   varsIgnorePattern: '^_',
       * }],
       */
    },
  },
]);
