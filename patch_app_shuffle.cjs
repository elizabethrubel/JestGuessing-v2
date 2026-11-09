const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const shuffleLogic = `
  const handleShuffleTheme = async () => {
    try {
      const res = await fetch('/api/fresh-themes');
      if (res.ok) {
        const freshThemes = await res.json();
        if (Array.isArray(freshThemes) && freshThemes.length > 0) {
          handleStartRound(freshThemes[0]);
          return;
        }
      }
      const { CURATED_THEMES } = await import('./data/themes');
      const fallback = CURATED_THEMES[Math.floor(Math.random() * CURATED_THEMES.length)];
      handleStartRound(fallback);
    } catch {
      const { CURATED_THEMES } = await import('./data/themes');
      const fallback = CURATED_THEMES[Math.floor(Math.random() * CURATED_THEMES.length)];
      handleStartRound(fallback);
    }
  };
`;

code = code.replace(
`  // Start round with selected theme`,
shuffleLogic + `\n  // Start round with selected theme`
);

code = code.replace(
`        {stage === 'theme_reveal' && activeTheme && (
          <ThemeRevealScreen
            theme={activeTheme}
            onContinue={() => setStage('privacy_interstitial')}
          />
        )}`,
`        {stage === 'theme_reveal' && activeTheme && (
          <ThemeRevealScreen
            theme={activeTheme}
            onContinue={() => setStage('privacy_interstitial')}
            onShuffleTheme={handleShuffleTheme}
          />
        )}`
);

fs.writeFileSync('src/App.tsx', code);
