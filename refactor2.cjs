const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

content = content.replace(
    /const\s+{\s*data(:\s*\w+)?\s*}\s*=\s*await\s+db\.from\('([^']+)'\)/g,
    'const { data, error } = await db.from(\'\')'
);

// Mueve el icono del ojo a "Reportes"
// Let's modify the SVG of the Reportes tab to include the eye icon or just put an eye icon emoji there.
content = content.replace(
    '<span class="text-[10px] font-bold">Reportes</span>',
    '<span class="text-[10px] font-bold">👁️ Reportes</span>'
);

fs.writeFileSync('index.html', content, 'utf-8');
console.log('Refactored 2');
