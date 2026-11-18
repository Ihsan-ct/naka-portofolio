const fs = require('fs');
fs[process.argv[2] === 'init' ? 'writeFileSync' : 'appendFileSync']('src/App.tsx', Buffer.from(process.argv[3], 'base64'));
