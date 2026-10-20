const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = require('../src/config/env');

async function restoreDatabase(backupDirPath, targetMongoUri = null) {
  if (!backupDirPath) {
    console.error('[Restore Error] Please specify a backup directory path');
    process.exit(1);
  }

  const resolvedDir = path.resolve(backupDirPath);
  if (!fs.existsSync(resolvedDir)) {
    console.error(`[Restore Error] Backup directory does not exist: ${resolvedDir}`);
    process.exit(1);
  }

  const manifestPath = path.join(resolvedDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`[Restore Error] manifest.json not found in: ${resolvedDir}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log('[Restore] Restoring from manifest:', manifest);

  const connectionUri = targetMongoUri || process.env.RESTORE_MONGODB_URI || env.mongodbUri;

  try {
    console.log(`[Restore] Connecting to ${connectionUri}...`);
    await mongoose.connect(connectionUri);
    const db = mongoose.connection.db;

    for (const [colName, expectedCount] of Object.entries(manifest.collections)) {
      const colFile = path.join(resolvedDir, `${colName}.json`);
      if (!fs.existsSync(colFile)) {
        console.warn(`[Restore Warning] Missing file for collection: ${colName}`);
        continue;
      }
      const rawData = fs.readFileSync(colFile, 'utf-8');
      const docs = JSON.parse(rawData);

      // Rehydrate MongoDB ObjectIds and Dates where appropriate
      // Clear collection and insert documents
      const col = db.collection(colName);
      await col.deleteMany({});
      if (docs.length > 0) {
        // Convert $oid, $date or string _id if needed
        const processed = docs.map(doc => {
          if (doc._id && typeof doc._id === 'string' && doc._id.match(/^[0-9a-fA-F]{24}$/)) {
            doc._id = new mongoose.Types.ObjectId(doc._id);
          }
          return doc;
        });
        await col.insertMany(processed);
      }
      console.log(`[Restore] Restored ${docs.length} documents into '${colName}'`);
    }

    console.log('[Restore] Restoration successfully verified!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('[Restore Error]', err);
    process.exit(1);
  }
}

if (require.main === module) {
  const targetDir = process.argv[2];
  const targetUri = process.argv[3];
  restoreDatabase(targetDir, targetUri);
}

module.exports = restoreDatabase;
