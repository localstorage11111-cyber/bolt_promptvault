import { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-1.5 pl-1.5 pr-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white">
          {user.initials}
        </div>
        <span className="hidden max-w-[120px] truncate sm:inline">{user.displayName}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          style={{ animation: 'menu-in 0.15s ease-out' }}
        >
          <div className="border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user.displayName}</p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-1.5">
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-500">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </div>
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
