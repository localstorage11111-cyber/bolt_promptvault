import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PromptCategory = 'marketing' | 'coding' | 'data' | 'productivity';

export interface Prompt {
  id: string;
  title: string;
  category: PromptCategory;
  target_model: string;
  prompt_text: string;
  is_favorite: boolean;
  created_at: string;
}

export interface NewPrompt {
  title: string;
  category: PromptCategory;
  target_model: string;
  prompt_text: string;
}
