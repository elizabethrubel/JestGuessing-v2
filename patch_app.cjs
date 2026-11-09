const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
`    const updatedPlayers = players.map((player, idx) => ({
      ...player,
      assignedCharacter: shuffledChars[idx % shuffledChars.length],
      hasGuessedCorrectly: false,
    }));`,
`    const updatedPlayers = players.map((player, idx) => {
      const explicitChar = theme.characters.find(c => c.assignedPlayerId === player.id);
      return {
        ...player,
        assignedCharacter: explicitChar || shuffledChars[idx % shuffledChars.length],
        hasGuessedCorrectly: false,
      };
    });`
);

// also fix the routing for turn progression:
code = code.replace(/setStage\('theme_reveal'\);/g, "setStage('privacy_interstitial');");
// but wait, handleStartRound SHOULD go to theme_reveal!
// let's restore handleStartRound:
code = code.replace(
`    setTurnCounter(1);
    setStage('privacy_interstitial');
  };`,
`    setTurnCounter(1);
    setStage('theme_reveal');
  };`
);

fs.writeFileSync('src/App.tsx', code);
