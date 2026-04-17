import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-app">Настройки</h1>
        <p className="mt-2 text-sm text-muted">Тема оформления и параметры аккаунта</p>
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
    </div>
  );
}
