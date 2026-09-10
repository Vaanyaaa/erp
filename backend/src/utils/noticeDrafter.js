/**
 * Turns a one-line prompt into a publish-ready notice.
 *
 * Runs entirely offline with a deterministic template so the feature works
 * with no API key. If ANTHROPIC_API_KEY is present the same function calls
 * Claude instead and falls back to the template on any failure — so the
 * endpoint never breaks the demo.
 */

const CATEGORY_HINTS = [
  { match: /(placement|drive|company|interview|recruit|shortlist|offer|ppo)/i, category: "tp_cell" },
  { match: /(exam|test|paper|viva|practical|result)/i, category: "exam" },
  { match: /(fee|payment|due|installment|scholarship)/i, category: "fees" },
  { match: /(emergency|urgent|closed|evacuat|alert)/i, category: "emergency" },
];

function inferCategory(prompt) {
  const hit = CATEGORY_HINTS.find((h) => h.match.test(prompt));
  return hit ? hit.category : "general";
}

function toTitle(prompt) {
  const cleaned = prompt.replace(/\s+/g, " ").trim().replace(/[.]+$/, "");
  const short = cleaned.length > 70 ? `${cleaned.slice(0, 67)}…` : cleaned;
  return short.charAt(0).toUpperCase() + short.slice(1);
}

function templateDraft(prompt, category, authorName) {
  const resolved = category || inferCategory(prompt);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const opening = {
    tp_cell: "The Training and Placement Cell would like to inform all students that",
    exam: "The Examination Committee would like to inform all students that",
    fees: "The Accounts Office would like to inform all students and parents that",
    emergency: "This is an urgent notice for all students and staff:",
    general: "This is to inform all students that",
  }[resolved];

  const closing = {
    tp_cell:
      "Students are advised to check the placement calendar for exact timings and to keep their documents ready.",
    exam:
      "Students are advised to check the examination schedule and report on time with a valid ID card.",
    fees:
      "Payments made after the due date may attract a late fee. Please keep the receipt for your records.",
    emergency: "Please follow the instructions of the staff on duty.",
    general: "Students are advised to take note and plan accordingly.",
  }[resolved];

  const body = [
    `${opening} ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`.replace(/([^.!?])$/, "$1."),
    "",
    closing,
    "",
    `Issued on ${today}${authorName ? ` by ${authorName}` : ""}.`,
  ].join("\n");

  return { title: toTitle(prompt), body, category: resolved, source: "template" };
}

async function draftNotice(prompt, category, authorName) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return templateDraft(prompt, category, authorName);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 700,
        messages: [
          {
            role: "user",
            content:
              "Write a formal college notice from this one-line brief. Reply with JSON only, " +
              'shaped {"title": string, "body": string}. No markdown fences.\n\nBrief: ' +
              prompt,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Claude API ${response.status}`);
    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(text);
    return {
      title: parsed.title,
      body: parsed.body,
      category: category || inferCategory(prompt),
      source: "claude",
    };
  } catch (err) {
    console.warn("Notice drafting fell back to template:", err.message);
    return templateDraft(prompt, category, authorName);
  }
}

module.exports = { draftNotice, templateDraft, inferCategory };
