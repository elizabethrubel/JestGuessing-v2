const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
`  const { themeName } = req.body;`,
`  const { themeName, players } = req.body;`
);

const oldPrompt = `The user wants a custom theme: "\${cleanTheme}".
Return a valid JSON object matching this schema:
{
  "name": "All characters [insert commonality] (e.g. All characters are from the 90s)",
  "characters": [
    {
      "name": "Full recognizable character or person name",
      "wikiSlug": "Exact Wikipedia article slug for thumbnail fetching",
      "hint": "One subtle, fun yes/no clue if the guesser is stuck (max 10 words)"
    }
  ]
}

Ensure you provide between 8 and 10 widely recognizable real or fictional characters.
Return ONLY raw JSON, no markdown code fence blocks.\`;`;

const newPrompt = `The user wants a custom theme: "\${cleanTheme}".

\${players && players.length > 0 
  ? \`There are exactly \${players.length} players in the game: \${players.map(p => p.name).join(', ')}. 
  You MUST assign exactly one fitting character to each player based on their name or personality, or just randomly if you don't know them.
  Include an "assignedPlayerId" field for each character matching the player's ID.\` 
  : 'Ensure you provide between 8 and 10 widely recognizable real or fictional characters.'}

Return a valid JSON object matching this schema:
{
  "name": "All characters [insert commonality] (e.g. All characters are from the 90s)",
  "characters": [
    {
      "name": "Full recognizable character or person name",
      "wikiSlug": "Exact Wikipedia article slug for thumbnail fetching",
      "hint": "One subtle, fun yes/no clue if the guesser is stuck (max 10 words)"\${players && players.length > 0 ? ',\\n      "assignedPlayerId": "ID of the player assigned to this character"' : ''}
    }
  ]
}
Return ONLY raw JSON, no markdown code fence blocks.\`;`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
