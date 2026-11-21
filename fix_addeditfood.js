const fs = require('fs');
const c = fs.readFileSync('src/admin/AddEditFood.js', 'utf8');
const fixed = c.replace(
  /<p className="stitch-banner-desc">Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing\.\s*<\/p>\s*<\/div>/,
  '<p className="stitch-banner-desc">Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing.\n        </p>\n        </div>'
);
fs.writeFileSync('src/admin/AddEditFood.js', fixed);
console.log('Fixed AddEditFood.js');