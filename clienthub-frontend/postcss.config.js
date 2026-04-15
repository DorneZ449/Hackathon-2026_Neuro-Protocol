/**
 * PostCSS Configuration
 * ---------------------
 * PostCSS — инструмент для трансформации CSS с помощью JavaScript плагинов.
 *
 * Плагины выполняются в порядке их объявления:
 * 1. tailwindcss — генерирует утилитарные классы на основе tailwind.config.js
 * 2. autoprefixer — добавляет вендорные префиксы для кроссбраузерности
 *
 * @see https://postcss.org/
 * @see https://tailwindcss.com/docs/using-with-preprocessors
 */
export default {
  plugins: {
    /** Генерация Tailwind CSS классов */
    tailwindcss: {},

    /** Автоматическое добавление -webkit-, -moz-, -ms- префиксов */
    autoprefixer: {},
  },
};
