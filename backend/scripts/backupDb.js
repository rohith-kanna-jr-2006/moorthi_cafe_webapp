const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = require('../src/config/env');

async function backupDatabase() {
  try {
    console.log(`[Backup] Connecting to target database: ${env.mongodbUri}`);
    console.log(`[Backup] Environment: ${env.nodeEnv}`);

    await mongoose.connect(env.mongodbUri);
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`[Backup] Authoritative DB Name: ${dbName}`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.resolve(__dirname, `../backups/backup_${dbName}_${timestamp}`);
    fs.mkdirSync(backupDir, { recursive: true });

    const collections = await db.listCollections().toArray();
    console.log(`[Backup] Found ${collections.length} collections:`, collections.map(c => c.name));

    const manifest = {
      databaseName: dbName,
      mongodbUri: env.mongodbUri,
      nodeEnv: env.nodeEnv,
      timestamp: new Date().toISOString(),
      collections: {},
    };

    for (const col of collections) {
      const name = col.name;
      const docs = await db.collection(name).find({}).toArray();
      const filePath = path.join(backupDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
      manifest.collections[name] = docs.length;
      console.log(`[Backup] Saved ${docs.length} documents from '${name}' -> ${filePath}`);
    }

    fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`[Backup] Complete! Backup saved to: ${backupDir}`);
    await mongoose.disconnect();
    return backupDir;
  } catch (err) {
    console.error(`[Backup Error]`, err);
    process.exit(1);
  }
}

if (require.main === module) {
  backupDatabase();
}

module.exports = backupDatabase;
