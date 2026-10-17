
const fs = require('fs');
const path = require('path');
const bitmap = fs.readFileSync('screenshot.png');
const base64 = Buffer.from(bitmap).toString('base64');
console.log(base64);

