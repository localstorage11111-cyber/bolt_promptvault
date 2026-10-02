import { Search, Plus, Menu, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import UserMenu from '@/components/UserMenu';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onMenuClick: () => void;
  onSignInClick: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onAddClick,
  onMenuClick,
  onSignInClick,
}: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3.5 lg:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts, models, categories..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-20 text-sm text-zinc-200 placeholder-zinc-500 transition-all focus:border-zinc-700 focus:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-zinc-700/50"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-1 text-xs font-medium text-zinc-400 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddClick}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">Add Prompt</span>
          </button>

          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-800" />
          ) : user ? (
            <UserMenu />
          ) : (
            <button
              onClick={onSignInClick}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
