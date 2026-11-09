const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
`    const updatedPlayers = players.map((player, idx) => {
      const explicitChar = theme.characters.find(c => c.assignedPlayerId === player.id);
      return {
        ...player,
        assignedCharacter: explicitChar || shuffledChars[idx % shuffledChars.length],
        hasGuessedCorrectly: false,
      };
    });`,
`    const explicitlyAssignedIds = new Set(theme.characters.map(c => c.assignedPlayerId).filter(Boolean));
    const unassignedChars = theme.characters.filter(c => !explicitlyAssignedIds.has(c.assignedPlayerId)).sort(() => Math.random() - 0.5);
    
    let unassignedIndex = 0;
    const updatedPlayers = players.map((player) => {
      const explicitChar = theme.characters.find(c => c.assignedPlayerId === player.id);
      const assignedChar = explicitChar || unassignedChars[unassignedIndex % unassignedChars.length];
      if (!explicitChar) unassignedIndex++;
      
      return {
        ...player,
        assignedCharacter: assignedChar,
        hasGuessedCorrectly: false,
      };
    });`
);

// We need to also remove the unused shuffledChars if we replaced it
code = code.replace(`const shuffledChars = [...theme.characters].sort(() => Math.random() - 0.5);\n`, ``);

fs.writeFileSync('src/App.tsx', code);
