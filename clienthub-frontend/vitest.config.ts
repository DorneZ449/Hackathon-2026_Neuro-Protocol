/**
 * Vitest Configuration
 * --------------------
 * Vitest — быстрый unit-test фреймворк, нативно интегрированный с Vite.
 *
 * Преимущества:
 * - Использует ту же конфигурацию что и Vite
 * - Мгновенный HMR для тестов
 * - Совместим с Jest API
 * - Встроенная поддержка TypeScript и ESM
 *
 * @see https://vitest.dev/config/
 */
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  /**
   * Resolve — алиасы должны совпадать с vite.config.ts
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /**
   * Test — Настройки тестирования
   * -----------------------------
   */
  test: {
    /**
     * Globals — глобальные функции без импорта
     *
     * Когда true, можно писать:
     *   describe('...', () => { it('...', () => {}) })
     *
     * Вместо:
     *   import { describe, it } from 'vitest'
     */
    globals: true,

    /**
     * Environment — среда выполнения тестов
     *
     * - 'jsdom': эмуляция браузера (DOM API, window, document)
     * - 'node': чистый Node.js (для утилит без DOM)
     * - 'happy-dom': быстрая альтернатива jsdom
     */
    environment: 'jsdom',

    /**
     * Setup Files — файлы, выполняемые перед каждым тестовым файлом
     *
     * Используется для:
     * - Настройки @testing-library/jest-dom (toBeInTheDocument и т.д.)
     * - Глобальных моков (localStorage, fetch)
     * - Очистки состояния между тестами
     */
    setupFiles: './src/setupTests.ts',

    /**
     * Include — паттерны для поиска тестовых файлов
     */
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],

    /**
     * Coverage — настройки покрытия кода (опционально)
     *
     * Запуск: pnpm test -- --coverage
     */
    coverage: {
      /** Провайдер покрытия */
      provider: 'v8',

      /** Папка для отчётов */
      reportsDirectory: './coverage',

      /** Форматы отчётов */
      reporter: ['text', 'json', 'html'],

      /** Исключить из покрытия */
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
