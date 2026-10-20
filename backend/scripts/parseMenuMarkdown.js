const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseMenuMarkdown() {
  const possiblePaths = [
    path.resolve(__dirname, '../../docs/moorthy_cafe_menu_extracted.md'),
    path.resolve(__dirname, '../docs/moorthy_cafe_menu_extracted.md'),
  ];

  let filePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    throw new Error('moorthy_cafe_menu_extracted.md not found in expected locations!');
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const sectionsConfig = {
    1: { slug: 'chicken-dishes', nameTamil: 'சிக்கன் வகைகள்', nameEnglish: 'Chicken Dishes', isVegDefault: false },
    2: { slug: 'biryani-rice', nameTamil: 'பிரியாணி / அரிசி வகைகள்', nameEnglish: 'Biryani & Rice', isVegDefault: false },
    3: { slug: 'parotta-items', nameTamil: 'பரோட்டா வகைகள்', nameEnglish: 'Parotta & Breads', isVegDefault: true },
    4: { slug: 'nmc-specials', nameTamil: 'NMC ஸ்பெஷல்', nameEnglish: 'NMC Special Items', isVegDefault: false },
    5: { slug: 'grill-items', nameTamil: 'கிரில் வகைகள்', nameEnglish: 'Grill Items', isVegDefault: false },
    6: { slug: 'tandoori-seafood', nameTamil: 'தந்தூரி', nameEnglish: 'Tandoori & Seafood', isVegDefault: false },
    7: { slug: 'gravies-curries', nameTamil: 'வெஜ் / கிரேவி வகைகள்', nameEnglish: 'Veg & Non-Veg Gravies', isVegDefault: true },
    8: { slug: 'mutton-egg', nameTamil: 'மட்டன் வகைகள்', nameEnglish: 'Mutton & Egg Dishes', isVegDefault: false },
    9: { slug: 'dosa-items', nameTamil: 'தோசை வகைகள்', nameEnglish: 'Dosa Items', isVegDefault: true },
    10: { slug: 'salna-sides', nameTamil: 'சால்னா / சைட்ஸ்', nameEnglish: 'Salna, Sides & Extras', isVegDefault: true },
    11: { slug: 'rice-noodles-mains', nameTamil: 'Page 2 Mains & Varieties', nameEnglish: 'Rice, Noodles & Sides', isVegDefault: false },
  };

  let currentSectionNum = null;
  const parsedItems = [];
  let totalTableRowsFound = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for Section Heading: e.g. "## 1. Chicken dishes — சிக்கன் வகைகள்"
    const sectionMatch = line.match(/^##\s+(\d+)\.\s+(.*)$/);
    if (sectionMatch) {
      currentSectionNum = parseInt(sectionMatch[1], 10);
      continue;
    }

    // Skip non-table lines, table header line, and separator line
    if (!line.startsWith('|')) continue;
    if (line.includes('Tamil name') || line.includes('---|')) continue;

    // Parse Markdown table row
    // Remove leading and trailing pipe
    const rawCells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (rawCells.length < 3) continue;

    totalTableRowsFound++;
    const rowIdx = totalTableRowsFound;

    let tamilName = '';
    let englishName = '';
    let bonePrice = null;
    let bonelessPrice = null;
    let singlePrice = null;
    let notes = '';

    if (currentSectionNum === 1) {
      // 5 columns: Tamil | English | Bone | Boneless | Notes
      tamilName = rawCells[0] || '';
      englishName = rawCells[1] || '';
      const boneStr = rawCells[2] ? rawCells[2].replace(/[₹,\s]/g, '') : '';
      const bonelessStr = rawCells[3] ? rawCells[3].replace(/[₹,\s]/g, '') : '';
      notes = rawCells[4] || '';

      if (boneStr && boneStr !== '—' && !isNaN(parseInt(boneStr, 10))) {
        bonePrice = parseInt(boneStr, 10);
      }
      if (bonelessStr && bonelessStr !== '—' && !isNaN(parseInt(bonelessStr, 10))) {
        bonelessPrice = parseInt(bonelessStr, 10);
      }
    } else {
      // 4 columns: Tamil | English | Price | Notes
      tamilName = rawCells[0] || '';
      englishName = rawCells[1] || '';
      const priceStr = rawCells[2] ? rawCells[2].replace(/[₹,\s]/g, '') : '';
      notes = rawCells[3] || '';

      if (priceStr && priceStr !== '—' && !isNaN(parseInt(priceStr, 10))) {
        singlePrice = parseInt(priceStr, 10);
      }
    }

    const secCfg = sectionsConfig[currentSectionNum] || {
      slug: `section-${currentSectionNum}`,
      nameTamil: `Section ${currentSectionNum}`,
      nameEnglish: `Section ${currentSectionNum}`,
      isVegDefault: false,
    };

    // Determine veg/non-veg status
    let isVeg = secCfg.isVegDefault;
    const lowerName = englishName.toLowerCase();
    if (lowerName.includes('chicken') || lowerName.includes('mutton') || lowerName.includes('egg') || lowerName.includes('prawn') || lowerName.includes('omelette') || lowerName.includes('kalakki') || lowerName.includes('podimas')) {
      isVeg = false;
    } else if (lowerName.includes('gobi') || lowerName.includes('paneer') || lowerName.includes('veg') || lowerName.includes('dosa') || lowerName.includes('parotta') || lowerName.includes('onion') || lowerName.includes('tomato') || lowerName.includes('roast') || lowerName.includes('uthappam') || lowerName.includes('kuska')) {
      isVeg = true;
    }
    // Specific non-veg parotta check
    if (lowerName.includes('chicken') || lowerName.includes('egg')) {
      isVeg = false;
    }

    // Proprietary code dishes or recipe items with secret/unclear cafe preparations
    const isProprietarySecret = ['chicken 74', 'chicken 88', 'chicken 007'].includes(lowerName);

    // Determine needsVerification: check notes, englishName, and tamilName
    const combinedText = `${notes} ${englishName} ${tamilName}`.toLowerCase();
    const hasVerifyKeyword = combinedText.includes('verif') || 
                             combinedText.includes('uncertain') || 
                             combinedText.includes('unclear') ||
                             combinedText.includes('ambiguous') ||
                             combinedText.includes('repeated') ||
                             combinedText.includes('obscure') ||
                             isProprietarySecret;
    const needsVerification = hasVerifyKeyword;
    const isPublished = !needsVerification;
    const finalNotes = isProprietarySecret && !notes.toLowerCase().includes('verify')
      ? (notes ? `${notes}; Proprietary recipe code — verify exact cafe preparation` : 'Proprietary recipe code — verify exact cafe preparation')
      : notes;

    // Build variants & primary price
    const variants = [];
    let basePrice = 0;

    if (currentSectionNum === 1) {
      if (bonePrice !== null && bonelessPrice !== null) {
        basePrice = bonePrice;
        variants.push({
          name: 'Bone',
          price: bonePrice,
          pricePaise: bonePrice * 100,
          isAvailable: true,
          sku: `SKU-S01-R${String(rowIdx).padStart(2, '0')}-BONE`,
        });
        variants.push({
          name: 'Boneless',
          price: bonelessPrice,
          pricePaise: bonelessPrice * 100,
          isAvailable: true,
          sku: `SKU-S01-R${String(rowIdx).padStart(2, '0')}-BONELESS`,
        });
      } else if (bonePrice !== null) {
        basePrice = bonePrice;
        variants.push({
          name: 'Standard (Bone)',
          price: bonePrice,
          pricePaise: bonePrice * 100,
          isAvailable: true,
          sku: `SKU-S01-R${String(rowIdx).padStart(2, '0')}-STD`,
        });
      } else if (bonelessPrice !== null) {
        basePrice = bonelessPrice;
        variants.push({
          name: 'Boneless',
          price: bonelessPrice,
          pricePaise: bonelessPrice * 100,
          isAvailable: true,
          sku: `SKU-S01-R${String(rowIdx).padStart(2, '0')}-BONELESS`,
        });
      }
    } else {
      basePrice = singlePrice || 0;
      variants.push({
        name: 'Standard Serving',
        price: basePrice,
        pricePaise: basePrice * 100,
        isAvailable: true,
        sku: `SKU-S${String(currentSectionNum).padStart(2, '0')}-R${String(rowIdx).padStart(2, '0')}-STD`,
      });
    }

    // Generate unique stable sourceMenuRowKey
    const cleanEnglishSlug = slugify(englishName || 'dish');
    const sourceMenuRowKey = `row_s${String(currentSectionNum).padStart(2, '0')}_${String(rowIdx).padStart(2, '0')}_${cleanEnglishSlug}`;

    // Generate stable dish slug
    const slug = `${cleanEnglishSlug}-${rowIdx}`;

    parsedItems.push({
      sourceRowIndex: rowIdx,
      sourceMenuRowKey,
      slug,
      sectionNumber: currentSectionNum,
      categorySlug: secCfg.slug,
      categoryNameEnglish: secCfg.nameEnglish,
      categoryNameTamil: secCfg.nameTamil,
      nameTamil: tamilName,
      nameEnglish: englishName,
      name: englishName,
      price: basePrice,
      pricePaise: basePrice * 100,
      variants,
      isVeg,
      isAvailable: true,
      isPublished,
      needsVerification,
      verificationNotes: finalNotes,
      portion: 'Standard Serving',
      prepTimeMinutes: isVeg ? 10 : 15,
      tags: [secCfg.slug, isVeg ? 'vegetarian' : 'non-vegetarian'],
    });
  }

  return {
    totalTableRowsFound,
    parsedCount: parsedItems.length,
    items: parsedItems,
    sections: sectionsConfig,
  };
}

if (require.main === module) {
  const result = parseMenuMarkdown();
  console.log(`Parsed ${result.parsedCount} rows from Markdown (Found: ${result.totalTableRowsFound}).`);
  const verifyCount = result.items.filter(i => i.needsVerification).length;
  const publishedCount = result.items.filter(i => i.isPublished).length;
  console.log(`Published (Verified): ${publishedCount}, Draft (Needs Verification): ${verifyCount}`);

  const outputPath = path.resolve(__dirname, 'menuImportData.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Structured menu import data written to: ${outputPath}`);
}

module.exports = parseMenuMarkdown;
