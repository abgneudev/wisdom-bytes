/**
 * Calls the Anthropic API to generate personalised reflections
 * against the learner's inflection responses for any module.
 *
 * NOTE: The API key must be set in the `VITE_ANTHROPIC_API_KEY`
 * environment variable (add it to a local `.env` file).
 *
 * @param {Record<string, string>} responses — keyed by inflectionKey
 * @param {Record<string, { label: string, storyContext: string }>} context — from the active module
 * @param {{ title: string, subtitle: string }} [moduleMeta] — active module metadata
 * @returns {Promise<Record<string, string> | null>}
 */
export async function generateReflections(responses, context, moduleMeta = {}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const prompt = buildPrompt(responses, context, moduleMeta);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("");

    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Reflection generation failed:", err);
    return null;
  }
}

/**
 * Builds the prompt string sent to Claude — works for any module.
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
      return `INFLECTION ${i + 1} — "${ctx.label}"
Context: ${ctx.storyContext}
Student wrote: "${responses[key] || "(skipped)"}"`;
    })
    .join("\n\n");

  const jsonShape = keys
    .map((key) => `"${key}": "your reflection on their response"`)
    .join(", ");

  return `You are a wise, warm teacher reflecting on a student's responses to "${storyTitle}" — a parable drawing on multiple wisdom traditions (Bhagavad Gita, Tao Te Ching, Buddhism, Bible, Quran, Rumi, Stoicism).

At key inflection points in the story, the student paused and shared their thoughts. Your job is to reflect their answers back to them — not lecture, but mirror. Be specific about THEIR words.

For each response:
- If their thinking aligns with the wisdom: affirm it specifically and deepen it by connecting to the tradition.
- If there's a gap: gently show what both paths might look like. Let them see the difference themselves.
- If they're partially right: acknowledge what they got, then show the missing piece.

Be concise (3-4 sentences per reflection). Write like a thoughtful friend, not a professor. Use "you" directly.

${inflectionBlocks}

Respond ONLY with a JSON object — no markdown, no backticks, no preamble:
{${jsonShape}}`;
}
