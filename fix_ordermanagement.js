const fs = require('fs');
const c = fs.readFileSync('src/admin/OrderManagement.js', 'utf8');
// Remove the second filteredOrders declaration
const fixed = c.replace(
  /const filteredOrders = orders\.filter\(\(ord\) => \{\s*if \(!searchQuery\.trim\(\)\) return true;\s*const q = searchQuery\.toLowerCase\(\);\s*const orderId = \(ord\.orderId \|\| ''\)\.toLowerCase\(\);\s*const tokenStr = String\(ord\.dailyTokenNumber \|\| ''\);\s*const custName = \(ord\.customer\?\.name \|\| ''\)\.toLowerCase\(\);\s*const custPhone = \(ord\.customer\?\.phone \|\| ''\)\.toLowerCase\(\);\s*return orderId\.includes\(q\) \|\| tokenStr\.includes\(q\) \|\| custName\.includes\(q\) \|\| custPhone\.includes\(q\);\s*  \}\);/g,
  ''
);
fs.writeFileSync('src/admin/OrderManagement.js', fixed);
console.log('Fixed OrderManagement.js');