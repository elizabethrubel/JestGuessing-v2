const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldGet = code.substring(code.indexOf('app.get("/api/fresh-themes"'), code.indexOf('// Fallback if AI unavailable'));

const newGet = `app.get("/api/fresh-themes", async (_req, res) => {
  const ai = getAI();
  if (ai) {
    try {
      const prompt = \`You are a creative party game designer for a "Who Am I?" character guessing game.
Generate 1 fresh, distinct, and creative theme pack.

Use this as inspiration for the types of very specific connections you should make (come up with new ones or use these):
- All characters have a missing limb or prosthetic
- All characters wear an iconic mask
- All characters are completely bald
- All characters are missing an eye or wear an eyepatch
- All characters have horns
- All characters are cyborgs or part-machine
- All characters are mentors who died
- All characters are royalty
- All characters are bounty hunters or mercenaries
- All characters are artificial creations or clones
- All characters fight using a scythe
- All characters wield fire
- All characters transform into a beast or monster
- All characters use cards or gambling as a combat style
- All characters dual-wield blades
- All characters share the same voice actor
- All characters debuted in the exact same year
- All characters became more popular than the protagonist
- All characters are guest fighters in a crossover game
- All characters share the exact same first name

Return a JSON array of 1 theme object matching this schema:
[
  {
    "name": "All characters [insert commonality]",
    "characters": [
      {
        "name": "Full recognized name",
        "wikiSlug": "Exact Wikipedia title slug for image fetching",
        "hint": "One subtle clue (max 10 words)"
      }
    ]
  }
]

Provide 8 to 10 recognizable characters for the theme. Return ONLY valid raw JSON.\`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const cleaned = responseText.replace(/^\\\`\\\`\\\`json\\s*/i, "").replace(/\\\`\\\`\\\`$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length >= 1) {
          const formatted = parsed.slice(0, 1).map((t, idx) => ({
            id: \`ai-theme-\${Date.now()}-\${idx}\`,
            name: t.name,
            characters: (t.characters || []).map((c) => ({
              name: c.name,
              wikiSlug: c.wikiSlug || c.name.replace(/\\s+/g, "_"),
              hint: c.hint || "Recognizable figure in this theme",
              imageUrl: \`https://en.wikipedia.org/wiki/Special:FilePath/\${encodeURIComponent(c.wikiSlug || c.name)}?width=400\`,
            })),
          }));
          res.json(formatted);
          return;
        }
      }
    } catch (err) {
      console.warn("Error generating fresh themes via AI, using fallback:", err);
    }
  }
  `;

code = code.replace(oldGet, newGet);
fs.writeFileSync('server.ts', code);
