const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'app', 'api', 'v1', 'crm', 'dashboard');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // replace 7 `../` with 6 `../` inside admin/sales/etc
      if (dir !== targetDir) { // it's a subfolder like /admin or /sales
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//g, '../../../../../../');
      } else { // it's the root dashboard/route.ts
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//g, '../../../../../');
      }
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(targetDir);
console.log('Fixed dashboard imports!');
