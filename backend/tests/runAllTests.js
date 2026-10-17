const { spawn } = require('child_process');
const path = require('path');

const testFiles = [
  'tests/auth.test.js',
  'tests/menu.test.js',
  'tests/order.test.js',
  'tests/concurrency_token.test.js',
  'tests/admin.test.js',
  'tests/security_regression.test.js',
];

console.log('====================================================');
console.log('Hotel New Moorthi Cafe — Running Backend Test Suites');
console.log('====================================================\n');

let current = 0;
let failedSuites = 0;

function runNext() {
  if (current >= testFiles.length) {
    console.log('\n====================================================');
    if (failedSuites === 0) {
      console.log('✅ ALL TEST SUITES PASSED SUCCESSFULLY!');
    } else {
      console.error(`❌ ${failedSuites} TEST SUITE(S) FAILED.`);
    }
    console.log('====================================================');
    process.exit(failedSuites === 0 ? 0 : 1);
  }

  const file = testFiles[current++];
  console.log(`\n▶ Running: ${file}`);
  const child = spawn(process.execPath, ['--test', file], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });

  child.on('close', (code) => {
    if (code !== 0) {
      failedSuites++;
      console.error(`❌ Suite failed: ${file} (Exit code: ${code})`);
    } else {
      console.log(`✔ Suite completed: ${file}`);
    }
    runNext();
  });
}

runNext();
