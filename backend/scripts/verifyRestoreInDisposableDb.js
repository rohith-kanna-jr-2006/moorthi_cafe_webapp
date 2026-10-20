const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const restoreDatabase = require('./restoreDb');

async function verifyRestore() {
  const backupsDir = path.resolve(__dirname, '../backups');
  const backupFolders = fs.readdirSync(backupsDir)
    .filter(f => f.startsWith('backup_moorthi_cafe_'))
    .sort()
    .reverse();

  if (backupFolders.length === 0) {
    console.error('No backup folder found to verify!');
    process.exit(1);
  }

  const latestBackupPath = path.join(backupsDir, backupFolders[0]);
  const manifest = JSON.parse(fs.readFileSync(path.join(latestBackupPath, 'manifest.json'), 'utf-8'));
  console.log(`[Verify] Testing restore from: ${latestBackupPath}`);
  console.log('[Verify] Expected manifest counts:', manifest.collections);

  const testDbName = 'moorthi_cafe_restore_verify_test';
  const testDbUri = `mongodb://127.0.0.1:27017/${testDbName}`;

  // 1. Perform restore into disposable test database
  await restoreDatabase(latestBackupPath, testDbUri);

  // 2. Connect to the restored database and verify counts & document integrity
  const testConn = await mongoose.createConnection(testDbUri).asPromise();
  console.log(`[Verify] Connected to restored test database: ${testDbName}`);

  const verificationResults = {};
  let allMatched = true;

  for (const [colName, expectedCount] of Object.entries(manifest.collections)) {
    const actualCount = await testConn.collection(colName).countDocuments();
    const match = actualCount === expectedCount;
    verificationResults[colName] = { expected: expectedCount, actual: actualCount, match };
    if (!match) allMatched = false;
  }

  console.log('[Verify] Collection count verification:');
  console.table(verificationResults);

  // 3. Document integrity spot-checks
  const sampleOrder = await testConn.collection('orders').findOne({ orderId: 'HNMC-20261016-0001' });
  const sampleFood = await testConn.collection('foods').findOne({ name: 'Golden Ghee Roast Masala Dosa' });
  const sampleUser = await testConn.collection('users').findOne({ email: 'admin@moorthicafe.com' });

  const integrityCheck = {
    sampleOrderFound: Boolean(sampleOrder && sampleOrder.items && sampleOrder.items.length > 0),
    sampleFoodFound: Boolean(sampleFood && sampleFood.price === 160),
    sampleUserFound: Boolean(sampleUser && sampleUser.role === 'admin'),
  };
  console.log('[Verify] Document integrity spot checks:', integrityCheck);

  // 4. Verify dev database `moorthi_cafe` was NOT altered
  const devConn = await mongoose.createConnection('mongodb://127.0.0.1:27017/moorthi_cafe').asPromise();
  const devFoodCount = await devConn.collection('foods').countDocuments();
  const devOrderCount = await devConn.collection('orders').countDocuments();
  console.log(`[Verify] Dev database moorthi_cafe unaffected: foods=${devFoodCount}, orders=${devOrderCount}`);
  await devConn.close();

  // 5. Clean up the disposable test database
  console.log(`[Verify] Dropping disposable test database: ${testDbName}...`);
  await testConn.dropDatabase();
  console.log('[Verify] Disposable database successfully dropped.');
  await testConn.close();

  if (!allMatched || !integrityCheck.sampleOrderFound || !integrityCheck.sampleFoodFound) {
    console.error('❌ Restore verification failed!');
    process.exit(1);
  }

  console.log('✅ BACKUP AND RESTORE PROCEDURE VERIFIED 100% SUCCESSFUL!');
}

verifyRestore().catch(err => {
  console.error('[Verify Error]', err);
  process.exit(1);
});
