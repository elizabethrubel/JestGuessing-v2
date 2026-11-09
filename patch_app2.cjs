const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
`          <ThemeScreen
            initialTheme={activeTheme}`,
`          <ThemeScreen
            players={players}
            initialTheme={activeTheme}`
);
fs.writeFileSync('src/App.tsx', code);
