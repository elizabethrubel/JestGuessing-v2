import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { VERIFIED_CATEGORIES, VerifiedCharacter } from "./src/data/verifiedCharacterSets";
import commonalitiesJson from "./public/assets/aistudio/Commonalities_6c05b138.json";
import topCharactersJson from "./public/assets/aistudio/TopCharacters_b19eb45c.json";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Load Commonalities and Known Characters from JSON assets
interface CommTrait {
  id: number;
  trait: string;
}

interface KnownCharacter {
  id: number;
  name: string;
  origin: string;
}

let commonalitiesList: CommTrait[] = Array.isArray(commonalitiesJson) ? (commonalitiesJson as CommTrait[]) : [];
let topCharactersList: KnownCharacter[] = Array.isArray(topCharactersJson) ? (topCharactersJson as KnownCharacter[]) : [];

if (commonalitiesList.length === 0) {
  try {
    const commPath = path.resolve(process.cwd(), "public/assets/aistudio/Commonalities_6c05b138.json");
    if (fs.existsSync(commPath)) {
      commonalitiesList = JSON.parse(fs.readFileSync(commPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load Commonalities JSON:", err);
  }
}

if (topCharactersList.length === 0) {
  try {
    const topCharsPath = path.resolve(process.cwd(), "public/assets/aistudio/TopCharacters_b19eb45c.json");
    if (fs.existsSync(topCharsPath)) {
      topCharactersList = JSON.parse(fs.readFileSync(topCharsPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load TopCharacters JSON:", err);
  }
}

// Fallback in case file read fails
if (commonalitiesList.length === 0) {
  commonalitiesList = [
    { id: 1, trait: "Both characters have artificial, robotic, or cybernetic limbs." },
    { id: 2, trait: "Both characters are known for an iconic scar, eyepatch, or facial marking." },
    { id: 4, trait: "Both characters conceal their true face behind a mask, helmet, or heavy disguise." },
    { id: 12, trait: "Both characters are fathers." },
    { id: 24, trait: "Both characters wield a legendary, named weapon." },
    { id: 29, trait: "Both characters possess the ability to travel through time." },
    { id: 35, trait: "Both characters are morally grey antiheroes." },
    { id: 52, trait: "Both characters work as cynical private investigators, detectives, or bounty hunters." },
    { id: 71, trait: "Both characters are completely bald or lack any head hair by design." },
  ];
}

// Format the trait string into a round theme title
function formatThemeName(trait: string): string {
  let name = trait.trim();
  if (/^Both characters\b/i.test(name)) {
    name = name.replace(/^Both characters\b/i, "All characters");
  } else if (!/^All characters\b/i.test(name)) {
    name = `All characters ${name.charAt(0).toLowerCase() + name.slice(1)}`;
  }
  return name.replace(/\.$/, '');
}

// Find verified category by keywords or trait matching (using whole-word boundaries to avoid false positives like "hat" inside "that")
function findVerifiedCategoryForTrait(trait: string) {
  const lower = trait.toLowerCase();
  for (const cat of VERIFIED_CATEGORIES) {
    if (cat.keywords.some(k => {
      const escaped = k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(lower);
    })) {
      return cat;
    }
    if (cat.trait.toLowerCase() === lower || cat.name.toLowerCase() === lower) {
      return cat;
    }
  }
  return null;
}

// Concurrency queue to serialize Gemini API calls and prevent concurrent burst spikes
let geminiCallQueue = Promise.resolve();
function runGeminiQueued<T>(task: () => Promise<T>): Promise<T> {
  const next = geminiCallQueue.then(task, task);
  geminiCallQueue = next.then(() => {}, () => {});
  return next;
}

// Resilient Gemini generator with exponential backoff on 503 / 429
async function callGeminiSafe(
  ai: GoogleGenAI,
  prompt: string,
  config: any = { responseMimeType: "application/json" }
): Promise<string | null> {
  return runGeminiQueued(async () => {
    const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
          });
          const text = response.text?.trim();
          if (text) return text;
        } catch (err: any) {
          const msg = String(err?.message || "");
          const isTemporary =
            err?.status === 503 ||
            err?.status === 429 ||
            msg.includes("503") ||
            msg.includes("high demand") ||
            msg.includes("RESOURCE_EXHAUSTED");

          if (isTemporary && attempt === 0) {
            // Wait with exponential backoff before retrying
            await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
            continue;
          }
          // Move to next fallback model quietly
          break;
        }
      }
    }
    return null;
  });
}

// In-memory cache of generated round themes to save tokens and achieve 0ms repeat latency
const themeCache = new Map<string, any>();

// Core generator for round theme based on random commonality + verified ground-truth + AI
async function generateRoundTheme(
  playerCount: number = 4, 
  excludeIds: number[] = [],
  specificCommonalityId?: number,
  specificTrait?: string
): Promise<any> {
  let selectedCommonality: CommTrait;

  if (specificCommonalityId) {
    const found = commonalitiesList.find(c => c.id === specificCommonalityId);
    selectedCommonality = found || { id: specificCommonalityId, trait: specificTrait || "Both characters wear iconic accessories." };
  } else if (specificTrait) {
    const found = commonalitiesList.find(c => c.trait.toLowerCase() === specificTrait.toLowerCase());
    selectedCommonality = found || { id: Date.now() % 10000, trait: specificTrait };
  } else {
    // Pick candidate commonality prioritizing verified ones
    const candidatePool = commonalitiesList.filter(c => !excludeIds.includes(c.id));
    const pool = candidatePool.length > 0 ? candidatePool : commonalitiesList;
    selectedCommonality = pool[Math.floor(Math.random() * pool.length)];
  }

  // Check in-memory cache first for instant 0ms retrieval with 0 token consumption!
  const cacheKey = `comm-${selectedCommonality.id || selectedCommonality.trait}`;
  if (themeCache.has(cacheKey)) {
    const cached = themeCache.get(cacheKey);
    // Shuffle the characters so players get fresh assignments even if commonality repeats
    const shuffledChars = [...cached.characters].sort(() => Math.random() - 0.5);
    return {
      ...cached,
      id: `commonality-${selectedCommonality.id}-${Date.now()}`,
      characters: shuffledChars,
    };
  }

  // Check if trait matches a verified ground truth category
  const verifiedCat = findVerifiedCategoryForTrait(selectedCommonality.trait);
  const themeName = formatThemeName(selectedCommonality.trait);

  // If verified ground-truth exists with plenty of characters, we have a guaranteed accurate deck!
  if (verifiedCat && verifiedCat.characters.length >= Math.max(playerCount * 2, 8)) {
    const verifiedChars = verifiedCat.characters.map((c) => ({
      name: c.name,
      origin: c.origin,
      wikiSlug: c.wikiSlug,
      hint: c.hint,
      imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`,
    }));

    const resultTheme = {
      id: `commonality-${selectedCommonality.id}-${Date.now()}`,
      commonalityId: selectedCommonality.id,
      name: themeName,
      characters: verifiedChars,
    };

    themeCache.set(cacheKey, resultTheme);
    return resultTheme;
  }

  // Otherwise, use AI with our safe retry & queue to generate or enrich the deck
  const ai = getAI();
  if (ai) {
    const targetCount = 12;
    const verifiedExamples = verifiedCat 
      ? `Verified Canonical Matches for reference: ${verifiedCat.characters.slice(0, 6).map(c => c.name).join(", ")}`
      : "";

    const prompt = `You are a strict trivia and pop culture verifier for the party game "Jest Guessing".
Round Commonality Trait: "${selectedCommonality.trait}"
Theme Title: "${themeName}"

CRITICAL ACCURACY REQUIREMENT:
Every single character MUST strictly, canonically, and undeniably possess this exact commonality trait: "${selectedCommonality.trait}".
Do NOT include characters who do not possess this trait (e.g. if the trait is wearing glasses/spectacles/goggles, characters like Mushu, Kramer, Batman, or Mario do NOT wear glasses and must NEVER be included).
${verifiedExamples}

INSTRUCTIONS:
1. Provide ${targetCount} famous, widely recognizable characters from movies, TV, literature, gaming, animation, or history who strictly possess this trait.
2. For each character, provide "traitVerification": concise 1-sentence confirmation of how they satisfy the trait (max 10 words).
3. Provide recognized "name", "origin" (where they are from), and exact English Wikipedia "wikiSlug".

Return ONLY a JSON object:
{
  "name": "${themeName}",
  "characters": [
    {
      "name": "Full Character Name",
      "origin": "Franchise or Universe",
      "wikiSlug": "Wikipedia_Article_Slug",
      "hint": "Subtle clue (max 10 words)",
      "traitVerification": "Concisely how they satisfy the trait"
    }
  ]
}`;

    const text = await callGeminiSafe(ai, prompt);
    if (text) {
      try {
        const cleaned = text.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.characters && Array.isArray(parsed.characters) && parsed.characters.length >= 4) {
          const seenNames = new Set<string>();
          const mergedChars: any[] = [];

          if (verifiedCat) {
            for (const c of verifiedCat.characters) {
              seenNames.add(c.name.toLowerCase());
              mergedChars.push({
                name: c.name,
                origin: c.origin,
                wikiSlug: c.wikiSlug,
                hint: c.hint,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`,
              });
            }
          }

          for (const c of parsed.characters) {
            const lower = (c.name || '').toLowerCase();
            if (lower && !seenNames.has(lower)) {
              seenNames.add(lower);
              mergedChars.push({
                name: c.name,
                origin: c.origin || "Pop Culture",
                wikiSlug: c.wikiSlug || c.name.replace(/\s+/g, "_"),
                hint: c.hint || `Matches ${themeName}`,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug || c.name)}?width=400`,
              });
            }
          }

          const resultTheme = {
            id: `commonality-${selectedCommonality.id}-${Date.now()}`,
            commonalityId: selectedCommonality.id,
            name: themeName,
            characters: mergedChars,
          };

          themeCache.set(cacheKey, resultTheme);
          return resultTheme;
        }
      } catch {
        // Fall through to fallback
      }
    }
  }

  // Graceful fallback: return verified category characters
  let fallbackCat = verifiedCat;
  if (!fallbackCat) {
    fallbackCat = VERIFIED_CATEGORIES[Math.floor(Math.random() * VERIFIED_CATEGORIES.length)];
  }

  const fallbackChars = fallbackCat.characters.map((c) => ({
    name: c.name,
    origin: c.origin,
    wikiSlug: c.wikiSlug,
    hint: c.hint,
    imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`,
  }));

  const fallbackResult = {
    id: `commonality-${selectedCommonality.id}-${Date.now()}`,
    commonalityId: selectedCommonality.id,
    name: themeName,
    characters: fallbackChars,
  };

  themeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

// API: Generate round theme from random commonality + verified ground-truth + AI
app.post("/api/round-theme", async (req, res) => {
  try {
    const { 
      players = [], 
      excludeCommonalityIds = [], 
      specificCommonalityId, 
      specificTrait 
    } = req.body || {};
    const count = Array.isArray(players) && players.length > 0 ? players.length : 4;
    const theme = await generateRoundTheme(count, excludeCommonalityIds, specificCommonalityId, specificTrait);
    res.json(theme);
  } catch (err) {
    console.error("Error in /api/round-theme:", err);
    res.status(500).json({ error: "Failed to generate round theme" });
  }
});

// API: Get 3 candidate commonalities for instant user selection (0 tokens, 0ms)
app.get("/api/candidate-commonalities", (req, res) => {
  try {
    const excludeIds: number[] = req.query.exclude ? String(req.query.exclude).split(',').map(Number) : [];

    // Prioritize commonalities that have verified ground truth
    const verifiedIds: number[] = [];
    commonalitiesList.forEach((c) => {
      if (findVerifiedCategoryForTrait(c.trait)) {
        verifiedIds.push(c.id);
      }
    });

    const unplayedVerified = commonalitiesList.filter(
      (c) => verifiedIds.includes(c.id) && !excludeIds.includes(c.id)
    );

    const pool = unplayedVerified.length >= 3 ? unplayedVerified : commonalitiesList.filter((c) => !excludeIds.includes(c.id));
    const source = pool.length >= 3 ? pool : commonalitiesList;
    
    // Pick 3 random distinct commonalities
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    const candidates = shuffled.slice(0, 3).map(c => ({
      id: c.id,
      trait: c.trait,
      formattedName: formatThemeName(c.trait),
    }));

    res.json({ candidates });
  } catch (err) {
    console.error("Error in /api/candidate-commonalities:", err);
    res.status(500).json({ error: "Failed to fetch candidate commonalities" });
  }
});

// API: Dedicated endpoint to get a single fresh, never-before-seen character matching a trait
app.post("/api/reroll-character", async (req, res) => {
  try {
    const { trait = "", excludeSlugs = [], excludeNames = [] } = req.body || {};
    const excludeSet = new Set<string>([
      ...excludeSlugs.map((s: string) => String(s).toLowerCase()),
      ...excludeNames.map((n: string) => String(n).toLowerCase()),
    ]);

    // Check verified categories first
    const cat = findVerifiedCategoryForTrait(trait);
    if (cat) {
      const candidates = cat.characters.filter(
        c => !excludeSet.has(c.wikiSlug.toLowerCase()) && !excludeSet.has(c.name.toLowerCase())
      );
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        return res.json({
          character: {
            ...pick,
            imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(pick.wikiSlug)}?width=400`,
          },
        });
      }
    }

    // Try Gemini AI for a guaranteed fresh character
    const ai = getAI();
    if (ai) {
      const prompt = `You are a strict trivia judge for "Jest Guessing".
Commonality Trait: "${trait}"

CRITICAL: Provide ONE recognizable pop culture character who CANONICALLY and UNDENIABLY possesses this exact trait: "${trait}".
EXCLUSION LIST - DO NOT RETURN ANY OF THESE CHARACTERS:
${Array.from(excludeSet).slice(0, 50).join(", ")}

Return ONLY a JSON object:
{
  "name": "Full Character Name",
  "origin": "Franchise or Origin",
  "wikiSlug": "Wikipedia_Slug",
  "hint": "Subtle clue (max 10 words)",
  "traitVerification": "Factual explanation of how they satisfy the trait"
}`;

      const text = await callGeminiSafe(ai, prompt);
      if (text) {
        try {
          const cleaned = text.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.name && !excludeSet.has(parsed.name.toLowerCase())) {
            return res.json({
              character: {
                name: parsed.name,
                origin: parsed.origin || "Pop Culture",
                wikiSlug: parsed.wikiSlug || parsed.name.replace(/\s+/g, "_"),
                hint: parsed.hint || `Matches ${trait}`,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(parsed.wikiSlug || parsed.name)}?width=400`,
              },
            });
          }
        } catch {
          // Fall through
        }
      }
    }

    // Graceful fallback from known characters
    const fallbackCand = topCharactersList.find(
      (c) => !excludeSet.has(c.name.toLowerCase())
    );
    if (fallbackCand) {
      return res.json({
        character: {
          name: fallbackCand.name,
          origin: fallbackCand.origin,
          wikiSlug: fallbackCand.name.replace(/\s+/g, "_"),
          hint: `Famous figure from ${fallbackCand.origin}`,
          imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(fallbackCand.name.replace(/\s+/g, "_"))}?width=400`,
        },
      });
    }

    res.status(404).json({ error: "No more unique characters found for this trait" });
  } catch (err) {
    console.error("Error in /api/reroll-character:", err);
    res.status(500).json({ error: "Failed to reroll character" });
  }
});

// API: Quick fresh theme (for shuffle or immediate fetch)
app.get("/api/fresh-themes", async (_req, res) => {
  try {
    const theme = await generateRoundTheme(4);
    res.json([theme]);
  } catch (err) {
    console.error("Error in /api/fresh-themes:", err);
    res.status(500).json({ error: "Failed to generate theme" });
  }
});

// API: Get all commonalities list (reference)
app.get("/api/commonalities", (_req, res) => {
  res.json(commonalitiesList);
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    commonalitiesCount: commonalitiesList.length,
    knownCharactersCount: topCharactersList.length,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

