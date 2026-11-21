const fs = require('fs');

// Fix AddEditFood.js - fix the form closing
let c = fs.readFileSync('src/admin/AddEditFood.js', 'utf8');
// The issue is that the form doesn't close properly - need to close the outer div for the form
c = c.replace(
  /<\/form>\s*<\/AdminLayout>/,
  '</form>\n      </AdminLayout>'
);
fs.writeFileSync('src/admin/AddEditFood.js', c);
console.log('Fixed AddEditFood.js');

// Fix AdminDashboard.js - add missing closing div for AdminLayout
let c2 = fs.readFileSync('src/admin/AdminDashboard.js', 'utf8');
c2 = c2.replace(
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
fs.writeFileSync('src/admin/AdminDashboard.js', c2);
console.log('Fixed AdminDashboard.js');

// Fix CategoryManagement.js - the issue is in the table cell
let c3 = fs.readFileSync('src/admin/CategoryManagement.js', 'utf8');
c3 = c3.replace(
  /<td>\s*<div className="flex items-center gap-2">\s*<div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">\s*<span className="material-symbols-outlined text-primary text-\[18px\]">flatware<\/span>\s*<span>\{category\.itemCount \|\| 0\} Active Dishes<\/span>\s*<\/div>\s*<\/div>\s*<\/td>\s*<\/td>/,
  '<td>\n                        <div className="flex items-center gap-2">\n                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">\n                            <span className="material-symbols-outlined text-primary text-[18px]">flatware</span>\n                            <span>{category.itemCount || 0} Active Dishes</span>\n                          </div>\n                      </td>'
);
fs.writeFileSync('src/admin/CategoryManagement.js', c3);
console.log('Fixed CategoryManagement.js');

// Fix CustomerManagement.js - extra closing brace
let c4 = fs.readFileSync('src/admin/CustomerManagement.js', 'utf8');
c4 = c4.replace(
  /<\/AdminLayout>\s*\);\s*};/,
  '</AdminLayout>\n    );\n  };'
);
fs.writeFileSync('src/admin/CustomerManagement.js', c4);
console.log('Fixed CustomerManagement.js');

// Fix OrderManagement.js - remove duplicate handleStatusUpdate
let c4b = fs.readFileSync('src/admin/OrderManagement.js', 'utf8');
c4b = c4b.replace(
  /const handleStatusUpdate = async \(orderId, newStatus\) => \{\s*try \{\s*setUpdatingId\(orderId\);\s*setStatusMessage\(''\);\s*const token = localStorage\.getItem\('moorthi_token'\);\s*const res = await api\.updateOrderStatus\(orderId, \{ status: newStatus \}, token\);\s*if \(res\.success\) \{\s*setStatusMessage\(`Order updated to \$\{newStatus\}\)`\);\s*setTimeout\(\(\) => setStatusMessage\(''\), 3000\);\s*fetchOrders\(\);\s*\} else \{\s*alert\(res\.message \|\| 'Failed to update order status'\);\s*\} catch \(err\) \{\s*alert\(err\.message \|\| 'Error updating order'\);\s*\} finally \{\s*setUpdatingId\(null\);\s*\}\s*\};\s*const filteredOrders = orders\.filter\(\(ord\) => \{/,
  'const filteredOrders = orders.filter((ord) => {'
);
fs.writeFileSync('src/admin/OrderManagement.js', c4b);
console.log('Fixed OrderManagement.js');

console.log('All fixes applied!');