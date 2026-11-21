const fs = require('fs');

// Fix AddEditFood.js - missing closing </p> tag
let c = fs.readFileSync('src/admin/AddEditFood.js', 'utf8');
c = c.replace(
  /<p className="stitch-banner-desc">Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing\.\s*<\/p>\s*<\/div>/,
  '<p className="stitch-banner-desc">Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing.\n        </p>\n        </div>'
);
fs.writeFileSync('src/admin/AddEditFood.js', c);
console.log('Fixed AddEditFood.js');

// Fix MenuManagement.js
let c2 = fs.readFileSync('src/admin/MenuManagement.js', 'utf8');
c2 = c2.replace(
  /<p className="stitch-banner-desc">Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters\.\s*<\/p>\s*<\/div>/,
  '<p className="stitch-banner-desc">Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters.\n        </p>\n        </div>'
);
fs.writeFileSync('src/admin/MenuManagement.js', c2);
console.log('Fixed MenuManagement.js');

// Fix CategoryManagement.js - missing closing div in table cell
let c3 = fs.readFileSync('src/admin/CategoryManagement.js', 'utf8');
c3 = c3.replace(
  /<td>\s*<div className="flex items-center gap-2">\s*<div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">\s*<span className="material-symbols-outlined text-primary text-\[18px\]">flatware<\/span>\s*<span>\{category\.itemCount \|\| 0\} Active Dishes<\/span>\s*<\/div>\s*<\/div>\s*<\/td>\s*<\/td>/,
  '<td>\n                        <div className="flex items-center gap-2">\n                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">\n                            <span className="material-symbols-outlined text-primary text-[18px]">flatware</span>\n                            <span>{category.itemCount || 0} Active Dishes</span>\n                          </div>\n                        </div>\n                      </td>'
);
fs.writeFileSync('src/admin/CategoryManagement.js', c3);
console.log('Fixed CategoryManagement.js');

// Fix OrderManagement.js - remove duplicate filteredOrders
let c4 = fs.readFileSync('src/admin/OrderManagement.js', 'utf8');
c4 = c4.replace(
  /const filteredOrders = orders\.filter\(\(ord\) => \{\s*if \(!searchQuery\.trim\(\)\) return true;\s*const q = searchQuery\.toLowerCase\(\);\s*const orderId = \(ord\.orderId \|\| ''\)\.toLowerCase\(\);\s*const tokenStr = String\(ord\.dailyTokenNumber \|\| ''\);\s*const custName = \(ord\.customer\?\.name \|\| ''\)\.toLowerCase\(\);\s*const custPhone = \(ord\.customer\?\.phone \|\| ''\)\.toLowerCase\(\);\s*return orderId\.includes\(q\) \|\| tokenStr\.includes\(q\) \|\| custName\.includes\(q\) \|\| custPhone\.includes\(q\);\s*  \}\);/g,
  ''
);
fs.writeFileSync('src/admin/OrderManagement.js', c4);
console.log('Fixed OrderManagement.js');

// Fix AdminDashboard.js - add missing closing </AdminLayout> tag
let c5 = fs.readFileSync('src/admin/AdminDashboard.js', 'utf8');
c5 = c5.replace(
  /<AdminLayout[^>]*>[\s\S]*<\/AdminLayout>/,
  function(m) {
    const open = (m.match(/<div/g) || []).length;
    const close = (m.match(/<\/div>/g) || []).length;
    if (open > close) {
      return m + '</div>'.repeat(open - close);
    }
    return m;
  }
);
fs.writeFileSync('src/admin/AdminDashboard.js', c5);
console.log('Fixed AdminDashboard.js');

console.log('All fixes applied!');