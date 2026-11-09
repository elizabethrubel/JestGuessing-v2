const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `  "characters": [
    {
      "name": "Full recognizable character or person name",
      "wikiSlug": "Exact Wikipedia article slug for thumbnail fetching",
      "hint": "One subtle, fun yes/no clue if the guesser is stuck (max 10 words)"
    }
  ]
} catch (err) {`;

const replacement = `  "characters": [
    {
      "name": "Full recognizable character or person name",
      "wikiSlug": "Exact Wikipedia article slug for thumbnail fetching",
      "hint": "One subtle, fun yes/no clue if the guesser is stuck (max 10 words)"
    }
  ]
}

Ensure you provide between 8 and 10 widely recognizable real or fictional characters.
Return ONLY raw JSON, no markdown code fence blocks.\`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const cleaned = responseText.replace(/^\\\`\\\`\\\`json\\s*/i, "").replace(/\\\`\\\`\\\`$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        const charactersWithImages = (parsed.characters || []).map((c: any) => ({
          ...c,
          imageUrl: \`https://en.wikipedia.org/wiki/Special:FilePath/\${encodeURIComponent(c.wikiSlug || c.name)}?width=400\`,
        }));

        res.json({
          id: \`custom-\${Date.now()}\`,
          name: parsed.name || \`All characters are related to \${cleanTheme}\`,
          characters: charactersWithImages,
        });
        return;
      }
    } catch (err) {`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
