const fs = require('fs');
let code = fs.readFileSync('src/components/ThemeScreen.tsx', 'utf-8');

code = code.replace(
`interface ThemeScreenProps {
  onSelectThemeAndStart: (theme: ThemePack) => void;`,
`import { Player } from '../types';

interface ThemeScreenProps {
  players: Player[];
  onSelectThemeAndStart: (theme: ThemePack) => void;`
);

code = code.replace(
`export const ThemeScreen: React.FC<ThemeScreenProps> = ({
  onSelectThemeAndStart,
  onBackToSetup,
  onGoHome,
}) => {`,
`export const ThemeScreen: React.FC<ThemeScreenProps> = ({
  players,
  onSelectThemeAndStart,
  onBackToSetup,
  onGoHome,
}) => {`
);

// update fetch payload
code = code.replace(
`        body: JSON.stringify({ themeName: customThemeInput.trim() }),`,
`        body: JSON.stringify({ 
          themeName: customThemeInput.trim(),
          players: players.map(p => ({ id: p.id, name: p.name }))
        }),`
);

// clean up duplicate imports if any
code = code.replace(/import \{ ThemePack \} from '\.\.\/types';/, '');
code = code.replace(/import \{ Player \} from '\.\.\/types';/, 'import { ThemePack, Player } from \'../types\';');

fs.writeFileSync('src/components/ThemeScreen.tsx', code);
