const fs = require('fs');
const path = require('path');

const rootApiDir = path.join(__dirname, 'src', 'app', 'api', 'v1');

function singularize(word) {
  if (word === 'properties') return 'property';
  if (word === 'amenities') return 'amenity';
  if (word === 'property-categories') return 'category';
  if (word === 'favorites') return 'favorite';
  if (word === 'shortlists') return 'shortlist';
  if (word === 'leads') return 'lead';
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function getEntityIdName(parentFolderName) {
  const singular = singularize(parentFolderName);
  const parts = singular.split('-');
  const camelCase = parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return camelCase + 'Id'; 
}

function processDirectory(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch(e) { return; }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name === '[id]') {
        const parentFolderName = path.basename(dir);
        let newParamName = getEntityIdName(parentFolderName);
        
        if (parentFolderName === 'jobs') newParamName = 'jobId';
        if (parentFolderName === 'preferences') newParamName = 'preferenceId';

        const newDirName = `[${newParamName}]`;
        const newDirPath = path.join(dir, newDirName);

        // Update TS files internally first
        updateTypeScriptFilesInDir(fullPath, newParamName);

        if (fs.existsSync(newDirPath)) {
          console.log(`Merging ${parentFolderName}: [id] -> [${newParamName}]`);
          mergeDirectories(fullPath, newDirPath);
        } else {
          console.log(`Copying ${parentFolderName}: [id] -> [${newParamName}]`);
          fs.mkdirSync(newDirPath, { recursive: true });
          mergeDirectories(fullPath, newDirPath);
        }

        // Try to delete original
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } catch(e) {
          console.log(`Could not delete original directory: ${fullPath} - Error: ${e.message}`);
        }
      } else {
        processDirectory(fullPath);
      }
    }
  }
}

function mergeDirectories(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      mergeDirectories(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function updateTypeScriptFilesInDir(dir, newParamName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      updateTypeScriptFilesInDir(fullPath, newParamName);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/\{ id: string \}/g, `{ ${newParamName}: string }`);
      content = content.replace(/\{ id \}/g, `{ ${newParamName}: id }`);
      content = content.replace(/const \{ id \} = await params;/g, `const { ${newParamName}: id } = await params;`);
      content = content.replace(/const \{ id \} = params;/g, `const { ${newParamName}: id } = params;`);
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(rootApiDir);
console.log('Done!');
