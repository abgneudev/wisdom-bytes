const FALLBACK_MODULE = {
  id: "generated-fallback",
  title: "A Story in Progress",
  subtitle: "a realtime parable shaped by your prompt",
  category: "Clarity",
  topic: "Self-Reflection",
  icon: "🧭",
  accentColor: "#6366f1",
  cards: [
    {
      id: 1,
      type: "story",
      tradition: null,
      body: "A traveler arrived at a crossroads with a full bag and a restless mind. Every path looked urgent, but none felt true.",
      visual: "🧭",
      stickerQuery: "crossroads",
      bg: "#ffffff",
      accentBg: "#eef2ff",
      textColor: "#0f172a",
      accent: "#6366f1",
    },
    {
      id: 2,
      type: "inflection",
      inflectionKey: "firstTurn",
      prompt:
        "When you feel pulled in too many directions, what signal tells you which choice is truly yours?",
      placeholder: "Write the signal you trust most...",
      visual: "✍️",
      bg: "#fefce8",
      accentBg: "#fef9c3",
      textColor: "#0f172a",
      accent: "#ca8a04",
    },
    {
      id: 3,
      type: "story",
      tradition: "Tao Te Ching",
      body: "A ferryman told the traveler, 'Water does not panic at every bend. It keeps moving and lets shape reveal itself.'",
      visual: "💧",
      stickerQuery: "river",
      bg: "#ffffff",
      accentBg: "#f0f9ff",
      textColor: "#0f172a",
      accent: "#0ea5e9",
    },
    {
      id: 4,
      type: "inflection",
      inflectionKey: "secondTurn",
      prompt:
        "What is one place in your life where forcing outcomes has made things heavier instead of clearer?",
      placeholder: "Name the place where you can loosen your grip...",
      visual: "✍️",
      bg: "#fefce8",
      accentBg: "#fef9c3",
      textColor: "#0f172a",
      accent: "#ca8a04",
    },
    {
      id: 5,
      type: "story",
      tradition: "Buddhism",
      body: "At sunset, the traveler sat in silence and noticed the noise was mostly fear of being misunderstood. The fear softened once it was named.",
      visual: "⛰️",
      stickerQuery: "meditation",
      bg: "#ffffff",
      accentBg: "#faf5ff",
      textColor: "#0f172a",
      accent: "#8b5cf6",
    },
    {
      id: 6,
      type: "reflection",
      visual: "🪞",
      bg: "#ffffff",
      accentBg: "#f8fafc",
      textColor: "#0f172a",
      accent: "#22c55e",
    },
  ],
  inflectionContext: {
    firstTurn: {
      label: "Your signal for a true choice",
      storyContext:
        "The traveler stands at a crossroads, overwhelmed by options. Tao wisdom invites flowing instead of forcing and trusting what feels aligned rather than urgent.",
    },
    secondTurn: {
      label: "Where forcing is making life heavier",
      storyContext:
        "After hearing wisdom from the ferryman, the traveler sees that control can create strain. Naming fear and loosening the grip creates clarity.",
    },
  },
};

const STORY_COLORS = {
  narrative: { accent: "#6366f1", accentBg: "#eef2ff" },
  gita: { accent: "#f97316", accentBg: "#fff7ed" },
  tao: { accent: "#0ea5e9", accentBg: "#f0f9ff" },
  buddhism: { accent: "#8b5cf6", accentBg: "#faf5ff" },
  bible: { accent: "#d97706", accentBg: "#fffbeb" },
  rumi: { accent: "#ec4899", accentBg: "#fdf2f8" },
  inflection: { accent: "#ca8a04", accentBg: "#fef9c3" },
  reflection: { accent: "#22c55e", accentBg: "#f8fafc" },
};

const CATEGORY_META = {
  Friendship: { icon: "🤝", accentColor: "#6366f1", topic: "Connection" },
  Purpose: { icon: "🧭", accentColor: "#f97316", topic: "Direction" },
  "Inner Peace": { icon: "🕊️", accentColor: "#0ea5e9", topic: "Calm" },
  "Self-Worth": { icon: "🌱", accentColor: "#ec4899", topic: "Identity" },
  Courage: { icon: "🔥", accentColor: "#d97706", topic: "Bravery" },
  Healing: { icon: "💚", accentColor: "#8b5cf6", topic: "Recovery" },
  Clarity: { icon: "🔎", accentColor: "#22c55e", topic: "Insight" },
};

