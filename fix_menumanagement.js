const fs = require('fs');
const c = fs.readFileSync('src/admin/MenuManagement.js', 'utf8');
const fixed = c.replace(
  /<p className="stitch-banner-desc">Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters\.\s*<\/p>\s*<\/div>/,
  '<p className="stitch-banner-desc">Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters.\n        </p>\n        </div>'
);
fs.writeFileSync('src/admin/MenuManagement.js', fixed);
console.log('Fixed MenuManagement.js');