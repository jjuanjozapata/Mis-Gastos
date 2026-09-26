const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

content = content.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
);
content = content.replace(
    '.pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 20px) !important; }',
    '.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 20px) !important; }'
);
content = content.replace(
    '.pt-safe { padding-top: max(env(safe-area-inset-top), 24px) !important; }',
    '.pt-safe { padding-top: calc(env(safe-area-inset-top) + 24px) !important; }'
);

content = content.replace(
    /'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[^']+'/,
    'typeof SUPABASE_ANON_KEY !== "undefined" ? SUPABASE_ANON_KEY : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc3plYm5qY2dqZnp4dm5leHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzkwNzcsImV4cCI6MjEwNTQ1NTA3N30.Od66KMiiuXPrzAUfuiprc7Q7SF3909lxDeBevMK25h0"'
);

content = content.replace(/p\.id/g, 'p?.id');
content = content.replace(/cat\.id/g, 'cat?.id');
content = content.replace(/plan\.id/g, 'plan?.id');
content = content.replace(/metaEmergencia\.id/g, 'metaEmergencia?.id');
content = content.replace(/planExistente\.id/g, 'planExistente?.id');

fs.writeFileSync('index.html', content, 'utf-8');
console.log('Refactored');