export async function generateStoryModule(userInput) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error("Missing VITE_GROQ_API_KEY");
    return null;
  }

  const prompt = buildStoryPrompt(userInput);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.72,
        max_tokens: 2600,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Story generation API error:", res.status, errBody);
      return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const parsed = parseJsonPayload(text);

    return normalizeModule(parsed, userInput);
  } catch (error) {
    console.error("Story generation failed:", error);
    return null;
  }
}

function buildStoryPrompt(userInput) {
  return `You are writing a short illustrated parable — not a self-help article, not a listicle, not a lesson plan.
The story follows ONE named protagonist through a series of encounters. Each encounter features a SECOND character (a soldier, a ferryman, a monk, a bookseller, an old woman, etc.) whose words and actions carry the wisdom of a specific tradition.

USER'S THEME / SITUATION:
"${userInput}"

NARRATIVE RULES — follow every one or rewrite:
1. Open with a concrete world and a named protagonist with a specific problem, rendered as scene not concept.
   GOOD: "There was once a cartographer named Sana who had drawn maps of every mountain range except the one visible from her own window."
   BAD: "In a world of self-doubt, one person struggled with their inner voice."
2. Each story card is a SCENE. A stranger arrives, interrupts, offers something — an object, a question, a small story-within-story. The tradition's wisdom is spoken by that stranger or embedded in their action. Never state it as moral or life-coach advice.
   GOOD: "The ferryman pointed at the river without looking up. 'Does water choose the right moment to flow?' He pushed off from the bank before she answered."
   BAD: "The Tao teaches us that by releasing our grip on outcomes we achieve a state of wu-wei, which allows…"
3. Use specific detail — a cracked cup, a sandal left behind, a note found on a door — not abstract language.
4. No self-help vocabulary. Cut these words: "journey", "growth", "healing", "process", "embrace", "navigate", "feelings", "authentic", "empower", "transform", "mindful", "intentional", "step", "path", "remind yourself".
5. Inflection prompts are addressed to "you" and ask a sharp concrete question tied to the story — not generic reflection. They connect the protagonist's moment to the reader's life without being preachy.
   GOOD: "The mapmaker knows every road but takes none. Have you ever been so prepared for something that the preparation became its own kind of hiding?"
   BAD: "Reflect on how this story relates to your own experiences with decision-making."
6. The closing card resolves the protagonist's arc with a concrete action — something they do, say, or notice — not a moral statement.

REQUIRED JSON STRUCTURE — return ONLY this, no markdown fences, no commentary:
{
  "title": "three to five words, title-case, evocative noun phrase (e.g. 'The Mapmaker's Dilemma')",
  "subtitle": "a parable about [one word] — from six traditions",
  "category": "Friendship|Purpose|Inner Peace|Self-Worth|Courage|Healing|Clarity",
  "cards": [
    { "type": "story", "tradition": null,                              "body": "SCENE — protagonist intro, specific world, concrete problem", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "narrative" },
    { "type": "story", "tradition": null,                              "body": "SCENE — protagonist's failed coping strategy, shown not told", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "narrative" },
    { "type": "inflection", "inflectionKey": "firstPause",            "prompt": "SHARP question connecting protagonist's dilemma to reader's life", "placeholder": "short invitation to write" },
    { "type": "story", "tradition": "Bhagavad Gita",                  "body": "SCENE — a stranger (soldier/elder) arrives with a Gita story embedded in dialogue, wisdom lands through the character's words or action, not narrated directly", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "gita" },
    { "type": "story", "tradition": "Tao Te Ching",                   "body": "SCENE — a different stranger with a Taoist image (water, empty vessel, uncarved wood), wisdom delivered through observation or a single question", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "tao" },
    { "type": "story", "tradition": "Buddhism",                       "body": "SCENE — a third stranger with a Buddhist parable (the raft, the mustard seed, the monk's sandal), told inside dialogue", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "buddhism" },
    { "type": "inflection", "inflectionKey": "secondPause",           "prompt": "SHARP question — two pieces of wisdom have now been heard, ask which resonates and why it lands personally", "placeholder": "short invitation to write" },
    { "type": "story", "tradition": "Hadith · Rumi",                  "body": "SCENE — protagonist acts differently because of what they heard, a concrete change in behaviour, another encounter with a different stranger, wisdom via Rumi verse or Hadith embedded in speech", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "rumi" },
    { "type": "story", "tradition": null,                             "body": "CLOSING SCENE — protagonist does one small concrete thing that resolves the arc. No summary. No moral. End on action or image.", "visual": "single emoji", "stickerQuery": "1-3 word image search", "tone": "narrative" }
  ],
  "inflectionContext": {
    "firstPause":  { "label": "3–5 word label describing what the reader just named", "storyContext": "Two sentences: what the protagonist is experiencing + which tradition wisdom will follow and why it's relevant" },
    "secondPause": { "label": "3–5 word label describing what the reader just named", "storyContext": "Two sentences: the two wisdoms heard so far + how both circle back to the protagonist's and reader's real situation" }
  }
}`;
}

