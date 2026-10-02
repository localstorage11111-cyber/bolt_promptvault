import { Sparkles, X } from 'lucide-react';
import { categories, favoritesFilter, type CategoryFilter } from '@/lib/categories';
import { useAuth } from '@/lib/auth';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  favoriteCount: number;
  counts: Record<string, number>;
}

export default function Sidebar({
  activeFilter,
  onFilterChange,
  isOpen,
  onClose,
  favoriteCount,
  counts,
}: SidebarProps) {
  const { user } = useAuth();

  const renderNavItem = (cat: CategoryFilter, badge?: number) => {
    const Icon = cat.icon;
    const isActive = activeFilter === cat.value;
    return (
      <button
        key={cat.id}
        onClick={() => {
          onFilterChange(cat.value);
          onClose();
        }}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-zinc-800 text-white shadow-sm'
            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
        }`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 transition-colors ${
            isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
        />
        <span className="flex-1 text-left">{cat.label}</span>
        {badge !== undefined && badge > 0 && (
          <span
            className={`rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
              isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800/80 text-zinc-500'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">PromptVault</h1>
              <p className="text-xs text-zinc-500">Curated AI prompt library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Library
          </p>
          <div className="space-y-1">
            {categories.map((cat) =>
              renderNavItem(cat, cat.value === 'all' ? counts.all : counts[cat.value])
            )}
          </div>

          <div className="my-4 border-t border-zinc-800" />

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Pinned
          </p>
          <div className="space-y-1">{renderNavItem(favoritesFilter, favoriteCount)}</div>
        </nav>

        <div className="border-t border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-900 p-3">
            {user ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white">
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-300">{user.displayName}</p>
                  <p className="truncate text-xs text-zinc-600">{user.email}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                  PV
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-300">Guest User</p>
                  <p className="truncate text-xs text-zinc-600">Not signed in</p>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
