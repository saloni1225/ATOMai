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

const clamp = (value, min = 1, max = 99) => Math.max(min, Math.min(max, Math.round(value)));
const compactNumber = (value) => value >= 1000 ? `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K` : `${value}`;

function signalFromText(text = '', seed = 0) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const hooks = ['why', 'secret', 'future', 'new', 'stop', 'mistake', 'how', 'before', 'after', 'wins'];
  const authority = ['data', 'study', 'research', 'case', 'report', 'statistic', 'evidence', 'analysis'];
  const emotion = ['love', 'fear', 'surprise', 'amazing', 'urgent', 'risk', 'win', 'change', 'future'];
  const humor = ['funny', 'meme', 'wild', 'weird', 'lol', 'joke'];
  const scoreTerms = (terms) => terms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  const lengthFit = words.length < 45 ? 82 : words.length < 120 ? 92 : words.length < 220 ? 78 : 62;
  const readability = clamp(96 - Math.max(0, words.length - 90) * 0.12 + scoreTerms(['simple', 'clear', 'easy']) * 4 + seed % 7);
  return {
    words: words.length,
    hook: clamp(48 + scoreTerms(hooks) * 9 + (text.includes('?') ? 7 : 0) + (text.includes('!') ? 5 : 0) + seed % 11),
    authority: clamp(42 + scoreTerms(authority) * 11 + seed % 9),
    emotion: clamp(45 + scoreTerms(emotion) * 8 + (text.includes('!') ? 6 : 0) + seed % 10),
    humor: clamp(35 + scoreTerms(humor) * 15 + seed % 12),
    clarity: readability,
    lengthFit,
    curiosity: clamp(44 + scoreTerms(['secret', 'why', 'what if', 'future', 'before', 'hidden']) * 10 + (text.includes('?') ? 10 : 0) + seed % 13),
  };
}

