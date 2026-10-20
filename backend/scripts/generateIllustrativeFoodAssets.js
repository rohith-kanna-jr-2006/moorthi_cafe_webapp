const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../public/images/menu');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createDishSvg({ englishName, tamilName, category, themeColor, accentColor, iconType, isProprietary = false }) {
  const badgeText = isProprietary ? 'REPRESENTATIVE REFERENCE — PROPRIETARY RECIPE' : 'AUTHENTIC CHIDAMBARAM SPECIALTY';
  const badgeBg = isProprietary ? '#B45309' : '#15803D';

  let culinaryGraphic = '';
  switch (iconType) {
    case 'curry':
      culinaryGraphic = `
        <!-- Clay Pot Curry Graphic -->
        <ellipse cx="400" cy="340" rx="180" ry="100" fill="#291206" />
        <ellipse cx="400" cy="330" rx="160" ry="85" fill="${themeColor}" />
        <ellipse cx="400" cy="325" rx="130" ry="65" fill="${accentColor}" opacity="0.8" />
        <!-- Spiced gravy swirls & garnish -->
        <circle cx="370" cy="315" r="28" fill="#581C0C" />
        <circle cx="430" cy="330" r="32" fill="#581C0C" />
        <circle cx="400" cy="320" r="24" fill="#3E1107" />
        <!-- Fresh coriander/curry leaf flakes -->
        <path d="M 390 290 Q 400 280 410 290 Q 405 300 390 290 Z" fill="#22C55E" />
        <path d="M 420 310 Q 430 300 440 310 Q 435 320 420 310 Z" fill="#16A34A" />
        <!-- Steam plumes -->
        <path d="M 370 230 Q 360 200 380 180" stroke="#FFF" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round" />
        <path d="M 410 220 Q 420 190 400 170" stroke="#FFF" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round" />
        <path d="M 440 235 Q 450 205 430 185" stroke="#FFF" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round" />
      `;
      break;

    case 'dry_fry':
      culinaryGraphic = `
        <!-- Iron Kadai / Skillet Fry Graphic -->
        <ellipse cx="400" cy="345" rx="190" ry="105" fill="#18181B" />
        <ellipse cx="400" cy="335" rx="170" ry="90" fill="#27272A" />
        <ellipse cx="400" cy="330" rx="145" ry="75" fill="${themeColor}" />
        <!-- Fried morsels with curry leaves and onions -->
        <rect x="330" y="295" width="45" height="40" rx="12" fill="#7C2D12" transform="rotate(-15 350 315)" />
        <rect x="390" y="290" width="50" height="42" rx="14" fill="#991B1B" transform="rotate(10 415 310)" />
        <rect x="420" y="320" width="48" height="38" rx="12" fill="#7C2D12" transform="rotate(-8 440 335)" />
        <rect x="350" y="325" width="45" height="40" rx="12" fill="#9A3412" transform="rotate(18 370 345)" />
        <!-- Green chillies & curry leaves -->
        <path d="M 360 280 Q 380 270 375 295" stroke="#16A34A" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 430 285 Q 450 275 445 300" stroke="#15803D" stroke-width="8" fill="none" stroke-linecap="round" />
        <!-- Lemon wedge -->
        <path d="M 460 330 A 25 25 0 0 1 485 355 L 460 355 Z" fill="#FACC15" />
      `;
      break;

    case 'rice':
      culinaryGraphic = `
        <!-- Ceramic / Brass Platter with Gilded Rice -->
        <ellipse cx="400" cy="340" rx="190" ry="100" fill="#B45309" />
        <ellipse cx="400" cy="332" rx="170" ry="85" fill="#D97706" />
        <ellipse cx="400" cy="325" rx="150" ry="70" fill="${themeColor}" />
        <!-- Grains, saffron variegation & garnish -->
        <ellipse cx="400" cy="315" rx="120" ry="55" fill="${accentColor}" opacity="0.85" />
        <circle cx="360" cy="310" r="16" fill="#F59E0B" />
        <circle cx="430" cy="320" r="14" fill="#B45309" />
        <!-- Garnish & crispy onions -->
        <line x1="370" y1="290" x2="400" y2="305" stroke="#78350F" stroke-width="5" stroke-linecap="round" />
        <line x1="410" y1="285" x2="435" y2="295" stroke="#78350F" stroke-width="5" stroke-linecap="round" />
        <path d="M 395 280 Q 405 270 415 280 Q 410 290 395 280 Z" fill="#16A34A" />
      `;
      break;

    case 'bread':
      culinaryGraphic = `
        <!-- Banana Leaf with Flaky Parotta / Breads -->
        <path d="M 180 340 C 220 220 580 220 620 340 C 580 460 220 460 180 340 Z" fill="#15803D" />
        <!-- Layered flaky golden disc -->
        <ellipse cx="380" cy="335" rx="130" ry="75" fill="#D97706" />
        <ellipse cx="380" cy="330" rx="115" ry="65" fill="#FDE68A" />
        <circle cx="380" cy="330" r="45" fill="none" stroke="#B45309" stroke-width="6" opacity="0.7" />
        <circle cx="380" cy="330" r="25" fill="none" stroke="#B45309" stroke-width="5" opacity="0.6" />
        <!-- Salna bowl on the side -->
        <circle cx="490" cy="310" r="42" fill="#3E1107" />
        <circle cx="490" cy="310" r="36" fill="${themeColor}" />
      `;
      break;

    case 'dosa':
      culinaryGraphic = `
        <!-- Plantain Leaf with Crisp Dosa Cone & Chutneys -->
        <path d="M 170 345 C 210 230 590 230 630 345 C 590 460 210 460 170 345 Z" fill="#16A34A" />
        <!-- Golden crisp cone dosa -->
        <polygon points="400,190 300,360 480,360" fill="#F59E0B" />
        <polygon points="400,190 320,355 460,355" fill="#FEF08A" />
        <polygon points="400,190 340,350 440,350" fill="#FBBF24" opacity="0.8" />
        <!-- Chutney Katoris -->
        <circle cx="280" cy="365" r="24" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4" />
        <circle cx="330" cy="385" r="22" fill="#EF4444" stroke="#94A3B8" stroke-width="4" />
        <circle cx="490" cy="375" r="26" fill="#D97706" stroke="#94A3B8" stroke-width="4" />
      `;
      break;

    case 'noodles':
      culinaryGraphic = `
        <!-- Steaming Wok / Bowl of Stir-Fried Noodles -->
        <ellipse cx="400" cy="350" rx="180" ry="90" fill="#18181B" />
        <ellipse cx="400" cy="340" rx="160" ry="75" fill="#27272A" />
        <ellipse cx="400" cy="335" rx="135" ry="60" fill="${themeColor}" />
        <!-- Tangled noodle strands -->
        <path d="M 310 320 Q 350 300 390 330 T 470 320" stroke="#FDE047" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 330 335 Q 380 320 430 345 T 480 330" stroke="#FEF08A" stroke-width="7" fill="none" stroke-linecap="round" />
        <path d="M 340 310 Q 390 340 450 315" stroke="#FACC15" stroke-width="8" fill="none" stroke-linecap="round" />
        <!-- Veggie shreds (capsicum, carrot, spring onion) -->
        <rect x="360" y="315" width="28" height="6" rx="3" fill="#EA580C" transform="rotate(25 370 318)" />
        <rect x="420" y="325" width="26" height="6" rx="3" fill="#16A34A" transform="rotate(-30 430 328)" />
      `;
      break;

    case 'egg':
      culinaryGraphic = `
        <!-- Cast Iron Skillet / Shallow Dish with Egg Specialty -->
        <ellipse cx="400" cy="345" rx="180" ry="95" fill="#1F2937" />
        <ellipse cx="400" cy="335" rx="155" ry="80" fill="#374151" />
        <ellipse cx="400" cy="330" rx="130" ry="65" fill="${themeColor}" />
        <!-- Fluffy spiced egg omelette/podimas base -->
        <ellipse cx="400" cy="325" rx="100" ry="50" fill="#F59E0B" />
        <circle cx="370" cy="320" r="16" fill="#D97706" />
        <circle cx="420" cy="325" r="18" fill="#FDE68A" />
        <!-- Black pepper sprinkles & chopped chillies -->
        <circle cx="390" cy="310" r="3" fill="#111827" />
        <circle cx="410" cy="325" r="3" fill="#111827" />
        <circle cx="360" cy="330" r="3" fill="#111827" />
        <path d="M 380 315 Q 395 305 390 325" stroke="#15803D" stroke-width="5" fill="none" />
      `;
      break;

    case 'seafood':
      culinaryGraphic = `
        <!-- Sizzling Platter with Marinated Prawns -->
        <ellipse cx="400" cy="345" rx="180" ry="95" fill="#18181B" />
        <ellipse cx="400" cy="335" rx="155" ry="80" fill="#7C2D12" />
        <ellipse cx="400" cy="330" rx="135" ry="65" fill="${themeColor}" />
        <!-- Curved golden spicy prawns -->
        <path d="M 330 310 C 340 280 380 290 375 325 C 370 340 345 340 335 325 Z" fill="#EA580C" />
        <path d="M 390 300 C 400 270 440 280 435 315 C 430 330 405 330 395 315 Z" fill="#DC2626" />
        <path d="M 420 320 C 430 290 470 300 465 335 C 460 350 435 350 425 335 Z" fill="#EA580C" />
        <!-- Crisp curry leaves & lime -->
        <path d="M 370 330 Q 390 320 385 345" stroke="#15803D" stroke-width="6" fill="none" stroke-linecap="round" />
        <circle cx="470" cy="345" r="14" fill="#FACC15" />
      `;
      break;

    default:
      culinaryGraphic = `
        <!-- Traditional Stainless Steel Thali Platter -->
        <ellipse cx="400" cy="340" rx="180" ry="95" fill="#64748B" />
        <ellipse cx="400" cy="332" rx="160" ry="80" fill="#94A3B8" />
        <ellipse cx="400" cy="325" rx="140" ry="65" fill="${themeColor}" />
        <circle cx="400" cy="325" r="45" fill="${accentColor}" opacity="0.8" />
      `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1C1917" />
      <stop offset="100%" stop-color="#0C0A09" />
    </linearGradient>
    <radialGradient id="plateGlow" cx="50%" cy="55%" r="45%">
      <stop offset="0%" stop-color="${themeColor}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#0C0A09" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="600" fill="url(#bgGrad)" />
  <circle cx="400" cy="340" r="280" fill="url(#plateGlow)" />

  <!-- Restaurant Header Ribbon -->
  <rect x="0" y="0" width="800" height="64" fill="#18181B" opacity="0.9" />
  <rect x="0" y="62" width="800" height="3" fill="#D97706" />
  <text x="40" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#F59E0B" letter-spacing="1.5">HOTEL NEW MOORTHI CAFE</text>
  <text x="760" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#A1A1AA" text-anchor="end">CHIDAMBARAM — SINCE HERITAGE</text>

  <!-- Dish Graphic -->
  <g filter="url(#shadow)">
    ${culinaryGraphic}
  </g>

  <!-- Title & Metadata Card -->
  <rect x="40" y="450" width="720" height="115" rx="16" fill="#18181B" opacity="0.95" stroke="#27272A" stroke-width="2" />
  
  <!-- Status Badge -->
  <rect x="60" y="468" width="${isProprietary ? '380' : '310'}" height="24" rx="6" fill="${badgeBg}" />
  <text x="70" y="484" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">${badgeText}</text>
  
  <!-- Category tag -->
  <text x="740" y="484" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#D97706" text-anchor="end">${category}</text>

  <!-- Tamil & English Names -->
  <text x="60" y="525" font-family="system-ui, -apple-system, 'Noto Sans Tamil', sans-serif" font-size="24" font-weight="700" fill="#F43F5E">${tamilName}</text>
  <text x="60" y="552" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#F4F4F5">${englishName}</text>
</svg>`;
}

// Map each distinct dish name to its styling definition
const DISH_SPECS = {
  // Chicken dishes
  'Chicken Fry': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'dry_fry' },
  'Chilli Chicken': { themeColor: '#DC2626', accentColor: '#991B1B', iconType: 'dry_fry' },
  'Chicken 74': { themeColor: '#B91C1C', accentColor: '#7F1D1D', iconType: 'dry_fry', isProprietary: true },
  'Chicken 88': { themeColor: '#B91C1C', accentColor: '#7F1D1D', iconType: 'dry_fry', isProprietary: true },
  'Chicken Tikka': { themeColor: '#EA580C', accentColor: '#C2410C', iconType: 'dry_fry' },
  'Chicken 007': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'dry_fry', isProprietary: true },
  'Pepper Chicken': { themeColor: '#451A03', accentColor: '#291206', iconType: 'dry_fry' },
  'Chicken Lollipop': { themeColor: '#C2410C', accentColor: '#9A3412', iconType: 'dry_fry' },
  'Hyderabadi Chicken': { themeColor: '#78350F', accentColor: '#92400E', iconType: 'curry' },
  'Chicken Manchurian': { themeColor: '#831843', accentColor: '#500724', iconType: 'curry' },
  'Chicken Keema Pyara / Keema Pira': { themeColor: '#7F1D1D', accentColor: '#581C0C', iconType: 'curry', isProprietary: true },
  'Dragon Chicken Tikka': { themeColor: '#B91C1C', accentColor: '#991B1B', iconType: 'dry_fry', isProprietary: true },
  'Chicken Gravy': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },
  'Manchurian Gravy': { themeColor: '#701A75', accentColor: '#4A044E', iconType: 'curry' },
  'Butter Chicken': { themeColor: '#EA580C', accentColor: '#F97316', iconType: 'curry' },
  'Ginger Chicken': { themeColor: '#B45309', accentColor: '#92400E', iconType: 'curry' },
  'Garlic Chicken': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },
  'Chettinad Chicken': { themeColor: '#3E1107', accentColor: '#581C0C', iconType: 'curry' },
  'Chicken Kadai': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'curry' },
  'Rex Masala Chicken': { themeColor: '#7F1D1D', accentColor: '#450A0A', iconType: 'curry', isProprietary: true },
  'Masala Chicken': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },

  // Biryani & Rice
  'Egg Biryani': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'rice' },
  'Kuska': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'rice' },
  'Chicken Pyara Rice / Pira Rice': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'rice', isProprietary: true },
  'Egg Pyara Rice / Pira Rice': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'rice', isProprietary: true },
  'Veg Pyara Rice / Pira Rice': { themeColor: '#15803D', accentColor: '#16A34A', iconType: 'rice', isProprietary: true },
  'Veg Pulao': { themeColor: '#15803D', accentColor: '#22C55E', iconType: 'rice' },

  // Parotta & Breads
  'Bun Parotta': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'bread' },
  'Nool Parotta': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread' },
  'Kothu Parotta': { themeColor: '#9A3412', accentColor: '#B45309', iconType: 'bread' },
  'Special Parotta': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'bread' },
  'Plain Lappa': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'bread', isProprietary: true },
  'Special Plain Lappa': { themeColor: '#B45309', accentColor: '#D97706', iconType: 'bread', isProprietary: true },
  'Veechu Parotta': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'bread' },
  'Egg Lappa': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread' },
  'Special Egg Lappa': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread' },
  'Onion Egg Lappa': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread', isProprietary: true },
  'Egg Parotta': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread' },
  'Chilli Parotta': { themeColor: '#DC2626', accentColor: '#B91C1C', iconType: 'bread' },
  'Chicken Egg Lappa': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'bread', isProprietary: true },
  'Egg Veechu Parotta': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'bread' },
  'Ghee Parotta': { themeColor: '#F59E0B', accentColor: '#FDE68A', iconType: 'bread' },

  // Specials
  'Tomato Chutney': { themeColor: '#DC2626', accentColor: '#991B1B', iconType: 'curry' },
  'Chicken Sukka': { themeColor: '#7C2D12', accentColor: '#451A03', iconType: 'dry_fry' },
  'Chicken Onion Roast': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'dry_fry' },
  'Chicken Pepper Roast': { themeColor: '#291206', accentColor: '#18181B', iconType: 'dry_fry' },
  'Egg Salna': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },

  // Noodles
  'Chicken “Noodles” / Chicken Noodles': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'noodles' },
  'Chicken Noodles': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'noodles' },
  'Egg Noodles': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'noodles' },
  'Veg Noodles': { themeColor: '#15803D', accentColor: '#16A34A', iconType: 'noodles' },

  // Seafood
  'Chilli Prawn Fry': { themeColor: '#DC2626', accentColor: '#991B1B', iconType: 'seafood' },
  'Prawn Fry': { themeColor: '#EA580C', accentColor: '#9A3412', iconType: 'seafood' },
  'Prawn 65': { themeColor: '#DC2626', accentColor: '#991B1B', iconType: 'seafood' },
  'Prawn Masala': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'seafood' },
  'Chilli Prawn Gravy': { themeColor: '#991B1B', accentColor: '#7C2D12', iconType: 'seafood' },

  // Veg & Gravies
  'Gobi Manchurian Fry': { themeColor: '#831843', accentColor: '#500724', iconType: 'dry_fry' },
  'Gobi Manchurian Gravy': { themeColor: '#701A75', accentColor: '#4A044E', iconType: 'curry' },
  'Gobi 65': { themeColor: '#DC2626', accentColor: '#991B1B', iconType: 'dry_fry' },
  'Gobi Masala': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },
  'Paneer Butter Masala': { themeColor: '#EA580C', accentColor: '#F97316', iconType: 'curry' },
  'Kebab Paneer': { themeColor: '#D97706', accentColor: '#B45309', iconType: 'dry_fry', isProprietary: true },

  // Mutton & Egg
  'Mutton Payirchi / Mutton Fry (uncertain)': { themeColor: '#451A03', accentColor: '#291206', iconType: 'dry_fry', isProprietary: true },
  'Mutton Masala': { themeColor: '#78350F', accentColor: '#451A03', iconType: 'curry' },
  'Mutton Curry': { themeColor: '#451A03', accentColor: '#291206', iconType: 'curry' },
  'Boiled Egg': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'egg' },
  'Omelette': { themeColor: '#F59E0B', accentColor: '#D97706', iconType: 'egg' },
  'Omelette (alternate printed spelling)': { themeColor: '#F59E0B', accentColor: '#D97706', iconType: 'egg', isProprietary: true },
  'Basil Omelette (uncertain reading)': { themeColor: '#15803D', accentColor: '#16A34A', iconType: 'egg', isProprietary: true },
  'Basil Omelette (uncertain)': { themeColor: '#15803D', accentColor: '#16A34A', iconType: 'egg', isProprietary: true },
  'Egg Podimas': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'egg' },
  'Kalakki': { themeColor: '#D97706', accentColor: '#B45309', iconType: 'egg' },
  'Fried Egg / Egg Fry': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'egg' },
  'Egg Masala': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },
  'Egg Curry': { themeColor: '#9A3412', accentColor: '#7C2D12', iconType: 'curry' },

  // Dosa Items
  'Kal Dosa': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'dosa' },
  'Onion Dosa': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'dosa' },
  'Roast': { themeColor: '#F59E0B', accentColor: '#FEF08A', iconType: 'dosa' },
  'Egg Dosa': { themeColor: '#D97706', accentColor: '#F59E0B', iconType: 'dosa' },
  'Uthappam': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'dosa' },
  'Onion Uthappam': { themeColor: '#D97706', accentColor: '#FDE68A', iconType: 'dosa' },

  // Salna & Sides
  'Cup of Onion': { themeColor: '#71717A', accentColor: '#A1A1AA', iconType: 'curry' },
  'Onion Raita': { themeColor: '#E4E4E7', accentColor: '#F4F4F5', iconType: 'curry' },
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function generateAllAssets() {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'menuImportData.json'), 'utf-8'));
  let generated = 0;

  for (const item of data.items) {
    const dishName = item.nameEnglish.trim();
    // Skip dishes that already have a real photorealistic JPG
    if (['Chicken 65', 'Chicken Biryani', 'Parotta', 'Dosa', 'Chicken Kothu Parotta'].includes(dishName)) {
      continue;
    }

    const cleanSlug = slugify(dishName);
    const filename = `${cleanSlug}.svg`;
    const targetFile = path.join(outputDir, filename);

    const spec = DISH_SPECS[dishName] || {
      themeColor: '#B45309',
      accentColor: '#D97706',
      iconType: 'curry',
      isProprietary: item.needsVerification,
    };

    const svgContent = createDishSvg({
      englishName: item.nameEnglish,
      tamilName: item.nameTamil,
      category: item.categoryNameEnglish,
      themeColor: spec.themeColor,
      accentColor: spec.accentColor,
      iconType: spec.iconType,
      isProprietary: spec.isProprietary || item.needsVerification,
    });

    fs.writeFileSync(targetFile, svgContent, 'utf-8');
    generated++;
  }

  console.log(`Successfully generated ${generated} dedicated, dish-tailored SVG food assets in ${outputDir}`);
}

if (require.main === module) {
  generateAllAssets();
}

module.exports = { generateAllAssets, DISH_SPECS };
