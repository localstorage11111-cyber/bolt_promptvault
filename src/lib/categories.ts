import {
  LayoutGrid,
  Megaphone,
  Code2,
  BarChart3,
  Zap,
  Star,
  type LucideIcon,
} from 'lucide-react';
import type { PromptCategory } from './supabase';

export interface CategoryFilter {
  id: string;
  label: string;
  value: PromptCategory | 'all' | 'favorites';
  icon: LucideIcon;
}

export const categories: CategoryFilter[] = [
  { id: 'all', label: 'All Prompts', value: 'all', icon: LayoutGrid },
  { id: 'marketing', label: 'Marketing & Copy', value: 'marketing', icon: Megaphone },
  { id: 'coding', label: 'Coding & Dev', value: 'coding', icon: Code2 },
  { id: 'data', label: 'Data & Research', value: 'data', icon: BarChart3 },
  { id: 'productivity', label: 'Productivity', value: 'productivity', icon: Zap },
];

export const favoritesFilter: CategoryFilter = {
  id: 'favorites',
  label: 'Favorites',
  value: 'favorites',
  icon: Star,
};

export const categoryLabels: Record<PromptCategory, string> = {
  marketing: 'Marketing & Copy',
  coding: 'Coding & Dev',
  data: 'Data & Research',
  productivity: 'Productivity',
};

export const categoryColors: Record<PromptCategory, string> = {
  marketing: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  coding: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  data: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  productivity: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};