function createSimulation(sourceText, options = {}) {
  const baseText = sourceText?.trim() || 'Paste or generate content first, then run the future simulator.';
  const seed = options.seed || 1;
  const focus = options.focus || 'Balanced';
  const strategy = options.strategy || 'Short Hook + High Curiosity';
  const signals = signalFromText(baseText, seed);
  const focusBoost = {
    students: { clarity: 8, emotion: 5 },
    professionals: { authority: 12, clarity: 3 },
    genz: { hook: 10, humor: 10, curiosity: 8 },
    general: { clarity: 10, lengthFit: 5 },
    debate: { hook: 5, authority: 5, clarity: 5 },
    Balanced: {},
  }[focus] || {};
  const merged = Object.fromEntries(Object.entries(signals).map(([key, value]) => [key, clamp(value + (focusBoost[key] || 0))]));
  const average = (...values) => clamp(values.reduce((sum, value) => sum + value, 0) / values.length);
  const audiencePulse = {
    students: average(merged.clarity, merged.emotion, merged.lengthFit),
    professionals: average(merged.authority, merged.clarity, merged.lengthFit - 4),
    genz: average(merged.hook, merged.humor, merged.curiosity),
    general: average(merged.clarity, merged.emotion, merged.hook),
  };
  const futureScore = average(audiencePulse.students, audiencePulse.professionals, audiencePulse.genz, audiencePulse.general, merged.hook);
  const reachBase = 42000 + futureScore * 1250 + merged.curiosity * 420 + seed * 930;
  const engagement = clamp(50 + futureScore * 0.42 + merged.hook * 0.18);
  const shares = Math.round(reachBase * (0.026 + merged.emotion / 5800 + merged.curiosity / 7200));
  const saves = Math.round(reachBase * (0.036 + merged.authority / 6500 + merged.clarity / 7600));
  const comments = Math.round(reachBase * (0.016 + merged.hook / 9000 + merged.emotion / 10000));
  const followers = Math.round(reachBase * (0.004 + futureScore / 65000));
  const universeBase = [
    ['A', 'Professional Authority', 'Professionals', merged.authority + 5, 0.64],
    ['B', 'Storytelling Driven', 'General', average(merged.emotion, merged.clarity) + 5, 0.82],
    ['C', 'Short Hook + High Curiosity', 'Gen-Z', average(merged.hook, merged.curiosity, merged.humor) + 8, 1.16],
    ['D', 'Emotional Narrative', 'Mixed', average(merged.emotion, merged.clarity, merged.hook) + 6, 1.02],
  ];
  const universes = universeBase.map(([id, name, fit, quality, multiplier]) => {
    const predictedReach = Math.round(reachBase * multiplier + quality * 450);
    return {
      id,
      name,
      fit,
      predictedReach,
      reachLabel: compactNumber(predictedReach),
      ctr: (2.4 + quality / 17).toFixed(1),
      engagement: clamp(quality),
      recommended: false,
      preview: buildVariantText(baseText, name),
    };
  }).sort((a, b) => b.engagement - a.engagement).map((universe, index) => ({ ...universe, recommended: index === 0 }));
  const audiences = [
    {
      id: 'students',
      name: 'Student Twin',
      pulse: audiencePulse.students,
      reaction: audiencePulse.students > 82 ? 'Loved it.' : 'Understands it, but wants more examples.',
      futureSentiment: audiencePulse.students > 80 ? 'Energized and likely to share with classmates.' : 'Curious, but motivation could be stronger.',
      stats: [
        ['Share Probability', `${clamp(audiencePulse.students + 4)}%`],
        ['Motivation Score', `${clamp(audiencePulse.students + 7)}/100`],
        ['Engagement Score', `${clamp(audiencePulse.students + 2)}/100`],
      ],
      likes: 'Easy to understand',
      dislikes: merged.clarity < 75 ? 'Some terms still feel dense' : 'Wants one memorable example',
      actions: ['Optimize For Students', 'Regenerate Analysis', 'Compare Version'],
    },
    {
      id: 'professionals',
      name: 'Professional Twin',
      pulse: audiencePulse.professionals,
      reaction: audiencePulse.professionals > 80 ? 'Credible and useful.' : 'Needs proof before acting.',
      futureSentiment: audiencePulse.professionals > 80 ? 'Ready to bookmark and forward internally.' : 'Interested, but asks for stronger evidence.',
      stats: [
        ['Credibility Score', `${clamp(merged.authority + 10)}/100`],
        ['Data Requirement', merged.authority > 72 ? 'Medium' : 'High'],
        ['Practicality Score', `${clamp(audiencePulse.professionals + 3)}/100`],
        ['Conversion Likelihood', `${clamp(audiencePulse.professionals - 5)}%`],
      ],
      likes: 'Practical angle',
      dislikes: merged.authority < 74 ? 'Missing supporting statistics' : 'Could use a sharper CTA',
      actions: ['Add Statistics', 'Add Examples', 'Optimize For Professionals'],
    },
    {
      id: 'genz',
      name: 'Gen-Z Twin',
      pulse: audiencePulse.genz,
      reaction: audiencePulse.genz > 82 ? 'Would stop scrolling.' : 'Hook needs more bite.',
      futureSentiment: audiencePulse.genz > 82 ? 'High replay, comment, and remix potential.' : 'May skim unless the opener gets sharper.',
      stats: [
        ['Attention Score', `${clamp(merged.hook + 6)}/100`],
        ['Humor Score', `${clamp(merged.humor + 5)}/100`],
        ['Scroll-Stopping Score', `${clamp(average(merged.hook, merged.curiosity) + 8)}/100`],
        ['Virality Potential', `${clamp(audiencePulse.genz + 6)}%`],
        ['Meme Compatibility', `${clamp(merged.humor + 12)}%`],
      ],
      likes: 'Curiosity angle',
      dislikes: merged.hook < 78 ? 'Hook is weak' : 'Could be punchier',
      actions: ['Add Humor', 'Shorten Intro', 'Improve Hook'],
    },
    {
      id: 'general',
      name: 'General Twin',
      pulse: audiencePulse.general,
      reaction: audiencePulse.general > 82 ? 'Clear and recommendable.' : 'Gets the idea but wants fewer steps.',
      futureSentiment: audiencePulse.general > 80 ? 'Likely to finish and recommend.' : 'Positive, but clarity is the unlock.',
      stats: [
        ['Simplicity Score', `${clamp(merged.clarity + 4)}/100`],
        ['Interest Score', `${clamp(audiencePulse.general + 2)}/100`],
        ['Clarity Score', `${clamp(merged.clarity)}/100`],
        ['Recommendation Score', `${clamp(audiencePulse.general + 5)}/100`],
      ],
      likes: 'Clear direction',
      dislikes: merged.clarity < 80 ? 'Reduce complexity' : 'Needs stronger ending',
      actions: ['Simplify Content', 'Improve Readability'],
    },
  ];
  const debate = [
    ['Student Agent', audiences[0].reaction, 'students'],
    ['Professional Agent', audiences[1].dislikes, 'professionals'],
    ['Gen-Z Agent', audiences[2].dislikes, 'genz'],
    ['General Audience', audiences[3].reaction, 'general'],
    ['AI Creator', `Optimizing for ${focus === 'Balanced' ? 'all audiences' : focus}.`, 'creator'],
    ['AI Strategist', `Predicted engagement moves to ${engagement}% after recalculation.`, 'strategist'],
    ['AI Growth Agent', `Curiosity and urgency could lift CTR to ${(2.8 + merged.curiosity / 18).toFixed(1)}%.`, 'growth'],
  ].map(([agent, message, tone], index) => ({ id: `${seed}-${index}-${tone}`, agent, message, tone }));
  const recommendations = [
    ['Add Statistic', 'Professionals', '+18%', '+9%', 'Add one proof point, benchmark, or result.'],
    ['Simplify Terminology', 'Students', '+12%', '+11%', 'Replace dense wording with classroom-clear phrasing.'],
    ['Improve Hook', 'Gen-Z', '+22%', '+14%', 'Open with tension, curiosity, or a sharp promise.'],
    ['Reduce Complexity', 'General', '+10%', '+8%', 'Cut secondary details and make the next action obvious.'],
    ['Add Stronger CTA', 'Professionals', '+9%', '+13%', 'Tell readers exactly what to do after reading.'],
  ].map(([title, audience, reachLift, engagementLift, detail], index) => ({
    id: `${title.toLowerCase().replace(/\s+/g, '-')}-${seed}`,
    title,
    audience,
    reachLift,
    engagementLift,
    impact: clamp(70 + index * 4 + futureScore / 6),
    detail,
    applied: false,
  }));
  const rewrites = [
    ['A', 'Professional', buildVariantText(baseText, 'Professional Authority'), clamp(audiencePulse.professionals + 4)],
    ['B', 'Storytelling', buildVariantText(baseText, 'Storytelling Driven'), clamp(audiencePulse.general + 5)],
    ['C', 'Viral', buildVariantText(baseText, 'Short Hook + High Curiosity'), clamp(audiencePulse.genz + 7)],
    ['D', 'Thought Leadership', buildVariantText(baseText, 'Emotional Narrative'), clamp(futureScore + 5)],
  ].map(([id, name, text, score]) => ({ id, name, text, score }));
  return {
    runId: seed,
    focus,
    strategy,
    activeUniverseId: universes[0]?.id || 'C',
    activeRewriteId: 'C',
    activeContent: baseText,
    futureScore,
    audienceMatch: futureScore > 84 ? 'High' : futureScore > 72 ? 'Medium-high' : 'Needs work',
    publishingConfidence: clamp(futureScore + 7),
    recommendation: futureScore > 82 ? 'Publish Now' : 'Improve Before Publishing',
    metrics: {
      reach: compactNumber(Math.round(reachBase)),
      reachRaw: Math.round(reachBase),
      engagement,
      saves: compactNumber(saves),
      shares: compactNumber(shares),
      comments: compactNumber(comments),
      followers: `+${compactNumber(followers)}`,
    },
    timeline: [
      ['24 Hours', Math.round(reachBase * 0.16)],
      ['7 Days', Math.round(reachBase * 0.52)],
      ['30 Days', Math.round(reachBase)],
      ['90 Days', Math.round(reachBase * 1.38)],
    ].map(([label, reach]) => ({ label, reach, reachLabel: compactNumber(reach) })),
    virality: {
      hook: merged.hook,
      emotional: merged.emotion,
      curiosity: merged.curiosity,
      authority: merged.authority,
      shareability: clamp(average(merged.emotion, merged.curiosity, futureScore)),
      viral: clamp(average(merged.hook, merged.emotion, merged.curiosity, merged.humor)),
    },
    audiences,
    universes,
    debate,
    recommendations,
    rewrites,
    lastAction: 'Future simulation initialized',
  };
}

