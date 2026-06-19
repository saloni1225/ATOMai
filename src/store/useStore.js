import { create } from 'zustand';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Add VITE_NEBIUS_API_KEY in .env.local for real generation. Mock mode stays on otherwise.
const NEBIUS_API_KEY = import.meta.env.VITE_NEBIUS_API_KEY || 'YOUR_NEBIUS_API_KEY_HERE';
const MODEL = import.meta.env.VITE_NEBIUS_MODEL || 'google/gemma-3-27b-it';

// When no real key is set, use mock responses so you can test the full UI
const IS_MOCK = !NEBIUS_API_KEY || NEBIUS_API_KEY === 'YOUR_NEBIUS_API_KEY_HERE';

// ─── LLM CALL (goes through Vite proxy to avoid CORS) ────────────────────────
async function callLLM(messages) {
  if (IS_MOCK) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const userMsg = messages[messages.length - 1].content;
    return getMockResponse(userMsg);
  }

  // Uses /api/nebius proxy defined in vite.config.js → avoids CORS
  const res = await fetch('/api/nebius/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NEBIUS_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 1400, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (!data.choices?.[0]) throw new Error('Empty response from LLM');
  return data.choices[0].message.content;
}

// ─── MOCK RESPONSES ───────────────────────────────────────────────────────────
function getMockResponse(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('json array') && p.includes('format')) {
    return '["blog","linkedin","twitter","email"]';
  }
  if (p.includes('expand')) {
    return `[MOCK — connect Nebius key for real output]\n\nThis is an expanded version of your content. The sea otter (Enhydra lutris) is one of the most fascinating marine mammals in existence. Unlike most marine mammals, sea otters rely on their exceptionally dense fur — up to one million hairs per square inch — rather than blubber for insulation. They are one of the few non-primate animals known to use tools, typically using rocks to crack open shellfish while floating on their backs. Sea otters play a crucial role in maintaining kelp forest ecosystems, earning them the status of a keystone species.`;
  }
  if (p.includes('summarize')) {
    return `[MOCK] Sea otters are small but highly intelligent marine mammals that use rocks as tools to crack open shellfish. They store their favorite rocks in a skin pouch under their arms, and their playful, clever nature makes them a standout example of animal tool use.`;
  }
  if (p.includes('improve') && p.includes('writing')) {
    return `[MOCK] Welcome to The Daily Bite. Today, host Sam sits down with marine biologist Dr. Lily Kim to explore one of nature's most clever creatures: the sea otter. These small but remarkably intelligent animals have mastered the use of tools — floating on their backs, balancing rocks on their stomachs to crack open clams and crabs. They even store their favorite rocks in a built-in skin pouch under their arms. Fascinating, resourceful, and undeniably charming.`;
  }
  if (p.includes('rewrite') && p.includes('mood')) {
    return `[MOCK — Tone Rewrite] Sea otters: small in size, enormous in cleverness. These remarkable animals have figured out something most creatures haven't — tools. Floating serenely on their backs, they balance rocks on their bellies and crack open shellfish with practiced precision. And their secret weapon? A built-in pocket of skin where they stash their favorite rock. Nature's original multitasker.`;
  }

  // Format-specific mocks
  if (p.includes('linkedin post')) {
    return `[MOCK — LinkedIn Post]\n\n🦦 What sea otters can teach us about resourcefulness.\n\nSea otters don't have the luxury of modern tools — yet they invented their own. Floating on their backs, they balance rocks on their chests to crack open shellfish. They even store their favorite rock in a skin pouch.\n\nThe lesson? Constraints drive creativity. The best solutions often come not from having more resources — but from making more of what you have.\n\n#Innovation #Leadership #NaturalWorld`;
  }
  if (p.includes('twitter') || p.includes('thread')) {
    return `[MOCK — Twitter/X Thread]\n\n1/ Sea otters are the original tool users 🦦 A thread on nature's most underrated genius:\n\n2/ They float on their backs, balance a flat rock on their chest, and smash shellfish open. Every. Single. Meal.\n\n3/ Here's the wild part — they have a skin pouch under their arm specifically for storing their favorite rock. A BUILT-IN POCKET.\n\n4/ They don't just use tools. They have a preferred tool. They carry it. They protect it. 🤯\n\n5/ Next time someone calls you "basic" — remind them even sea otters have a signature move. 🪨`;
  }
  if (p.includes('blog post')) {
    return `[MOCK — Blog Post]\n\n# The Sea Otter: Nature's Most Surprisingly Clever Engineer\n\nIf you had to name an animal that uses tools, you'd probably think of chimpanzees or crows. But there's a quieter genius out there, floating on its back in the Pacific — the sea otter.\n\n## A Rock and a Hard Place (That It Cracks Open)\n\nSea otters love clams, crabs, and other hard-shelled seafood. The problem? Those shells don't open easily. The solution? Find a flat rock, rest it on your chest, and bash the shell against it until it gives up.\n\nIt sounds simple. But it's remarkable — tool use requires planning, memory, and problem-solving.\n\n## The Original Pocket\n\nHere's what makes sea otters truly special: they don't just use any rock. They have a favourite. And they store it in a loose flap of skin under their forearm — a built-in pocket they carry everywhere.\n\nNext time you complain your jacket doesn't have enough pockets, remember: evolution solved that problem 10 million years ago.`;
  }
  if (p.includes('press release')) {
    return `[MOCK — Press Release]\n\nFOR IMMEDIATE RELEASE\n\n**Sea Otter Intelligence Research Highlights Remarkable Tool-Use Behaviours**\n\n*Marine biologists confirm otters maintain personalised rock collections*\n\nA recent episode of The Daily Bite podcast shed light on extraordinary cognitive behaviours observed in wild sea otter populations. Host Sam and marine biologist Dr. Lily Kim discussed findings showing that sea otters not only use rocks as tools to crack open shellfish — they actively retain and store preferred specimens in a natural skin pouch located beneath their forearms.\n\n"This isn't opportunistic tool use," said Dr. Kim. "These animals select, remember, and transport specific tools. That's a level of forward planning we don't often attribute to marine mammals."\n\nFor further information, contact The Daily Bite editorial team.`;
  }
  if (p.includes('email campaign')) {
    return `[MOCK — Email Campaign]\n\nSubject: 🦦 You won't believe what this otter keeps in its pocket\n\nHi [First Name],\n\nQuick question: when did you last upgrade your toolkit?\n\nSea otters did it 10 million years ago — and they haven't looked back.\n\nIn this week's episode of The Daily Bite, host Sam and marine biologist Dr. Lily Kim break down one of nature's most fascinating examples of problem-solving: how sea otters use rocks to crack open shellfish, and why they carry their favourite rock in a built-in skin pouch.\n\nIt's a 12-minute listen that'll change how you think about intelligence, tools, and resourcefulness.\n\n👉 Listen now →\n\nStay curious,\nThe Daily Bite Team`;
  }
  if (p.includes('instagram')) {
    return `[MOCK — Instagram Caption]\n\nFloating. Snacking. Thriving. 🦦✨\n\nSea otters crack open shellfish using rocks — and they keep their favourite rock in a little skin pocket under their arm. Built-in storage. Living their best life.\n\nThis week on The Daily Bite, we chatted with Dr. Lily Kim about the surprisingly brilliant world of sea otter cognition. Link in bio 🎙️\n\n#SeaOtter #NatureIsAmazing #TheDailyBite #Wildlife #OceanLife #Podcast`;
  }
  if (p.includes('event announcement')) {
    return `[MOCK — Event Announcement]\n\n📅 THE DAILY BITE — LIVE RECORDING\n"Nature's Cleverest Engineers: A Deep Dive into Sea Otter Intelligence"\n\nJoin host Sam and special guest Dr. Lily Kim for a live recording of The Daily Bite podcast.\n\n📍 Venue TBC\n🗓 Date TBC\n🎟 Free entry, limited seats\n\nDr. Kim will walk through her latest field research on sea otter tool use and take questions from the audience. Expect fascinating footage, surprising facts, and the story of one otter's very beloved pocket rock.\n\nRegister at thedailybite.com/live`;
  }
  if (p.includes('promotional copy')) {
    return `[MOCK — Promotional Copy]\n\nThink you know clever?\n\nSea otters have been cracking the code — literally — for millions of years. Float. Rock. Smash. Eat. Repeat. 🦦\n\nThe Daily Bite brings you the world's most unexpectedly brilliant animals, one episode at a time. Hosted by Sam, with experts who actually know their stuff.\n\n🎧 Subscribe free. No fluff. Just fascinating.\nthedailybite.com`;
  }
  if (p.includes('newsletter')) {
    return `[MOCK — Newsletter Snippet]\n\n**This week on The Daily Bite 🎙️**\n\nMarine biologist Dr. Lily Kim joined Sam to talk sea otters — and it did not disappoint. Did you know they have a skin pouch specifically for storing their favourite rock? Or that they float on their backs and use that rock as a table to crack open shellfish?\n\nIt's 12 minutes, it's free, and it's genuinely one of our favourite episodes yet. [Listen here →]`;
  }
  if (p.includes('executive summary')) {
    return `[MOCK — Executive Summary]\n\nEpisode Overview — The Daily Bite: Sea Otter Intelligence\n\nThis episode examines tool-use behaviour in Enhydra lutris (sea otters) through a conversation with Dr. Lily Kim, marine biologist. Key findings discussed: sea otters utilise flat rocks as percussive tools to access hard-shelled prey; individuals demonstrate preference for specific tool specimens; otters store preferred tools in a subcutaneous skin pouch, demonstrating forward planning behaviour. The episode is suitable for general audiences and supports broader content themes around animal cognition and environmental awareness.`;
  }

  // Generic fallback
    return `[MOCK — Generic Response]\n\nThis is a mock response. To get real AI-generated content, add VITE_NEBIUS_API_KEY to .env.local.\n\nYour prompt was processed successfully and this is where the actual Gemma output would appear.`;
}

