/**
 * Tailwind CSS Configuration
 * --------------------------
 * Конфигурация утилитарного CSS-фреймворка Tailwind.
 *
 * @see https://tailwindcss.com/docs/configuration
 * @type {import('tailwindcss').Config}
 */
export default {
  /**
   * Content — Файлы для сканирования классов
   * -----------------------------------------
   * Tailwind сканирует эти файлы и генерирует только используемые классы.
   * Неиспользуемые классы автоматически удаляются (tree-shaking).
   */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  /**
   * Theme — Кастомизация дизайн-системы
   * -----------------------------------
   * Здесь расширяется или переопределяется стандартная тема Tailwind.
   */
  theme: {
    extend: {
      /**
       * Пример кастомных цветов для CRM:
       *
       * colors: {
       *   primary: {
       *     50: '#f0f9ff',
       *     500: '#0ea5e9',
       *     900: '#0c4a6e',
       *   },
       *   success: '#22c55e',
       *   warning: '#f59e0b',
       *   danger: '#ef4444',
       * },
       */

      /**
       * Пример кастомных шрифтов:
       *
       * fontFamily: {
       *   sans: ['Inter', 'system-ui', 'sans-serif'],
       *   mono: ['JetBrains Mono', 'monospace'],
       * },
       */

      /**
       * Пример кастомных размеров:
       *
       * spacing: {
       *   '18': '4.5rem',
       *   '128': '32rem',
       * },
       */
    },
  },

  /**
   * Plugins — Расширения функциональности
   * -------------------------------------
   * Официальные плагины:
   * - @tailwindcss/forms — стилизация форм
   * - @tailwindcss/typography — prose классы для контента
   * - @tailwindcss/aspect-ratio — соотношение сторон
   * - @tailwindcss/container-queries — контейнерные запросы
   */
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
