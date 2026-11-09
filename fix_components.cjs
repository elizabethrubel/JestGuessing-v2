const fs = require('fs');

const files = [
  'src/components/RoundIntroModal.tsx',
  'src/components/SinglePlayerScreen.tsx',
  'src/components/LastTurnInterstitial.tsx',
  'src/components/ScoreboardScreen.tsx',
  'src/components/ActiveTurnScreen.tsx',
  'src/components/LobbyScreen.tsx',
  'src/components/PrivacyInterstitialScreen.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // Replace {theme.emoji} 
    code = code.replace(/\{theme\.emoji\}\s*/g, '');
    
    // Replace choice.emoji
    code = code.replace(/<span className="text-2xl">\{choice\.emoji\}<\/span>/g, '');
    
    // Replace theme.clue logic
    code = code.replace(/• "\{theme\.clue\}"/g, '');
    code = code.replace(/<span className="hidden sm:inline text-zinc-400">• "\{theme\.clue\}"<\/span>/g, '');
    code = code.replace(/<p className="text-\[11px\] text-stone-600">\{theme\.clue\}<\/p>/g, '');
    code = code.replace(/<p className="text-xs text-stone-600 mt-0\.5 line-clamp-2">\{choice\.clue\}<\/p>/g, '');
    code = code.replace(/<span>\{theme\.clue\}<\/span>/g, '');
    code = code.replace(/<div className="text-6xl my-3"><\/div>/g, ''); // cleanup empty div from RoundIntroModal
    code = code.replace(/theme\.clue\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\|/g, ''); // LobbyScreen fix
    code = code.replace(/<span className="font-bold text-amber-800 mr-1\.5">Round Clue:<\/span>\s*<span>"\{selectedTheme\.clue\}"<\/span>/g, '');

    fs.writeFileSync(file, code);
  }
});
