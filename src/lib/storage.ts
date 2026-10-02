import type { Prompt, NewPrompt } from './supabase';

const STORAGE_KEY = 'promptvault_prompts';

const SEED_PROMPTS: Prompt[] = [
  {
    id: 'seed-1',
    title: 'Full-Stack Code Refactoring',
    category: 'coding',
    target_model: 'DeepSeek-R1',
    prompt_text: `You are a senior full-stack engineer specializing in clean architecture and maintainable code. I will provide you with a codebase snippet (or file). Your task:

1. Analyze the code for: code smells, DRY violations, SOLID principle violations, performance bottlenecks, and security vulnerabilities.
2. Propose a refactored version that:
   - Improves readability and reduces cognitive complexity
   - Extracts reusable logic into well-named functions or modules
   - Adds appropriate TypeScript types (if applicable)
   - Follows framework-specific best practices
3. Provide a brief rationale for each major change.
4. Flag any breaking changes and suggest a migration path.

Code:
\`\`\`
[paste code here]
\`\`\``,
    is_favorite: true,
    created_at: '2026-09-28T10:00:00Z',
  },
  {
    id: 'seed-2',
    title: 'Technical SEO & Schema Generator',
    category: 'marketing',
    target_model: 'Claude 3.5 Sonnet',
    prompt_text: `You are an expert technical SEO consultant. Given a URL or page description, generate a complete on-page SEO package:

1. Meta title (≤60 chars) and meta description (≤155 chars) optimized for the target keyword.
2. A JSON-LD structured data block (Schema.org) appropriate for the page type (Article, Product, FAQPage, etc.).
3. Recommended heading hierarchy (H1–H3) with suggested copy.
4. Internal linking suggestions and anchor text recommendations.
5. A prioritized checklist of technical improvements (Core Web Vitals, mobile, indexability).

Target keyword: [insert keyword]
Page type: [insert page type]
Current content summary: [insert summary]`,
    is_favorite: false,
    created_at: '2026-09-28T11:00:00Z',
  },
  {
    id: 'seed-3',
    title: 'Executive Data Synthesis',
    category: 'data',
    target_model: 'GPT-4o',
    prompt_text: `You are a chief data analyst advising C-suite executives. I will provide you with raw data (CSV, JSON, or a text summary). Your deliverables:

1. Executive Summary: 3–5 bullet points capturing the most critical insights, written for a non-technical audience.
2. Key Metrics Dashboard: Identify the top 5 KPIs, their current values, trend direction, and why they matter.
3. Anomaly Detection: Flag any outliers, unexpected correlations, or data quality issues.
4. Strategic Recommendations: 3 actionable recommendations ranked by impact and feasibility.
5. Suggested Visualizations: Describe the ideal chart type for each key insight.

Data:
[paste data here]`,
    is_favorite: false,
    created_at: '2026-09-28T12:00:00Z',
  },
  {
    id: 'seed-4',
    title: 'Fast Multimodal Visual Analysis',
    category: 'data',
    target_model: 'Gemini 2.0 Flash',
    prompt_text: `You are a multimodal AI analyst with expertise in computer vision and design. Analyze the provided image and deliver:

1. Visual Description: A concise summary of what the image depicts (objects, scene, context).
2. Composition & Design: Evaluate layout, color palette, typography (if present), and visual hierarchy.
3. Content Extraction: Transcribe any visible text, numbers, or labels accurately.
4. Insights: Identify patterns, anomalies, or notable elements that a human reviewer should know.
5. Use-Case Recommendations: Suggest 2–3 practical applications for this image (e.g., documentation, marketing, training data).

Image: [attach image]`,
    is_favorite: true,
    created_at: '2026-09-28T13:00:00Z',
  },
  {
    id: 'seed-5',
    title: 'SaaS Cold Outreach Sequence',
    category: 'marketing',
    target_model: 'Claude 3.5 Sonnet',
    prompt_text: `You are a B2B SaaS sales strategist. Create a 5-touch cold outreach sequence (email + LinkedIn) for the following ICP. Each touch should feel personalized, avoid generic templates, and build a narrative arc.

For each touch provide:
- Channel (email or LinkedIn)
- Subject line / message hook
- Full body copy (≤150 words for email, ≤100 words for LinkedIn)
- CTA (soft or hard)
- Timing (day and spacing relative to touch 1)

ICP: [insert ideal customer profile]
Product: [insert product and one-line value prop]
Key differentiator: [insert differentiator]
Sender persona: [insert sender role and name]`,
    is_favorite: false,
    created_at: '2026-09-28T14:00:00Z',
  },
  {
    id: 'seed-6',
    title: 'SQL Query Optimizer & Explainer',
    category: 'coding',
    target_model: 'GPT-4o',
    prompt_text: `You are a database performance engineer. I will give you a SQL query and (optionally) the table schema. Your task:

1. Explain what the query does in plain English, step by step.
2. Identify performance issues: full table scans, missing indexes, N+1 patterns, inefficient JOINs, suboptimal filtering order.
3. Provide an optimized version of the query with:
   - Reformatted SQL for readability
   - Suggested indexes (with column order rationale)
   - Alternative query structures if applicable (e.g., CTEs, window functions)
4. Estimate the expected performance improvement and explain why.
5. Flag any correctness risks in the original query.

Query:
\`\`\`sql
[paste SQL here]
\`\`\`

Schema (optional):
[paste schema here]`,
    is_favorite: false,
    created_at: '2026-09-28T15:00:00Z',
  },
];

function loadFromStorage(): Prompt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = [...SEED_PROMPTS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Prompt[];
    if (Array.isArray(parsed)) return parsed;
    return SEED_PROMPTS;
  } catch {
    return SEED_PROMPTS;
  }
}

function saveToStorage(prompts: Prompt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch {
    // ignore quota errors
  }
}

export const promptStorage = {
  load: loadFromStorage,
  save: saveToStorage,
};

export function createPromptFromInput(input: NewPrompt): Prompt {
  return {
    id: crypto.randomUUID(),
    title: input.title,
    category: input.category,
    target_model: input.target_model,
    prompt_text: input.prompt_text,
    is_favorite: false,
    created_at: new Date().toISOString(),
  };
}
