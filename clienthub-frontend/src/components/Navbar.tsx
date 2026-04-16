import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import CurrencySelector from './CurrencySelector';

type NavItem = {
  to: string;
  label: string;
};

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo<NavItem[]>(
    () => [
      { to: '/dashboard', label: 'Дашборд' },
      { to: '/clients', label: 'Клиенты' },
      { to: '/calendar', label: 'Календарь' },
      ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Админ' }] : []),
      { to: '/profile', label: 'Профиль' },
      { to: '/settings', label: 'Настройки' },
    ],
    [user?.role]
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all',
      isActive
        ? 'bg-white/80 text-blue-600 shadow-sm'
        : 'text-muted hover:bg-white/60 hover:text-app',
    ].join(' ');

  return (
    <header className="surface sticky top-0 z-40 rounded-none border-x-0 border-t-0">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            NP
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-app">Neuro Protocol</div>
            <div className="truncate text-xs text-muted">CRM workspace</div>
          </div>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySelector />
          <ProfileDropdown />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app text-app lg:hidden"
          aria-label="Открыть меню"
          aria-expanded={mobileOpen}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-app bg-white/80 p-3 shadow-xl backdrop-blur-xl lg:hidden">
          <div className="grid gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-app pt-3">
            <CurrencySelector />
            <ProfileDropdown />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