function parseJsonPayload(rawText) {
  const clean = (rawText || "").replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in generated story response");
  }

  return JSON.parse(clean.slice(start, end + 1));
}

function normalizeModule(parsed, userInput) {
  if (!parsed || !Array.isArray(parsed.cards)) return buildFallbackModule(userInput);

  const category = CATEGORY_META[parsed.category] ? parsed.category : "Clarity";
  const categoryMeta = CATEGORY_META[category];
  const cards = parsed.cards
    .map((card, index) => normalizeCard(card, index + 1))
    .filter(Boolean);

  ensureUniqueInflectionKeys(cards);

  if (!cards.length) return buildFallbackModule(userInput);

  const inflectionContext = normalizeInflectionContext(parsed.inflectionContext, cards);

  return {
    id: `generated-${Date.now()}`,
    title: safeText(parsed.title, FALLBACK_MODULE.title, 80),
    subtitle: safeText(parsed.subtitle, FALLBACK_MODULE.subtitle, 100),
    category,
    topic: categoryMeta.topic,
    icon: categoryMeta.icon,
    accentColor: categoryMeta.accentColor,
    cards: [...cards, buildReflectionCard(cards.length + 1)],
    inflectionContext,
  };
}

function normalizeCard(card, id) {
  if (!card || typeof card !== "object") return null;

  if (card.type === "story") {
    const tone = STORY_COLORS[card.tone] ? card.tone : "narrative";
    const color = STORY_COLORS[tone];

    return {
      id,
      type: "story",
      tradition: card.tradition ?? null,
      body: safeText(card.body, "A new chapter unfolds.", 1400),
      visual: safeEmoji(card.visual, "📖"),
      stickerQuery: safeText(card.stickerQuery, "wisdom", 24),
      bg: "#ffffff",
      accentBg: color.accentBg,
      textColor: "#0f172a",
      accent: color.accent,
    };
  }

  if (card.type === "inflection") {
    return {
      id,
      type: "inflection",
      inflectionKey: safeKey(card.inflectionKey, `insight${id}`),
      prompt: safeText(card.prompt, "What does this moment reveal about you?", 700),
      placeholder: safeText(card.placeholder, "Write your reflection...", 120),
      visual: "✍️",
      bg: "#fefce8",
      accentBg: STORY_COLORS.inflection.accentBg,
      textColor: "#0f172a",
      accent: STORY_COLORS.inflection.accent,
    };
  }

  return null;
}

function normalizeInflectionContext(rawContext, cards) {
  const inflectionCards = cards.filter((card) => card.type === "inflection");
  if (!inflectionCards.length) {
    return FALLBACK_MODULE.inflectionContext;
  }

  const context = {};

  for (const card of inflectionCards) {
    const candidate = rawContext?.[card.inflectionKey];
    context[card.inflectionKey] = {
      label: safeText(candidate?.label, "Your response", 80),
      storyContext: safeText(
        candidate?.storyContext,
        "You are responding to a turning point in the story and naming what it means in your own life.",
        600
      ),
    };
  }

  return context;
}

function buildReflectionCard(id) {
  return {
    id,
    type: "reflection",
    visual: "🪞",
    bg: "#ffffff",
    accentBg: STORY_COLORS.reflection.accentBg,
    textColor: "#0f172a",
    accent: STORY_COLORS.reflection.accent,
  };
}

function buildFallbackModule(userInput) {
  return {
    ...FALLBACK_MODULE,
    id: `generated-fallback-${Date.now()}`,
    title: userInput?.trim()
      ? `A Parable on ${safeText(userInput.trim(), "Your Theme", 40)}`
      : FALLBACK_MODULE.title,
  };
}

function safeText(value, fallback, maxLen) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, maxLen);
}

function safeKey(value, fallback) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned || fallback;
}

function safeEmoji(value, fallback) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned || fallback;
}

function ensureUniqueInflectionKeys(cards) {
  const seen = new Set();

  for (const card of cards) {
    if (card.type !== "inflection") continue;

    let key = card.inflectionKey;
    let suffix = 2;

    while (seen.has(key)) {
      key = `${card.inflectionKey}${suffix}`;
      suffix += 1;
    }

    card.inflectionKey = key;
    seen.add(key);
  }
}