// ─── FORMATS ─────────────────────────────────────────────────────────────────
export const FORMATS = [
  { id: 'blog',       label: 'Blog Post',          icon: '📝', color: '#6366F1' },
  { id: 'linkedin',   label: 'LinkedIn Post',       icon: '💼', color: '#0A66C2' },
  { id: 'instagram',  label: 'Instagram Caption',   icon: '📸', color: '#E1306C' },
  { id: 'twitter',    label: 'Twitter/X Thread',    icon: '🐦', color: '#1DA1F2' },
  { id: 'press',      label: 'Press Release',       icon: '📢', color: '#10B981' },
  { id: 'email',      label: 'Email Campaign',      icon: '📧', color: '#F59E0B' },
  { id: 'promo',      label: 'Promotional Copy',    icon: '🎯', color: '#EF4444' },
  { id: 'event',      label: 'Event Announcement',  icon: '📅', color: '#8B5CF6' },
  { id: 'newsletter', label: 'Newsletter Snippet',  icon: '📰', color: '#06B6D4' },
  { id: 'summary',    label: 'Executive Summary',   icon: '📊', color: '#84CC16' },
];

export const COLLABORATORS = [
  { id: 'maya', name: 'Maya Rao', role: 'Editor', initials: 'MR', color: '#60A5FA' },
  { id: 'dev', name: 'Dev Shah', role: 'Reviewer', initials: 'DS', color: '#34D399' },
  { id: 'ira', name: 'Ira Mehta', role: 'Publisher', initials: 'IM', color: '#F59E0B' },
  { id: 'admin', name: 'Aarav Sen', role: 'Admin', initials: 'AS', color: '#A78BFA' },
];

