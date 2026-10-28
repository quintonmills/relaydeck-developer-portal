import { Activity, BookOpen, Code2, TerminalSquare, Webhook } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { to: '/docs', label: 'API reference', icon: BookOpen },
  { to: '/sandbox', label: 'Webhook sandbox', icon: TerminalSquare },
  { to: '/logs', label: 'Delivery logs', icon: Activity },
  { to: '/snippets', label: 'Code snippets', icon: Code2 },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/docs" className="flex items-center gap-2.5" aria-label="RelayDeck home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Webhook size={19} strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-slate-950">
            Relay<span className="text-indigo-600">Deck</span>
          </span>
        </NavLink>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          API Status: Online
        </div>
      </div>
    </header>
  );
}
