const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/graphql/__generated__');

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(dir, file);
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      const updatedContent = content.replace(/\.js/g, '.ts');

      fs.writeFile(filePath, updatedContent, err => {
        if (err) {
          console.error(`Error writing file ${file}:`, err);
          return;
        }
        console.log(`Updated ${file}`);
      });
    });
  });
});
