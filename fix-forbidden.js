const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'modules'),
  path.join(__dirname, 'src', 'app', 'api')
];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const newContent = content.replace(/ForbiddenError/g, 'AuthorizationError');

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

for (const dir of targetDirs) {
  processDir(dir);
}
console.log('Fixed ForbiddenError to AuthorizationError!');
