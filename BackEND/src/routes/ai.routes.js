import express from "express";
import {
  fixSpelling,
  summarizeNote,
  generateTitle,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/fix-spelling", fixSpelling);
router.post("/summarize", summarizeNote);
router.post("/generate-title", generateTitle);

export default router;
