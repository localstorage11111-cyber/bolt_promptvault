/*
# Create prompts table (single-tenant, no auth)

1. New Tables
- `prompts`
  - `id` (uuid, primary key)
  - `title` (text, not null) — the prompt's display name
  - `category` (text, not null) — one of: marketing, coding, data, productivity
  - `target_model` (text, not null) — the AI model this prompt is optimized for
  - `prompt_text` (text, not null) — the full prompt body
  - `is_favorite` (boolean, default false) — whether the prompt is pinned to favorites
  - `created_at` (timestamptz, default now())

2. Seed Data
- 6 production-grade sample prompts covering different categories and target models.

3. Security
- Enable RLS on `prompts`.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public (single-tenant app with no sign-in).
*/

CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('marketing', 'coding', 'data', 'productivity')),
  target_model text NOT NULL,
  prompt_text text NOT NULL,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_prompts" ON prompts;
CREATE POLICY "anon_select_prompts" ON prompts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prompts" ON prompts;
CREATE POLICY "anon_insert_prompts" ON prompts FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prompts" ON prompts;
CREATE POLICY "anon_update_prompts" ON prompts FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prompts" ON prompts;
CREATE POLICY "anon_delete_prompts" ON prompts FOR DELETE
TO anon, authenticated USING (true);

-- Seed data: 6 production-grade sample prompts
INSERT INTO prompts (title, category, target_model, prompt_text, is_favorite) VALUES
(
  'Full-Stack Code Refactoring',
  'coding',
  'DeepSeek-R1',
  'You are a senior full-stack engineer specializing in clean architecture and maintainable code. I will provide you with a codebase snippet (or file). Your task:\n\n1. Analyze the code for: code smells, DRY violations, SOLID principle violations, performance bottlenecks, and security vulnerabilities.\n2. Propose a refactored version that:\n   - Improves readability and reduces cognitive complexity\n   - Extracts reusable logic into well-named functions or modules\n   - Adds appropriate TypeScript types (if applicable)\n   - Follows framework-specific best practices\n3. Provide a brief rationale for each major change.\n4. Flag any breaking changes and suggest a migration path.\n\nCode:\n```\n[paste code here]\n```',
  true
),
(
  'Technical SEO & Schema Generator',
  'marketing',
  'Claude 3.5 Sonnet',
  'You are an expert technical SEO consultant. Given a URL or page description, generate a complete on-page SEO package:\n\n1. Meta title (≤60 chars) and meta description (≤155 chars) optimized for the target keyword.\n2. A JSON-LD structured data block (Schema.org) appropriate for the page type (Article, Product, FAQPage, etc.).\n3. Recommended heading hierarchy (H1–H3) with suggested copy.\n4. Internal linking suggestions and anchor text recommendations.\n5. A prioritized checklist of technical improvements (Core Web Vitals, mobile, indexability).\n\nTarget keyword: [insert keyword]\nPage type: [insert page type]\nCurrent content summary: [insert summary]',
  false
),
(
  'Executive Data Synthesis',
  'data',
  'GPT-4o',
  'You are a chief data analyst advising C-suite executives. I will provide you with raw data (CSV, JSON, or a text summary). Your deliverables:\n\n1. Executive Summary: 3–5 bullet points capturing the most critical insights, written for a non-technical audience.\n2. Key Metrics Dashboard: Identify the top 5 KPIs, their current values, trend direction, and why they matter.\n3. Anomaly Detection: Flag any outliers, unexpected correlations, or data quality issues.\n4. Strategic Recommendations: 3 actionable recommendations ranked by impact and feasibility.\n5. Suggested Visualizations: Describe the ideal chart type for each key insight.\n\nData:\n[paste data here]',
  false
),
(
  'Fast Multimodal Visual Analysis',
  'data',
  'Gemini 2.0 Flash',
  'You are a multimodal AI analyst with expertise in computer vision and design. Analyze the provided image and deliver:\n\n1. Visual Description: A concise summary of what the image depicts (objects, scene, context).\n2. Composition & Design: Evaluate layout, color palette, typography (if present), and visual hierarchy.\n3. Content Extraction: Transcribe any visible text, numbers, or labels accurately.\n4. Insights: Identify patterns, anomalies, or notable elements that a human reviewer should know.\n5. Use-Case Recommendations: Suggest 2–3 practical applications for this image (e.g., documentation, marketing, training data).\n\nImage: [attach image]',
  true
),
(
  'SaaS Cold Outreach Sequence',
  'marketing',
  'Claude 3.5 Sonnet',
  'You are a B2B SaaS sales strategist. Create a 5-touch cold outreach sequence (email + LinkedIn) for the following ICP. Each touch should feel personalized, avoid generic templates, and build a narrative arc.\n\nFor each touch provide:\n- Channel (email or LinkedIn)\n- Subject line / message hook\n- Full body copy (≤150 words for email, ≤100 words for LinkedIn)\n- CTA (soft or hard)\n- Timing (day and spacing relative to touch 1)\n\nICP: [insert ideal customer profile]\nProduct: [insert product and one-line value prop]\nKey differentiator: [insert differentiator]\nSender persona: [insert sender role and name]',
  false
),
(
  'SQL Query Optimizer & Explainer',
  'coding',
  'GPT-4o',
  'You are a database performance engineer. I will give you a SQL query and (optionally) the table schema. Your task:\n\n1. Explain what the query does in plain English, step by step.\n2. Identify performance issues: full table scans, missing indexes, N+1 patterns, inefficient JOINs, suboptimal filtering order.\n3. Provide an optimized version of the query with:\n   - Reformatted SQL for readability\n   - Suggested indexes (with column order rationale)\n   - Alternative query structures if applicable (e.g., CTEs, window functions)\n4. Estimate the expected performance improvement and explain why.\n5. Flag any correctness risks in the original query.\n\nQuery:\n```sql\n[paste SQL here]\n```\n\nSchema (optional):\n[paste schema here]',
  false
)
ON CONFLICT DO NOTHING;
