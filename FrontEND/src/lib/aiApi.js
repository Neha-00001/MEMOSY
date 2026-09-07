import api from "./axios";

export const fixSpelling = async (text) => {
  const res = await api.post("/ai/fix-spelling", { text });
  return res.data.corrected;
};

export const summarizeNote = async (text) => {
  const res = await api.post("/ai/summarize", { text });
  return res.data.summary;
};

export const generateTitle = async (content) => {
  const res = await api.post("/ai/generate-title", { content });
  return res.data.title;
};
