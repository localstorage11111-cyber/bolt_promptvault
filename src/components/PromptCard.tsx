import { useState } from 'react';
import { Heart, Copy, Check, ChevronDown, Cpu } from 'lucide-react';
import { categoryLabels, categoryColors } from '@/lib/categories';
import { useToast } from '@/lib/toast';
import type { Prompt } from '@/lib/supabase';

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export default function PromptCard({ prompt, onToggleFavorite }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy. Please try again.', 'error');
    }
  };

  const excerpt = expanded
    ? prompt.prompt_text
    : prompt.prompt_text.slice(0, 200);
  const canExpand = prompt.prompt_text.length > 200;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/20">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[prompt.category]}`}
          >
            {categoryLabels[prompt.category]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            <Cpu className="h-3 w-3" />
            {prompt.target_model}
          </span>
        </div>

        <button
          onClick={() => onToggleFavorite(prompt.id, prompt.is_favorite)}
          className={`shrink-0 rounded-lg p-1.5 transition-all hover:bg-zinc-800 ${
            prompt.is_favorite ? 'text-rose-500' : 'text-zinc-600 hover:text-zinc-400'
          }`}
          aria-label={prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className="h-4 w-4"
            fill={prompt.is_favorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <h3 className="mb-2 text-base font-semibold leading-snug text-white">
        {prompt.title}
      </h3>

      <div className="relative mb-4 flex-1">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-[1.7] text-zinc-400">
          {excerpt}
          {!expanded && canExpand && '...'}
        </pre>
        {canExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-500 transition-colors hover:text-amber-400"
          >
            {expanded ? 'Show less' : 'Show more'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      <button
        onClick={handleCopy}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
          copied
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Prompt
          </>
        )}
      </button>
    </article>
  );
}
