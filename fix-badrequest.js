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
      
      const newContent = content.replace(/ApiResponse\.badRequest\((.*?)\)/g, 'ApiResponse.error(new ValidationError($1))');
      
      if (newContent !== content) {
        // Since we are adding ValidationError, we should ensure it's imported if we replaced something
        // But since we can't reliably inject imports via simple regex without parsing AST, let's see how many matches we have.
        // Actually, we can just prepend the import if it's not there.
        let finalContent = newContent;
        if (!finalContent.includes('ValidationError')) {
           finalContent = 'import { ValidationError } from "@/lib/errors/domain.error";\n' + finalContent;
        }
        fs.writeFileSync(fullPath, finalContent, 'utf8');
      }
    }
  }
}

for (const dir of targetDirs) {
  processDir(dir);
}
console.log('Fixed badRequest globally!');