export const STATUS_META = {
  draft: { label: 'Draft', tone: 'neutral' },
  in_review: { label: 'In review', tone: 'review' },
  approved: { label: 'Approved', tone: 'success' },
  changes: { label: 'Changes requested', tone: 'warning' },
  published: { label: 'Published', tone: 'published' },
  error: { label: 'Error', tone: 'error' },
};

const workflowEvents = {
  created: 'Generated from master content',
  edited: 'Edited asset copy',
  submitted: 'Submitted for reviewer approval',
  approved: 'Approved by reviewer',
  changes: 'Requested changes',
  published: 'Marked ready for publishing',
  assigned: 'Changed assignee',
};

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const nowDateTime = () => new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function makeAudit(event, actorId = 'maya', note = '') {
  const actor = COLLABORATORS.find(c => c.id === actorId) || COLLABORATORS[0];
  return {
    id: `${event}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event,
    label: workflowEvents[event] || event,
    actorId: actor.id,
    actor: actor.name,
    role: actor.role,
    note,
    at: nowDateTime(),
  };
}

function reviewerFor(formatId, index = 0) {
  if (['press', 'summary', 'event'].includes(formatId)) return 'admin';
  if (['email', 'newsletter'].includes(formatId)) return 'ira';
  return index % 2 === 0 ? 'dev' : 'maya';
}

// ─── STORE ────────────────────────────────────────────────────────────────────
export const useStore = create((set, get) => ({
  content: '',
  setContent: (c) => set({ content: c }),

  assets: [],
  addAssets: (a) => set((s) => ({ assets: [...s.assets, ...a] })),
  clearAssets: () => set({ assets: [] }),
  collaborators: COLLABORATORS,
  masterId: `master-${Date.now()}`,
  campaignName: 'Launch campaign workspace',
  dueWindow: '48h approval SLA',

  view: 'editor',
  setView: (v) => set({ view: v }),
  activeAsset: null,
  setActiveAsset: (a) => set({ activeAsset: a, view: 'asset' }),

  atomizeOpen: false,
  setAtomizeOpen: (v) => set({ atomizeOpen: v }),
  selectedFormats: new Set(['blog', 'linkedin', 'twitter', 'email']),
  toggleFormat: (id) => set((s) => {
    const next = new Set(s.selectedFormats);
    if (next.has(id)) { if (next.size > 1) next.delete(id); }
    else next.add(id);
    return { selectedFormats: next };
  }),

  mood: 'Professional',
  audience: 'General public',
  length: 'Medium',
  setMood: (v) => set({ mood: v }),
  setAudience: (v) => set({ audience: v }),
  setLength: (v) => set({ length: v }),

  isLoading: false,
  loadingMsg: '',
  loadingProgress: 0,

  toast: null,
  showToast: (msg, type = 'info') => {
    set({ toast: { msg, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },

  isMock: IS_MOCK,
  modelName: MODEL,

  assetMetrics: () => {
    const assets = get().assets;
    return {
      total: assets.length,
      draft: assets.filter(a => a.status === 'draft').length,
      inReview: assets.filter(a => a.status === 'in_review').length,
      approved: assets.filter(a => a.status === 'approved').length,
      published: assets.filter(a => a.status === 'published').length,
      changes: assets.filter(a => a.status === 'changes').length,
    };
  },

  updateAssetText: (assetId, text) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, text, version: (a.version || 1) + 1, status: a.status === 'published' ? 'approved' : 'draft', audit: [...(a.audit || []), makeAudit('edited', 'maya', 'Copy updated after review')] }
      : a),
  })),

  submitForReview: (assetId) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, status: 'in_review', audit: [...(a.audit || []), makeAudit('submitted', 'maya', `Routed to ${COLLABORATORS.find(c => c.id === a.reviewerId)?.name || 'reviewer'}`)] }
      : a),
  })),

  approveAsset: (assetId) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, status: 'approved', audit: [...(a.audit || []), makeAudit('approved', a.reviewerId || 'dev', 'Approved for publishing queue')] }
      : a),
  })),

  requestChanges: (assetId) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, status: 'changes', audit: [...(a.audit || []), makeAudit('changes', a.reviewerId || 'dev', 'Needs brand voice pass before approval')] }
      : a),
  })),

  publishAsset: (assetId) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, status: 'published', audit: [...(a.audit || []), makeAudit('published', 'ira', 'Published status recorded')] }
      : a),
  })),

  assignAsset: (assetId, collaboratorId) => set((s) => ({
    assets: s.assets.map(a => a.id === assetId
      ? { ...a, assigneeId: collaboratorId, audit: [...(a.audit || []), makeAudit('assigned', 'admin', `Assigned to ${COLLABORATORS.find(c => c.id === collaboratorId)?.name}`)] }
      : a),
  })),

  // ── Quick actions ────────────────────────────────────────────────────────
  runQuickAction: async (type) => {
    const { content, showToast } = get();
    if (!content.trim()) return;
    const labels = { expand: 'Expanding content...', summarize: 'Summarizing...', improve: 'Polishing writing...' };
    const prompts = {
      expand:    `Expand the following content to be more detailed and informative. Return only the expanded content, no preamble:\n\n${content}`,
      summarize: `Summarize the following content concisely in 2-3 sentences. Return only the summary:\n\n${content}`,
      improve:   `Improve the writing quality and clarity of this content. Return only the improved content:\n\n${content}`,
    };
    set({ isLoading: true, loadingMsg: labels[type] });
    try {
      const result = await callLLM([{ role: 'user', content: prompts[type] }]);
      set({ content: result, isLoading: false });
      showToast(`${type === 'expand' ? 'Expanded' : type === 'summarize' ? 'Summarized' : 'Polished'} successfully`, 'success');
    } catch (e) {
      set({ isLoading: false });
      showToast(`Failed: ${e.message}`, 'error');
    }
  },

  // ── Custom generate (AI instruction box) ────────────────────────────────
  runGenerate: async (aiPrompt) => {
    const { content, showToast } = get();
    if (!content.trim() || !aiPrompt.trim()) return;
    set({ isLoading: true, loadingMsg: 'Running instruction...' });
    try {
      const result = await callLLM([{
        role: 'user',
        content: `You are a content writing assistant. Here is the user's draft:\n\n${content}\n\nInstruction: ${aiPrompt}\n\nApply the instruction and return the full modified content. No preamble.`,
      }]);
      set({ content: result, isLoading: false });
      showToast('Content updated', 'success');
    } catch (e) {
      set({ isLoading: false });
      showToast(`Failed: ${e.message}`, 'error');
    }
  },

  // ── Tone improvement ─────────────────────────────────────────────────────
  improveTone: async (mood, style, length) => {
    const { content, showToast } = get();
    if (!content.trim()) return null;
    set({ isLoading: true, loadingMsg: 'Rewriting tone...' });
    try {
      const result = await callLLM([{
        role: 'user',
        content: `Rewrite the following content with a ${mood} mood, ${style} style, and ${length} length. Return only the rewritten content:\n\n${content}`,
      }]);
      set({ isLoading: false });
      return result;
    } catch (e) {
      set({ isLoading: false });
      showToast(`Tone rewrite failed: ${e.message}`, 'error');
      return null;
    }
  },

  // ── Auto-detect formats ──────────────────────────────────────────────────
  autoDetectFormats: async () => {
    const { content, showToast } = get();
    if (!content.trim()) return;
    set({ isLoading: true, loadingMsg: 'Analyzing content...' });
    try {
      const result = await callLLM([{
        role: 'user',
        content: `Analyze this content and return a JSON array of the best format IDs from: blog, linkedin, instagram, twitter, press, email, promo, event, newsletter, summary.
Return ONLY a valid JSON array, e.g. ["blog","linkedin","twitter"]. No explanation.
Content: ${content.slice(0, 500)}`,
      }]);
      const clean = result.trim().replace(/```json|```/g, '').trim();
      const ids = JSON.parse(clean);
      if (Array.isArray(ids) && ids.length > 0) {
        set({ selectedFormats: new Set(ids), isLoading: false });
        showToast(`Auto-selected ${ids.length} formats`, 'success');
      } else set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      showToast('Auto-detect failed, please select formats manually', 'error');
    }
  },

  // ── Regenerate single asset ───────────────────────────────────────────────
  regenerateAsset: async (asset) => {
    const { content, showToast } = get();
    if (!content.trim()) return null;
    set({ isLoading: true, loadingMsg: `Regenerating ${asset.label}...` });
    try {
      const result = await callLLM([{
        role: 'user',
          content: `You are Gemma, acting as a senior content strategist inside an approval-driven content operations platform. Transform the following master content into a ${asset.label}.
Settings: mood=${asset.mood || 'Professional'}, target audience=${asset.audience || 'General public'}, length=${asset.length || 'Medium'}.
Respect platform conventions, keep messaging consistent with the master source, and avoid unsupported claims.
Return only the ${asset.label} content — no labels, no preamble.

Master content:
${content}`,
      }]);
      set({ isLoading: false });
      showToast(`${asset.label} regenerated`, 'success');
      return result;
    } catch (e) {
      set({ isLoading: false });
      showToast(`Regeneration failed: ${e.message}`, 'error');
      return null;
    }
  },

  // ── Main atomize ─────────────────────────────────────────────────────────
  runAtomize: async () => {
    const { content, selectedFormats, mood, audience, length, showToast } = get();
    if (!content.trim()) return;
    const formats = FORMATS.filter(f => selectedFormats.has(f.id));
    set({ isLoading: true, atomizeOpen: false, loadingMsg: `Starting atomization...`, loadingProgress: 0 });

    const results = [];
    for (let i = 0; i < formats.length; i++) {
      const f = formats[i];
      set({
        loadingMsg: `Generating ${f.label}... (${i + 1}/${formats.length})`,
        loadingProgress: Math.round((i / formats.length) * 100),
      });
      try {
        const text = await callLLM([{
          role: 'user',
          content: `You are Gemma, acting as a senior content strategist inside an approval-driven content operations platform. Transform the following master content into a ${f.label}.
Settings: mood=${mood}, target audience=${audience}, length=${length}.
Write in a way that is native and optimized for ${f.label} specifically.
Preserve the central facts from the master source, keep brand voice consistent across formats, and avoid inventing claims.
Return only the ${f.label} content — no labels, no preamble.

Master content:
${content}`,
        }]);
        results.push({
          id: `${f.id}-${Date.now()}-${i}`,
          parentId: get().masterId,
          formatId: f.id,
          label: f.label,
          icon: f.icon,
          color: f.color,
          text,
          time: nowTime(),
          timestamp: Date.now(),
          mood, audience, length,
          status: 'draft',
          version: 1,
          assigneeId: reviewerFor(f.id, i),
          reviewerId: reviewerFor(f.id, i),
          publisherId: 'ira',
          dueIn: i < 2 ? 'Today' : 'Tomorrow',
          risk: ['press', 'email'].includes(f.id) ? 'Legal/brand review' : 'Standard review',
          audit: [makeAudit('created', 'maya', `Child asset linked to ${get().masterId}`)],
        });
      } catch (e) {
        results.push({
          id: `${f.id}-${Date.now()}-${i}`,
          parentId: get().masterId,
          formatId: f.id,
          label: f.label,
          icon: f.icon,
          color: f.color,
          text: `Generation failed: ${e.message}`,
          time: nowTime(),
          timestamp: Date.now(),
          status: 'error',
          version: 1,
          assigneeId: 'maya',
          reviewerId: 'dev',
          publisherId: 'ira',
          audit: [makeAudit('created', 'maya', `Generation failed: ${e.message}`)],
        });
      }
    }

    set((s) => ({
      assets: [...s.assets, ...results],
      isLoading: false,
      loadingProgress: 100,
      view: 'results',
    }));
    showToast(`${results.filter(r => r.status !== 'error').length} assets generated`, 'success');
  },
}));
