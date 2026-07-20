const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'app', 'api');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace all relative imports that point to top-level src folders
      // e.g. import { X } from "../../../../lib/something" -> import { X } from "@/lib/something"
      
      // We will match quotes (either ' or ") followed by any number of ../ then the target folder
      const regexLib = /(["'])(\.\.\/)+lib\//g;
      const regexModules = /(["'])(\.\.\/)+modules\//g;
      const regexTypes = /(["'])(\.\.\/)+types\//g;
      const regexCore = /(["'])(\.\.\/)+core\//g;
      
      let newContent = content.replace(regexLib, '$1@/lib/');
      newContent = newContent.replace(regexModules, '$1@/modules/');
      newContent = newContent.replace(regexTypes, '$1@/types/');
      newContent = newContent.replace(regexCore, '$1@/core/');

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir(targetDir);
console.log('Fixed all relative imports across API routes!');
