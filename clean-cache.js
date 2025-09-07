// Script para limpar cache do Next.js
const fs = require('fs');
const path = require('path');

// Remove pastas de cache
const cacheDirs = [
  '.next',
  'node_modules/.cache'
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Removendo ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

console.log('Cache limpo com sucesso!');