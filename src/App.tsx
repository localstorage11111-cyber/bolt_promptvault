import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, FilterX } from 'lucide-react';
import { type Prompt, type NewPrompt } from '@/lib/supabase';
import { categories, categoryLabels } from '@/lib/categories';
import { promptStorage, createPromptFromInput } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PromptCard from '@/components/PromptCard';
import AddPromptModal from '@/components/AddPromptModal';
import AuthModal from '@/components/AuthModal';

export default function App() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = promptStorage.load();
    setPrompts(stored);
    setLoading(false);
  }, []);

  const persistPrompts = useCallback((updated: Prompt[]) => {
    setPrompts(updated);
    promptStorage.save(updated);
  }, []);

  const handleAddPrompt = (newPrompt: NewPrompt) => {
    const created = createPromptFromInput(newPrompt);
    persistPrompts([created, ...prompts]);
    showToast('Prompt added successfully!', 'success');
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    const updated = prompts.map((p) =>
      p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
    );
    persistPrompts(updated);
    showToast(
      !isFavorite ? 'Added to favorites' : 'Removed from favorites',
      'info'
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() || activeFilter !== 'all';

  const counts = useMemo(() => {
    const base: Record<string, number> = {
      all: prompts.length,
      marketing: 0,
      coding: 0,
      data: 0,
      productivity: 0,
    };
    for (const p of prompts) {
      base[p.category] = (base[p.category] ?? 0) + 1;
    }
    return base;
  }, [prompts]);

  const favoriteCount = useMemo(
    () => prompts.filter((p) => p.is_favorite).length,
    [prompts]
  );

  const filteredPrompts = useMemo(() => {
    let result = prompts;

    if (activeFilter === 'favorites') {
      result = result.filter((p) => p.is_favorite);
    } else if (activeFilter !== 'all') {
      result = result.filter((p) => p.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt_text.toLowerCase().includes(q) ||
          p.target_model.toLowerCase().includes(q) ||
          categoryLabels[p.category].toLowerCase().includes(q)
      );
    }

    return result;
  }, [prompts, activeFilter, searchQuery]);

  const activeFilterLabel = useMemo(() => {
    if (activeFilter === 'all') return 'All Prompts';
    if (activeFilter === 'favorites') return 'Favorites';
    const cat = categories.find((c) => c.value === activeFilter);
    return cat?.label ?? 'All Prompts';
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        favoriteCount={favoriteCount}
        counts={counts}
      />

      <div className="lg:pl-72">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setAddModalOpen(true)}
          onMenuClick={() => setSidebarOpen(true)}
          onSignInClick={() => setAuthModalOpen(true)}
        />

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {activeFilterLabel}
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
                {searchQuery && ' found'}
                {user && ` · Signed in as ${user.displayName}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
                />
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20">
              <Search className="mb-3 h-10 w-10 text-zinc-700" />
              <p className="text-base font-medium text-zinc-400">No prompts found</p>
              <p className="mt-1 text-sm text-zinc-600">
                {searchQuery
                  ? 'Try a different search term or clear your filters.'
                  : activeFilter === 'favorites'
                    ? 'Heart a prompt to pin it here.'
                    : 'Add a new prompt to get started.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
                >
                  <FilterX className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddPromptModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPrompt}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