function buildVariantText(text, strategy) {
  const clean = text.trim();
  const first = clean.split(/\n+/)[0]?.slice(0, 220) || clean.slice(0, 220);
  const variants = {
    'Professional Authority': `Data-backed angle: ${first}\n\nAdd one concrete benchmark, a practical takeaway, and a direct next step for decision-makers.`,
    'Storytelling Driven': `Imagine the moment this becomes obvious: ${first}\n\nTurn the idea into a human story, then close with the lesson readers can use today.`,
    'Short Hook + High Curiosity': `Most people miss this until it is too late: ${first}\n\nHere is the simple shift that makes the content worth sharing.`,
    'Emotional Narrative': `The real reason this matters is not just information. It is momentum.\n\n${first}\n\nMake the reader feel the cost of waiting and the upside of acting now.`,
  };
  return variants[strategy] || clean;
}

function applyOptimizationText(text, action) {
  const openers = {
    students: 'Simple version: here is the idea in plain language, with one example you can use immediately.',
    professionals: 'Evidence-led version: the core claim is supported by a practical benchmark and a clearer business outcome.',
    genz: 'Stop scrolling: this is the tiny shift that changes the whole result.',
    general: 'Clearer version: this trims the complexity and makes the main point easier to act on.',
    debate: 'Consensus version: stronger hook, clearer proof, simpler takeaway, and a sharper next action.',
  };
  return `${openers[action] || 'Optimized version:'}\n\n${text.trim()}`;
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

  simulation: null,
  simulationSeed: 1,
  startSimulation: (source = null) => {
    const { content, activeAsset, simulationSeed } = get();
    const sourceText = source || activeAsset?.text || content;
    const next = createSimulation(sourceText, { seed: simulationSeed + 1 });
    set({ simulation: next, simulationSeed: simulationSeed + 1, view: 'simulator' });
  },
  recalculateSimulation: (focus = 'Balanced', strategy = null) => {
    const { simulation, content, simulationSeed } = get();
    const sourceText = simulation?.activeContent || content;
    const nextSeed = simulationSeed + 1;
    const next = createSimulation(sourceText, {
      seed: nextSeed,
      focus,
      strategy: strategy || simulation?.strategy || 'Short Hook + High Curiosity',
    });
    set({ simulation: { ...next, lastAction: `Recalculated for ${focus}` }, simulationSeed: nextSeed });
  },
  optimizeSimulation: (action = 'debate') => {
    const { simulation, content, simulationSeed, showToast } = get();
    const current = simulation?.activeContent || content;
    const focusMap = {
      'Optimize For Students': 'students',
      'Regenerate Analysis': 'students',
      'Compare Version': 'students',
      'Add Statistics': 'professionals',
      'Add Examples': 'professionals',
      'Optimize For Professionals': 'professionals',
      'Add Humor': 'genz',
      'Shorten Intro': 'genz',
      'Improve Hook': 'genz',
      'Simplify Content': 'general',
      'Improve Readability': 'general',
      'Optimize Based On Debate': 'debate',
      'Resolve Conflict': 'debate',
      'Generate Counter Arguments': 'debate',
      'Continue Debate': 'debate',
    };
    const focus = focusMap[action] || action || 'debate';
    const optimized = applyOptimizationText(current, focus);
    const nextSeed = simulationSeed + 1;
    const next = createSimulation(optimized, {
      seed: nextSeed,
      focus,
      strategy: simulation?.strategy || 'Short Hook + High Curiosity',
    });
    set({
      content: optimized,
      simulation: { ...next, lastAction: action },
      simulationSeed: nextSeed,
    });
    showToast(`Future recalculated: ${action}`, 'success');
  },
  selectUniverse: (universeId) => set((s) => {
    if (!s.simulation) return {};
    const selected = s.simulation.universes.find(u => u.id === universeId);
    return {
      simulation: {
        ...s.simulation,
        activeUniverseId: universeId,
        activeContent: selected?.preview || s.simulation.activeContent,
        lastAction: selected ? `${selected.name} universe selected` : 'Universe selected',
      },
    };
  }),
  runUniverseAction: (universeId, action) => {
    const { simulation, simulationSeed, showToast } = get();
    if (!simulation) return;
    const selected = simulation.universes.find(u => u.id === universeId) || simulation.universes[0];
    if (!selected) return;
    if (action === 'Set As Final Version' || action === 'Preview Content' || action === 'Compare Against Current') {
      set({
        content: selected.preview,
        simulation: {
          ...createSimulation(selected.preview, { seed: simulationSeed + 1, strategy: selected.name, focus: selected.fit.toLowerCase().replace('-', '') }),
          activeUniverseId: selected.id,
          lastAction: action,
        },
        simulationSeed: simulationSeed + 1,
      });
    } else if (action === 'Duplicate Universe') {
      const clone = {
        ...selected,
        id: `${selected.id}${simulation.universes.length + 1}`,
        name: `${selected.name} Variant`,
        predictedReach: Math.round(selected.predictedReach * 1.06),
        reachLabel: compactNumber(Math.round(selected.predictedReach * 1.06)),
        engagement: clamp(selected.engagement + 3),
        recommended: false,
      };
      set({ simulation: { ...simulation, universes: [clone, ...simulation.universes], activeUniverseId: clone.id, lastAction: action } });
    } else {
      get().recalculateSimulation(selected.fit.toLowerCase(), selected.name);
    }
    showToast(action, 'success');
  },
  applyRecommendation: (recommendationId) => {
    const { simulation } = get();
    if (!simulation) return;
    const rec = simulation.recommendations.find(r => r.id === recommendationId);
    if (!rec) return;
    get().optimizeSimulation(rec.title);
    set((s) => ({
      simulation: s.simulation ? {
        ...s.simulation,
        recommendations: s.simulation.recommendations.map(r => r.id === recommendationId ? { ...r, applied: true } : r),
        lastAction: `${rec.title} applied`,
      } : s.simulation,
    }));
  },
  undoRecommendation: () => {
    const { content, simulationSeed, showToast } = get();
    const lines = content.split('\n\n');
    const restored = lines.length > 1 ? lines.slice(1).join('\n\n') : content;
    const nextSeed = simulationSeed + 1;
    set({
      content: restored,
      simulation: { ...createSimulation(restored, { seed: nextSeed }), lastAction: 'Optimization undone' },
      simulationSeed: nextSeed,
    });
    showToast('Optimization undone', 'info');
  },
  setRewriteActive: (rewriteId) => {
    const { simulation, simulationSeed, showToast } = get();
    if (!simulation) return;
    const rewrite = simulation.rewrites.find(r => r.id === rewriteId);
    if (!rewrite) return;
    const nextSeed = simulationSeed + 1;
    const next = createSimulation(rewrite.text, { seed: nextSeed, strategy: rewrite.name });
    set({
      content: rewrite.text,
      simulation: { ...next, activeRewriteId: rewriteId, lastAction: `${rewrite.name} rewrite activated` },
      simulationSeed: nextSeed,
    });
    showToast(`${rewrite.name} version is active`, 'success');
  },
  publishSimulationWinner: () => {
    const { simulation, showToast } = get();
    if (!simulation) return;
    showToast(`Publishing confidence ${simulation.publishingConfidence}% - ${simulation.recommendation}`, 'success');
  },

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
