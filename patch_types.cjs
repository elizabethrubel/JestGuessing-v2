const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');
code = code.replace(/imageUrl\?: string;/g, 'imageUrl?: string;\n  assignedPlayerId?: string;');
fs.writeFileSync('src/types.ts', code);
