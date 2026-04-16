import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type NotificationSettings = {
  newClients: boolean;
  newOrders: boolean;
  weeklyDigest: boolean;
};

const STORAGE_KEY = 'np:settings';

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  newClients: true,
  newOrders: true,
  weeklyDigest: false,
};

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(saved) } : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  if (!user) return null;

  const themes = [
    {
      id: 'light' as const,
      name: 'Светлая',
      icon: '☀️',
      description: 'Чистый нейтральный интерфейс',
    },
    {
      id: 'dark' as const,
      name: 'Тёмная',
      icon: '🌙',
      description: 'Меньше нагрузки на глаза',
    },
    {
      id: 'cosmic' as const,
      name: 'Космическая',
      icon: '🪐',
      description: 'Акцентная тема с глубиной',
    },
  ];

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-app">Настройки</h1>
        <p className="mt-2 text-sm text-muted">Тема, уведомления и параметры аккаунта</p>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-app">Тема оформления</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                theme === item.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                  : 'border-app hover:-translate-y-0.5 hover:border-blue-300'
              }`}
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <div className="font-semibold text-app">{item.name}</div>
              <div className="mt-1 text-sm text-muted">{item.description}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-app">Аккаунт</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-app px-4 py-3">
              <span className="text-sm text-muted">Email</span>
              <span className="text-sm font-medium text-app">{user.email}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-app px-4 py-3">
              <span className="text-sm text-muted">Роль</span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-app p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-app">Безопасность</h3>
              <span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-muted">
                скоро
              </span>
            </div>

            <button type="button" disabled className="btn-secondary cursor-not-allowed opacity-60">
              Изменить пароль
            </button>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-app">Уведомления</h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-app px-4 py-3">
              <div>
                <div className="text-sm font-medium text-app">Новые клиенты</div>
                <div className="text-xs text-muted">Сообщать о новых лидах</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.newClients}
                onChange={() => toggleNotification('newClients')}
                className="h-4 w-4 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-app px-4 py-3">
              <div>
                <div className="text-sm font-medium text-app">Новые заказы</div>
                <div className="text-xs text-muted">Сообщать о созданных заказах</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.newOrders}
                onChange={() => toggleNotification('newOrders')}
                className="h-4 w-4 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-app px-4 py-3">
              <div>
                <div className="text-sm font-medium text-app">Еженедельный дайджест</div>
                <div className="text-xs text-muted">Краткий отчёт по активности</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={() => toggleNotification('weeklyDigest')}
                className="h-4 w-4 accent-blue-600"
              />
            </label>
          </div>
        </section>
      </div>

      <section className="card border-red-500/20 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-red-600">Опасная зона</h2>
            <p className="mt-1 text-sm text-muted">
              Удаление аккаунта пока не реализовано на backend, поэтому кнопку не активировать.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-red-100 px-4 py-2.5 font-medium text-red-700 opacity-70"
          >
            Недоступно
          </button>
        </div>
      </section>
    </div>
  );
}
