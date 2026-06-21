const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if(file.endsWith('.jsx')) filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const pages = walkSync(pagesDir);

pages.forEach(pagePath => {
  if (pagePath.includes('Settings.jsx')) return; // Already done

  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Calculate relative path to hooks
  const relPath = path.relative(path.dirname(pagePath), path.join(__dirname, 'src', 'hooks', 'usePageTitle'));
  const importStr = `import { usePageTitle } from '${relPath.replace(/\\/g, '/')}';\n`;
  
  if(content.includes('usePageTitle')) return; // Already has it

  // Find the component definition
  // E.g., const Login = () => { or const Login = function() {
  const componentName = path.basename(pagePath, '.jsx');
  
  const regex1 = new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
  const regex2 = new RegExp(`function\\s+${componentName}\\s*\\([^)]*\\)\\s*{`);
  
  let match = content.match(regex1) || content.match(regex2);
  
  if (match) {
    const title = componentName.replace(/([A-Z])/g, ' $1').trim();
    content = importStr + content;
    content = content.replace(match[0], `${match[0]}\n  usePageTitle('${title}');`);
    fs.writeFileSync(pagePath, content);
    console.log(`Patched ${componentName}`);
  } else {
    console.log(`Could not find component definition for ${componentName} in ${pagePath}`);
  }
});
