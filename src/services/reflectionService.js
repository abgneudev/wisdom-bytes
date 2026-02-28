/**
 * Calls the Groq API to generate personalised reflections
 * against the learner's inflection responses for any module.
 *
 * NOTE: The API key must be set in the `VITE_GROQ_API_KEY`
 * environment variable (add it to a local `.env` file).
 *
 * @param {Record<string, string>} responses — keyed by inflectionKey
 * @param {Record<string, { label: string, storyContext: string }>} context — from the active module
 * @param {{ title: string, subtitle: string }} [moduleMeta] — active module metadata
 * @returns {Promise<Record<string, string> | null>}
 */
export async function generateReflections(responses, context, moduleMeta = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error("Missing VITE_GROQ_API_KEY");
    return null;
  }

  const contextKeys = Object.keys(context);
  const prompt = buildPrompt(responses, context, moduleMeta);

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const maxTokens = attempt === 0 ? 900 : 1400;
      const temperature = attempt === 0 ? 0.5 : 0.35;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: maxTokens,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Groq API error:", res.status, errBody);
        return null;
      }

      const data = await res.json();
      const choice = data.choices?.[0] ?? {};
      const text = choice.message?.content ?? "";
      const finishReason = choice.finish_reason ?? "";

      let parsed;
      try {
        parsed = parseReflectionPayload(text);
      } catch (parseErr) {
        if (attempt === 0 && finishReason === "length") continue;
        throw parseErr;
      }

      return normalizeReflections(parsed, contextKeys, responses, context);
    }

    return null;
  } catch (err) {
    console.error("Reflection generation failed:", err);
    return null;
  }
}

/**
 * Builds the prompt string for Gemini — kept intentionally short to stay within free-tier token limits.
 * @param {Record<string, string>} responses
 * @param {Record<string, { label: string, storyContext: string }>} context
 * @param {{ title: string, subtitle: string }} moduleMeta
 */
function buildPrompt(responses, context, moduleMeta) {
  const storyTitle = moduleMeta?.title || "a parable";
  const keys = Object.keys(context);

  const inflectionBlocks = keys
    .map((key, i) => {
      const ctx = context[key];
      return `Q${i + 1} (${ctx.label}): "${responses[key] || "(skipped)"}"`;
    })
    .join("\n");

  const jsonShape = keys
    .map((key) => `"${key}": "2-3 sentence reflection"`)
    .join(", ");

  return `You are a warm teacher. A student read "${storyTitle}" and answered these questions:

${inflectionBlocks}

Write a brief, personal 2-3 sentence reflection for each answer — mirror their words back, connect to wisdom traditions, use "you". Be a thoughtful friend, not a lecturer.
Each value must be complete prose and end with normal sentence punctuation.

Reply ONLY with this JSON (no markdown):
{${jsonShape}}`;
}

function parseReflectionPayload(rawText) {
  const clean = (rawText || "").replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in reflection response");
  }

  const jsonChunk = clean.slice(start, end + 1);
  return JSON.parse(jsonChunk);
}

function normalizeReflections(parsed, contextKeys, responses, context) {
  const normalized = {};

  for (const key of contextKeys) {
    const raw = typeof parsed?.[key] === "string" ? parsed[key].trim() : "";
    if (!raw || looksIncomplete(raw)) {
      normalized[key] = buildFallbackReflection(responses[key], context[key]);
      continue;
    }

    const squashed = raw.replace(/\s+/g, " ").trim();
    normalized[key] = /[.!?\)\]"'”’]$/.test(squashed) ? squashed : `${squashed}.`;
  }

  return normalized;
}

function looksIncomplete(text) {
  const squashed = text.replace(/\s+/g, " ").trim();
  if (!squashed) return true;

  const hasTerminalPunctuation = /[.!?\)\]"'”’]$/.test(squashed);
  if (!hasTerminalPunctuation) return true;

  const words = squashed.toLowerCase().split(/\s+/);
  const lastWord = (words[words.length - 1] || "").replace(/[^a-z]/g, "");
  const danglingWords = new Set([
    "to",
    "and",
    "or",
    "but",
    "of",
    "for",
    "with",
    "from",
    "in",
    "on",
    "at",
    "by",
    "about",
    "because",
    "that",
    "which",
    "if",
    "when",
    "while",
    "as",
    "than",
    "a",
    "an",
    "the",
  ]);

  return danglingWords.has(lastWord);
}

function buildFallbackReflection(response, contextItem) {
  const label = contextItem?.label?.toLowerCase() || "this moment";
  const trimmed = (response || "").trim();

  if (!trimmed) {
    return `You paused at ${label}, and that pause still tells a story. Notice what feeling appears when you return to this moment, and name it gently without judging yourself.`;
  }

  const excerpt = trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
  return `You named "${excerpt}," and that shows honest self-awareness. Across wisdom traditions, growth begins by seeing the pattern clearly, then loosening your grip just enough to choose your next step with intention.`;
}
