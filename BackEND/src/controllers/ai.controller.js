const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Small helper to call the Gemini API and pull out the plain text reply.
async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is not set on the server");
    err.status = 500;
    throw err;
  }

  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Gemini API error:", response.status, errBody);
    const err = new Error("AI request failed");
    err.status = 502;
    throw err;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    const err = new Error("AI returned an empty response");
    err.status = 502;
    throw err;
  }

  return text;
}

// POST /api/ai/fix-spelling
export async function fixSpelling(req, res) {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt =
      "You are a proofreading assistant. Fix only spelling and grammar " +
      "mistakes in the following note. Do not change the meaning, tone, " +
      "or structure, and do not add new content. Return ONLY the " +
      "corrected text, with no preamble, no quotes, and no explanation.\n\n" +
      `Text:\n${text}`;

    const corrected = await callGemini(prompt);
    res.status(200).json({ corrected });
  } catch (error) {
    console.error("Error in fixSpelling controller", error);
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
}

// POST /api/ai/summarize
export async function summarizeNote(req, res) {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt =
      "Summarize the following note in 1-2 concise sentences. Return " +
      "ONLY the summary, with no preamble.\n\n" +
      `Note:\n${text}`;

    const summary = await callGemini(prompt);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in summarizeNote controller", error);
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
}

// POST /api/ai/generate-title
export async function generateTitle(req, res) {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const prompt =
      "Generate a short, descriptive title (max 6 words) for the " +
      "following note. Return ONLY the title, with no quotes and no " +
      "preamble.\n\n" +
      `Note:\n${content}`;

    const title = await callGemini(prompt);
    res.status(200).json({ title });
  } catch (error) {
    console.error("Error in generateTitle controller", error);
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
}
