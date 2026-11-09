const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Remove emoji and clue from FALLBACK_SEEDS
code = code.replace(/name: "Master Sleuths",\s*emoji: "🔍",\s*clue: "Famous for solving mysteries, crimes, or intricate puzzles.",/g, 'name: "All characters are famous for solving mysteries, crimes, or intricate puzzles.",');
code = code.replace(/name: "Cosmic Voyagers",\s*emoji: "🚀",\s*clue: "Travels through outer space, galaxies, or starships.",/g, 'name: "All characters travel through outer space, galaxies, or starships.",');
code = code.replace(/name: "Time Shifters",\s*emoji: "⏳",\s*clue: "Traveled across centuries, time loops, or historical eras.",/g, 'name: "All characters traveled across centuries, time loops, or historical eras.",');

// Remove clue, emoji from Theme
code = code.replace(/theme: \{\s*name: string;\s*clue: string;\s*emoji: string;\s*\};/g, 'theme: {\n    name: string;\n  };');

// Update fresh-themes prompt
code = code.replace(/\[\s*\{\s*"name": "Short theme title.*?\}\s*\]/s, `[
  {
    "name": "All characters [insert commonality] (e.g. All characters wear masks, All characters are chefs)",
    "characters": [
      {
        "name": "Full recognized name",
        "wikiSlug": "Exact Wikipedia title slug for image fetching",
        "hint": "One subtle clue (max 10 words)"
      }
    ]
  }
]`);

// Fix fresh-themes mapping
code = code.replace(/name: t.name,\s*clue: t.clue,\s*emoji: t.emoji \|\| "✨",\s*description: t.description \|\| `AI-generated fresh pack: \$\{t.name\}`,/g, 'name: t.name,');
code = code.replace(/name: s.name,\s*clue: s.clue,\s*emoji: s.emoji,\s*description: `A curated pack featuring \$\{s.name\}.`,/g, 'name: s.name,');

// Update custom-theme prompt
code = code.replace(/\{\s*"name": "Short theme title.*?\}\s*\}/s, `{
  "name": "All characters [insert commonality] (e.g. All characters are from the 90s)",
  "characters": [
    {
      "name": "Full recognizable character or person name",
      "wikiSlug": "Exact Wikipedia article slug for thumbnail fetching",
      "hint": "One subtle, fun yes/no clue if the guesser is stuck (max 10 words)"
    }
  ]
}`);

code = code.replace(/name: parsed.name \|\| cleanTheme,\s*clue: parsed.clue \|\| `Iconic figures from \$\{cleanTheme\}`,\s*emoji: parsed.emoji \|\| "✨",\s*description: `Custom party pack created for \$\{cleanTheme\}`,/g, 'name: parsed.name || `All characters are related to ${cleanTheme}`,');

// Fix fallback in custom theme
code = code.replace(/name: cleanTheme,\s*clue: `Famous figures and characters related to \$\{cleanTheme\}`,\s*emoji: "🎭",\s*description: `A custom theme featuring characters from \$\{cleanTheme\}.`,/g, 'name: `All characters are related to ${cleanTheme}`,');

// Singleplayer themeInfo fallback
code = code.replace(/name: "General Mystery",\s*clue: "Can be anyone famous, real or fictional.",\s*emoji: "❓",/g, 'name: "All characters can be anyone famous, real or fictional.",');

// Singleplayer AI prompt
code = code.replace(/"themeName": "Short theme category \(2-3 words\)",\s*"themeClue": "Short category clue \(max 10 words\)",\s*"themeEmoji": "Single emoji icon"/g, '"themeName": "All characters [insert commonality]"');

// Singleplayer AI parsing
code = code.replace(/name: parsed.themeName \|\| "World Icons",\s*clue: parsed.themeClue \|\| "Widely recognized figure in human culture",\s*emoji: parsed.themeEmoji \|\| "🌟",/g, 'name: parsed.themeName || "All characters are world icons",');

// Singleplayer fallbackList
code = code.replace(/theme: \{ name: "Science Pioneers", clue: "Revolutionized our understanding of nature", emoji: "🔬" \}/g, 'theme: { name: "All characters revolutionized our understanding of nature" }');
code = code.replace(/theme: \{ name: "Master Sleuths", clue: "Solves impossible mysteries", emoji: "🔍" \}/g, 'theme: { name: "All characters solve impossible mysteries" }');
code = code.replace(/theme: \{ name: "Ancient Rulers", clue: "Ruled kingdoms in the ancient world", emoji: "👑" \}/g, 'theme: { name: "All characters ruled kingdoms in the ancient world" }');
code = code.replace(/theme: \{ name: "Masked Heroes", clue: "Fights crime behind a mask", emoji: "🕷️" \}/g, 'theme: { name: "All characters fight crime behind a mask" }');
code = code.replace(/theme: \{ name: "Renaissance Masters", clue: "Polymaths of art and invention", emoji: "🎨" \}/g, 'theme: { name: "All characters are polymaths of art and invention" }');

fs.writeFileSync('server.ts', code);
