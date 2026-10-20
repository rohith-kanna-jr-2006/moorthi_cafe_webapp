const fs = require('fs');
const path = require('path');

function runValidation() {
  console.log('====================================================');
  console.log('Hotel New Moorthi Cafe — Comprehensive Menu Import Validator');
  console.log('====================================================\n');

  // 1. Locate and read authoritative Markdown menu
  const possibleMdPaths = [
    path.resolve(__dirname, '../../docs/moorthy_cafe_menu_extracted.md'),
    path.resolve(__dirname, '../docs/moorthy_cafe_menu_extracted.md'),
  ];
  let mdPath = null;
  for (const p of possibleMdPaths) {
    if (fs.existsSync(p)) {
      mdPath = p;
      break;
    }
  }
  if (!mdPath) {
    console.error('❌ FATAL: Authoritative menu markdown (moorthy_cafe_menu_extracted.md) not found!');
    process.exit(1);
  }
  console.log(`[Source Markdown] Reading from: ${mdPath}`);
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const mdLines = mdContent.split(/\r?\n/);

  // 2. Parse Markdown Table Rows independently
  const expectedSections = {
    1: { name: 'Chicken dishes — சிக்கன் வகைகள்', expectedCount: 24 },
    2: { name: 'Biryani & rice — பிரியாணி / அரிசி வகைகள்', expectedCount: 3 },
    3: { name: 'Parotta & related items — பரோட்டா வகைகள்', expectedCount: 17 },
    4: { name: 'NMC special items — NMC ஸ்பெஷல்', expectedCount: 5 },
    5: { name: 'Grill items — கிரில் வகைகள்', expectedCount: 3 },
    6: { name: 'Tandoori — தந்தூரி', expectedCount: 5 },
    7: { name: 'Veg / non-veg gravies — வெஜ் / கிரேவி வகைகள்', expectedCount: 6 },
    8: { name: 'Mutton dishes — மட்டன் வகைகள்', expectedCount: 8 },
    9: { name: 'Dosa items — தோசை வகைகள்', expectedCount: 7 },
    10: { name: 'Salna, sides & extras — சால்னா / சைட்ஸ்', expectedCount: 2 },
    11: { name: 'Page 2 entries — Lappa / noodles / rice', expectedCount: 16 },
  };

  let currentSec = null;
  const sourceRows = [];
  let rawRowCounter = 0;

  for (let i = 0; i < mdLines.length; i++) {
    const line = mdLines[i].trim();
    const secMatch = line.match(/^##\s+(\d+)\.\s+(.*)$/);
    if (secMatch) {
      currentSec = parseInt(secMatch[1], 10);
      continue;
    }

    if (!line.startsWith('|')) continue;
    if (line.includes('Tamil name') || line.includes('---|')) continue;

    const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length < 3) continue;

    rawRowCounter++;
    const rowObj = {
      rowIndex: rawRowCounter,
      sectionNumber: currentSec,
      tamilName: cells[0],
      englishName: cells[1],
    };

    if (currentSec === 1) {
      // 5 columns: Tamil | English | Bone | Boneless | Notes
      const bStr = cells[2] ? cells[2].replace(/[₹,\s]/g, '') : '';
      const blStr = cells[3] ? cells[3].replace(/[₹,\s]/g, '') : '';
      rowObj.bonePrice = (bStr && bStr !== '—' && !isNaN(parseInt(bStr, 10))) ? parseInt(bStr, 10) : null;
      rowObj.bonelessPrice = (blStr && blStr !== '—' && !isNaN(parseInt(blStr, 10))) ? parseInt(blStr, 10) : null;
      rowObj.notes = cells[4] || '';
    } else {
      // 4 columns: Tamil | English | Price | Notes
      const pStr = cells[2] ? cells[2].replace(/[₹,\s]/g, '') : '';
      rowObj.price = (pStr && pStr !== '—' && !isNaN(parseInt(pStr, 10))) ? parseInt(pStr, 10) : null;
      rowObj.notes = cells[3] || '';
    }

    sourceRows.push(rowObj);
  }

  console.log(`[Source Markdown] Parsed ${sourceRows.length} raw table rows across 11 sections.\n`);

  // 3. Load structured dataset
  const jsonPath = path.resolve(__dirname, 'menuImportData.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ FATAL: Dataset JSON not found at: ${jsonPath}`);
    process.exit(1);
  }
  const dataset = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const items = dataset.items || [];
  console.log(`[Import Dataset] Loaded ${items.length} items from ${jsonPath}.\n`);

  const errors = [];
  const warnings = [];

  // 4. Section Count Verification
  console.log('--- Checking Section & Category Row Counts ---');
  const sectionCounts = {};
  for (const r of sourceRows) {
    sectionCounts[r.sectionNumber] = (sectionCounts[r.sectionNumber] || 0) + 1;
  }
  const datasetSecCounts = {};
  for (const it of items) {
    datasetSecCounts[it.sectionNumber] = (datasetSecCounts[it.sectionNumber] || 0) + 1;
  }

  for (let s = 1; s <= 11; s++) {
    const exp = expectedSections[s].expectedCount;
    const src = sectionCounts[s] || 0;
    const dst = datasetSecCounts[s] || 0;
    const match = (src === exp && dst === exp);
    if (!match) {
      errors.push(`Section ${s} (${expectedSections[s].name}) count mismatch: expected ${exp}, source markdown has ${src}, dataset has ${dst}`);
      console.log(`❌ S${String(s).padStart(2, '0')}: Expected=${exp}, Source=${src}, Dataset=${dst}`);
    } else {
      console.log(`✅ S${String(s).padStart(2, '0')}: Exact match (${exp} items) — ${expectedSections[s].name}`);
    }
  }

  // 5. Total Row Count Check
  if (sourceRows.length !== 96) {
    errors.push(`Source markdown row count is ${sourceRows.length}, expected 96`);
  }
  if (items.length !== 96) {
    errors.push(`Import dataset item count is ${items.length}, expected 96`);
  }

  // 6. Check unique sourceMenuRowKey
  console.log('\n--- Checking Unique Source Menu Row Keys ---');
  const keySet = new Set();
  const duplicateKeys = [];
  for (const it of items) {
    if (!it.sourceMenuRowKey) {
      errors.push(`Item at row ${it.sourceRowIndex} (${it.nameEnglish}) is missing sourceMenuRowKey`);
    } else if (keySet.has(it.sourceMenuRowKey)) {
      duplicateKeys.push(it.sourceMenuRowKey);
    } else {
      keySet.add(it.sourceMenuRowKey);
    }
  }
  if (duplicateKeys.length > 0) {
    errors.push(`Duplicate sourceMenuRowKey values found: ${duplicateKeys.join(', ')}`);
  } else {
    console.log(`✅ All ${items.length} sourceMenuRowKey values are strictly unique.`);
  }

  // 7. Row-by-Row 1-to-1 Mapping and Price Verification
  console.log('\n--- Row-by-Row Price & Attribute Integrity Check ---');
  const boneBonelessPairs = [];

  for (let idx = 0; idx < sourceRows.length; idx++) {
    const src = sourceRows[idx];
    const dst = items.find(i => i.sourceRowIndex === src.rowIndex);

    if (!dst) {
      errors.push(`Source row ${src.rowIndex} (${src.englishName}) has no matching entry in dataset`);
      continue;
    }

    // Name check
    if (src.englishName.trim() !== dst.nameEnglish.trim()) {
      errors.push(`Row ${src.rowIndex} English name mismatch: source="${src.englishName}" vs dataset="${dst.nameEnglish}"`);
    }
    if (src.tamilName.trim() !== dst.nameTamil.trim()) {
      errors.push(`Row ${src.rowIndex} Tamil name mismatch: source="${src.tamilName}" vs dataset="${dst.nameTamil}"`);
    }
    if (src.sectionNumber !== dst.sectionNumber) {
      errors.push(`Row ${src.rowIndex} Section mismatch: source=${src.sectionNumber} vs dataset=${dst.sectionNumber}`);
    }

    // Section 1: Bone / Boneless verification
    if (src.sectionNumber === 1) {
      if (src.bonePrice !== null && src.bonelessPrice !== null) {
        boneBonelessPairs.push({
          row: src.rowIndex,
          name: src.englishName,
          bone: src.bonePrice,
          boneless: src.bonelessPrice,
        });

        // Dataset must have variants array with Bone and Boneless
        const boneVar = (dst.variants || []).find(v => v.name.toLowerCase() === 'bone');
        const bonelessVar = (dst.variants || []).find(v => v.name.toLowerCase() === 'boneless');

        if (!boneVar || boneVar.price !== src.bonePrice) {
          errors.push(`Row ${src.rowIndex} (${src.englishName}) Bone price mismatch: source=₹${src.bonePrice}, dataset=${boneVar ? '₹' + boneVar.price : 'MISSING'}`);
        }
        if (!bonelessVar || bonelessVar.price !== src.bonelessPrice) {
          errors.push(`Row ${src.rowIndex} (${src.englishName}) Boneless price mismatch: source=₹${src.bonelessPrice}, dataset=${bonelessVar ? '₹' + bonelessVar.price : 'MISSING'}`);
        }
        if (dst.price !== src.bonePrice) {
          errors.push(`Row ${src.rowIndex} (${src.englishName}) Base price mismatch: source Bone=₹${src.bonePrice}, dataset price=₹${dst.price}`);
        }
      } else if (src.bonePrice !== null) {
        if (dst.price !== src.bonePrice) {
          errors.push(`Row ${src.rowIndex} (${src.englishName}) Bone-only price mismatch: source=₹${src.bonePrice}, dataset=₹${dst.price}`);
        }
      } else if (src.bonelessPrice !== null) {
        if (dst.price !== src.bonelessPrice) {
          errors.push(`Row ${src.rowIndex} (${src.englishName}) Boneless-only price mismatch: source=₹${src.bonelessPrice}, dataset=₹${dst.price}`);
        }
      }
    } else {
      // Sections 2 to 11: Single price
      if (src.price !== dst.price) {
        errors.push(`Row ${src.rowIndex} (${src.englishName}) price mismatch: source=₹${src.price}, dataset=₹${dst.price}`);
      }
      if (dst.pricePaise !== dst.price * 100) {
        errors.push(`Row ${src.rowIndex} (${src.englishName}) pricePaise mismatch: price=${dst.price}, pricePaise=${dst.pricePaise}`);
      }
    }
  }

  console.log(`✅ Checked all 96 rows against source Markdown.`);
  console.log(`✅ Identified ${boneBonelessPairs.length} dual Bone/Boneless variant pairs (Expected: 16).`);
  if (boneBonelessPairs.length !== 16) {
    errors.push(`Found ${boneBonelessPairs.length} bone/boneless pairs, expected 16`);
  }

  // 8. Specific Item Audits (as requested by user)
  console.log('\n--- Specific Required Dish Integrity Audits ---');
  // Chicken Fry
  const chickenFry = items.find(i => i.sourceRowIndex === 1);
  if (chickenFry) {
    const b = chickenFry.variants?.find(v => v.name === 'Bone')?.price;
    const bl = chickenFry.variants?.find(v => v.name === 'Boneless')?.price;
    console.log(`- Chicken Fry (Row 1): Bone=₹${b}, Boneless=₹${bl} [Markdown: 245/260]`);
    if (b !== 245 || bl !== 260) {
      errors.push(`Chicken Fry price incorrect: Bone=${b}, Boneless=${bl}. Must be 245/260.`);
    }
  }

  // Pepper Chicken Entries
  const pepperChickens = items.filter(i => i.nameEnglish.toLowerCase() === 'pepper chicken');
  console.log(`- Pepper Chicken entries count: ${pepperChickens.length}`);
  if (pepperChickens.length !== 2) {
    errors.push(`Expected exactly 2 Pepper Chicken entries, found ${pepperChickens.length}`);
  } else {
    const pc1 = pepperChickens[0];
    const pc2 = pepperChickens[1];
    const pc1B = pc1.variants?.find(v => v.name === 'Bone')?.price;
    const pc1BL = pc1.variants?.find(v => v.name === 'Boneless')?.price;
    const pc2B = pc2.variants?.find(v => v.name === 'Bone')?.price;
    const pc2BL = pc2.variants?.find(v => v.name === 'Boneless')?.price;
    console.log(`  * Entry 1 (Row ${pc1.sourceRowIndex}): Bone=₹${pc1B}, Boneless=₹${pc1BL} [Markdown: 250/275]`);
    console.log(`  * Entry 2 (Row ${pc2.sourceRowIndex}): Bone=₹${pc2B}, Boneless=₹${pc2BL} [Markdown: 270/310] (Notes: "${pc2.verificationNotes}")`);
    if (pc1B !== 250 || pc1BL !== 275) errors.push(`Pepper Chicken Entry 1 price mismatch: expected 250/275, got ${pc1B}/${pc1BL}`);
    if (pc2B !== 270 || pc2BL !== 310) errors.push(`Pepper Chicken Entry 2 price mismatch: expected 270/310, got ${pc2B}/${pc2BL}`);
  }

  // 9. Duplicate Dish Identification (Ensuring no silent merging)
  console.log('\n--- Duplicate-Looking Dish Names Integrity ---');
  const nameMap = {};
  for (const it of items) {
    const norm = it.nameEnglish.trim().toLowerCase();
    if (!nameMap[norm]) nameMap[norm] = [];
    nameMap[norm].push(it);
  }
  let duplicateCount = 0;
  for (const [name, rows] of Object.entries(nameMap)) {
    if (rows.length > 1) {
      duplicateCount++;
      console.log(`- Dish "${name}" appears in ${rows.length} separate rows:`);
      for (const r of rows) {
        console.log(`  * Row ${r.sourceRowIndex} (Section ${r.sectionNumber}, ${r.categoryNameEnglish}): Base ₹${r.price}, Key: ${r.sourceMenuRowKey}, Published: ${r.isPublished}`);
      }
    }
  }
  console.log(`✅ All ${duplicateCount} multi-entry dish names are distinctly preserved with unique keys and row indices.`);

  // 10. Image Asset Review & Integrity
  console.log('\n--- Image Asset Review & Truth-in-Reporting Check ---');
  const imagesDir = path.resolve(__dirname, '../public/images/menu');
  let photoCount = 0;
  let illustrationCount = 0;
  let proprietaryCount = 0;

  for (const it of items) {
    const filename = (it.imageUrl || '').replace('/images/menu/', '');
    if (!filename) {
      errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) is missing imageUrl`);
      continue;
    }

    const diskPath = path.join(imagesDir, filename);
    if (!fs.existsSync(diskPath)) {
      errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) asset file missing on disk: ${diskPath}`);
      continue;
    }

    const stat = fs.statSync(diskPath);
    if (stat.size === 0) {
      errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) asset file is 0 bytes: ${diskPath}`);
      continue;
    }

    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg') {
      photoCount++;
      if (it.imageStatus !== 'VERIFIED_PHOTOGRAPH') {
        errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) has .jpg asset but imageStatus is "${it.imageStatus}"`);
      }
    } else if (ext === '.svg') {
      if (it.imageStatus === 'VERIFIED_PHOTOGRAPH') {
        errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) has .svg asset but is falsely labeled as VERIFIED_PHOTOGRAPH`);
      }
      if (it.needsVerification) {
        proprietaryCount++;
        if (it.imageStatus !== 'PROPRIETARY_REFERENCE_ILLUSTRATION') {
          errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) needs verification but imageStatus is not PROPRIETARY_REFERENCE_ILLUSTRATION`);
        }
      } else {
        illustrationCount++;
        if (it.imageStatus !== 'AUTHENTIC_ILLUSTRATIVE_ARTWORK') {
          errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) is clear item but imageStatus is not AUTHENTIC_ILLUSTRATIVE_ARTWORK`);
        }
      }
    } else {
      errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) has unknown asset extension: ${ext}`);
    }

    // Safety rule: if needsVerification is true, item MUST NOT be published
    if (it.needsVerification && it.isPublished) {
      errors.push(`Row ${it.sourceRowIndex} (${it.nameEnglish}) requires verification (needsVerification=true) but is marked isPublished=true! Must be draft.`);
    }
  }

  console.log(`- Verified Real Photographs (.jpg): ${photoCount}`);
  console.log(`- Authentic Illustrative Artwork (.svg): ${illustrationCount}`);
  console.log(`- Proprietary Reference Illustrations (.svg): ${proprietaryCount}`);
  console.log(`- Total On-Disk Loadable Assets: ${photoCount + illustrationCount + proprietaryCount} / 96`);

  // Summary & Exit code
  console.log('\n====================================================');
  if (errors.length > 0) {
    console.error(`❌ VALIDATION FAILED WITH ${errors.length} ERROR(S):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    console.log('====================================================\n');
    process.exit(1);
  } else {
    console.log('✅ ALL MENU VALIDATION INTEGRITY CHECKS PASSED PERFECTLY (0 ERRORS)!');
    console.log('====================================================\n');
  }
}

if (require.main === module) {
  runValidation();
}

module.exports = runValidation;
