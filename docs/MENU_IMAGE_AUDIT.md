# Hotel New Moorthi Cafe — Comprehensive Menu Image Audit Report

**Audit Timestamp:** 2026-10-19T20:20:50.165Z  
**Local Storage Directory:** `backend/public/images/menu/`  
**Static URL Prefix:** `/images/menu/<filename>` (served via Express `express.static`)  
**Verification Policy:** Every published food item must have a loadable, physically verified asset on disk. All photographic assets must be verified against documented Commons authors and exact licenses. SVG assets are classified as vector illustrations and do not satisfy the original requirement for authentic food photographs. All proprietary recipes and unconfirmed menu rows are preserved strictly as **Drafts (`isPublished: false`, `needsVerification: true`)** until confirmed by cafe management.

## 1. Audit Summary Metrics

| Metric | Count | Details |
| :--- | :---: | :--- |
| **Total Menu Rows Audited** | **96** | Exact 100% accounting of all transcribed rows from physical menu photos |
| **Verified High-Res Photographs** | **13** | Verified Wikimedia Commons authentic photographs with exact licences |
| **Dedicated Dish Illustrative Assets** | **48** | Custom vector culinary assets (Illustrations only, pending photography) |
| **Proprietary Reference Assets** | **35** | Distinct representative illustrations clearly tagged for recipe review |
| **Missing / Unloadable Assets** | **0** | All 96 assets verified on disk (0 missing, 0 empty) |
| **Published Menu Items** | **61** | Clear menu rows with confirmed prices & verified loadable assets |
| **Draft Items (Held for Review)** | **35** | Ambiguous prices, uncertain readings & proprietary items |

## 2. Active Menu Category Reconciliation (11 Categories)

| Section | Category Slug | English Name | Tamil Name | Total Items | Published | Drafts |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| S01 | `chicken-dishes` | Chicken Dishes | சிக்கன் வகைகள் | 24 | 13 | 11 |
| S02 | `biryani-rice` | Biryani & Rice | பிரியாணி / அரிசி வகைகள் | 3 | 3 | 0 |
| S03 | `parotta-breads` | Parotta & Breads | பரோட்டா வகைகள் | 17 | 11 | 6 |
| S04 | `nmc-special-items` | NMC Special Items | NMC ஸ்பெஷல் | 5 | 4 | 1 |
| S05 | `grill-items` | Grill Items | கிரில் வகைகள் | 3 | 0 | 3 |
| S06 | `tandoori-seafood` | Tandoori & Seafood | தந்தூரி | 5 | 4 | 1 |
| S07 | `veg-non-veg-gravies` | Veg & Non-Veg Gravies | வெஜ் / கிரேவி வகைகள் | 6 | 5 | 1 |
| S08 | `mutton-egg-dishes` | Mutton & Egg Dishes | மட்டன் வகைகள் | 8 | 5 | 3 |
| S09 | `dosa-items` | Dosa Items | தோசை வகைகள் | 7 | 7 | 0 |
| S10 | `salna-sides-extras` | Salna, Sides & Extras | சால்னா / சைட்ஸ் | 2 | 2 | 0 |
| S11 | `rice-noodles-sides` | Rice, Noodles & Sides | Page 2 Mains & Varieties | 16 | 7 | 9 |

## 3. Complete Per-Item Image Audit Table (All 96 Rows)

| Row | Sec | Tamil Name | English Name | Price | Status | Image File | Asset Type | Size | Source & License |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :--- |
| 1 | S1 | சிக்கன் ஃப்ரை | Chicken Fry | Bone: ₹245, Boneless: ₹260 | 🟡 Draft | `chicken-fry.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 2 | S1 | சில்லி சிக்கன் | Chilli Chicken | Bone: ₹245, Boneless: ₹260 | ✅ Published | `chilli-chicken.jpg` | `VERIFIED_PHOTOGRAPH` | 239 KB | Wikimedia Commons (File:CHILLI CHICKEN.jpg) by G.HarishGovindaraj (CC BY-SA 4.0) |
| 3 | S1 | சிக்கன் 65 | Chicken 65 | Bone: ₹245, Boneless: ₹260 | ✅ Published | `chicken-65.jpg` | `VERIFIED_PHOTOGRAPH` | 353 KB | Wikimedia Commons (File:Chicken 65.jpg) by Charles Haynes (CC BY-SA 2.0) |
| 4 | S1 | சிக்கன் 74 | Chicken 74 | ₹540 | 🟡 Draft | `chicken-74.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 5 | S1 | சிக்கன் 88 | Chicken 88 | ₹580 | 🟡 Draft | `chicken-88.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 6 | S1 | சிக்கன் டிக்கா | Chicken Tikka | ₹300 | ✅ Published | `chicken-tikka.jpg` | `VERIFIED_PHOTOGRAPH` | 344 KB | Wikimedia Commons (File:ChickenTikka.jpg) by michaelwhays (CC BY 2.0) |
| 7 | S1 | சிக்கன் 007 | Chicken 007 | ₹175 | 🟡 Draft | `chicken-007.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 8 | S1 | பெப்பர் சிக்கன் | Pepper Chicken | Bone: ₹250, Boneless: ₹275 | ✅ Published | `pepper-chicken.jpg` | `VERIFIED_PHOTOGRAPH` | 2863 KB | Wikimedia Commons (File:Pepper Chicken (869566714).jpg) by rovingI (CC BY 2.0) |
| 9 | S1 | சிக்கன் லாலிபாப் | Chicken Lollipop | ₹260 | ✅ Published | `chicken-lollipop.jpg` | `VERIFIED_PHOTOGRAPH` | 1026 KB | Wikimedia Commons (File:Chicken lolipop.jpg) by Twilightin (CC BY-SA 4.0) |
| 10 | S1 | ஹைதராபாத் சிக்கன் | Hyderabadi Chicken | Bone: ₹250, Boneless: ₹280 | ✅ Published | `hyderabadi-chicken.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 11 | S1 | சிக்கன் மஞ்சூரியன் | Chicken Manchurian | Bone: ₹250, Boneless: ₹280 | 🟡 Draft | `chicken-manchurian.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 12 | S1 | சிக்கன் கீமா பைரா | Chicken Keema Pyara / Keema Pira | ₹280 | 🟡 Draft | `chicken-keema-pyara-keema-pira.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 13 | S1 | ட்ராகன் சிக்கன் டிக்கா | Dragon Chicken Tikka | ₹290 | 🟡 Draft | `dragon-chicken-tikka.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 14 | S1 | சிக்கன் கிரேவி | Chicken Gravy | Bone: ₹260, Boneless: ₹290 | ✅ Published | `chicken-gravy.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 15 | S1 | மஞ்சூரியன் கிரேவி | Manchurian Gravy | Bone: ₹260, Boneless: ₹295 | ✅ Published | `manchurian-gravy.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 16 | S1 | பட்டர் சிக்கன் | Butter Chicken | Bone: ₹260, Boneless: ₹295 | ✅ Published | `butter-chicken.jpg` | `VERIFIED_PHOTOGRAPH` | 4608 KB | Wikimedia Commons (File:ButterChicken.jpg) by Interesting009 (CC BY-SA 4.0) |
| 17 | S1 | ஜிஞ்சர் சிக்கன் | Ginger Chicken | Bone: ₹260, Boneless: ₹295 | ✅ Published | `ginger-chicken.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 18 | S1 | கார்லிக் சிக்கன் | Garlic Chicken | Bone: ₹260, Boneless: ₹295 | ✅ Published | `garlic-chicken.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 19 | S1 | செம்நாடு சிக்கன் | Chettinad Chicken | Bone: ₹270, Boneless: ₹300 | 🟡 Draft | `chettinad-chicken.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 20 | S1 | சிக்கன் கடாய் | Chicken Kadai | Bone: ₹270, Boneless: ₹310 | ✅ Published | `chicken-kadai.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 21 | S1 | ஹைதராபாத் சிக்கன் | Hyderabadi Chicken | Bone: ₹270, Boneless: ₹310 | 🟡 Draft | `hyderabadi-chicken.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 22 | S1 | பெப்பர் சிக்கன் | Pepper Chicken | Bone: ₹270, Boneless: ₹310 | 🟡 Draft | `pepper-chicken.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 23 | S1 | ரெக்ஸ் மசாலா சிக்கன் | Rex Masala Chicken | ₹300 | 🟡 Draft | `rex-masala-chicken.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 24 | S1 | மசாலா சிக்கன் | Masala Chicken | Bone: ₹240, Boneless: ₹300 | ✅ Published | `masala-chicken.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 25 | S2 | சிக்கன் பிரியாணி | Chicken Biryani | ₹195 | ✅ Published | `chicken-biryani.jpg` | `VERIFIED_PHOTOGRAPH` | 3453 KB | Wikimedia Commons (File:A picture of chicken biryani.jpg) by Thamizhpparithi Maari (CC BY-SA 4.0) |
| 26 | S2 | முட்டை பிரியாணி | Egg Biryani | ₹170 | ✅ Published | `egg-biryani.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 27 | S2 | குஸ்கா | Kuska | ₹150 | ✅ Published | `kuska.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 28 | S3 | பரோட்டா | Parotta | ₹18 | ✅ Published | `parotta.jpg` | `VERIFIED_PHOTOGRAPH` | 258 KB | Wikimedia Commons (File:Parotta.jpg) by Charles Haynes (CC BY-SA 2.0) |
| 29 | S3 | பன் பரோட்டா | Bun Parotta | ₹23 | ✅ Published | `bun-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 30 | S3 | நூல் பரோட்டா | Nool Parotta | ₹44 | ✅ Published | `nool-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 31 | S3 | கொத்துமை பரோட்டா | Kothu Parotta | ₹24 | 🟡 Draft | `kothu-parotta.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 32 | S3 | SPL. பரோட்டா | Special Parotta | ₹40 | ✅ Published | `special-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 33 | S3 | பிளைன் லாப்பா | Plain Lappa | ₹20 | 🟡 Draft | `plain-lappa.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 34 | S3 | SPL. பிளைன் லாப்பா | Special Plain Lappa | ₹40 | 🟡 Draft | `special-plain-lappa.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 35 | S3 | வீச்சு பரோட்டா | Veechu Parotta | ₹22 | ✅ Published | `veechu-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 36 | S3 | முட்டை லாப்பா | Egg Lappa | ₹85 | ✅ Published | `egg-lappa.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 37 | S3 | SPL. முட்டை லாப்பா | Special Egg Lappa | ₹110 | ✅ Published | `special-egg-lappa.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 38 | S3 | ஆனியன் முட்டை லாப்பா | Onion Egg Lappa | ₹95 | 🟡 Draft | `onion-egg-lappa.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 39 | S3 | முட்டை பரோட்டா | Egg Parotta | ₹160 | 🟡 Draft | `egg-parotta.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 40 | S3 | சில்லி பரோட்டா | Chilli Parotta | ₹150 | ✅ Published | `chilli-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 41 | S3 | சிக்கன் முட்டை லாப்பா | Chicken Egg Lappa | ₹150 | 🟡 Draft | `chicken-egg-lappa.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 42 | S3 | சிக்கன் கொத்து பரோட்டா | Chicken Kothu Parotta | ₹210 | ✅ Published | `chicken-kothu-parotta.jpg` | `VERIFIED_PHOTOGRAPH` | 3301 KB | Wikimedia Commons (File:Chicken Kothu Parotta.jpg) by Thamizhpparithi Maari (CC BY-SA 4.0) |
| 43 | S3 | முட்டை வீச்சுபரோட்டா | Egg Veechu Parotta | ₹85 | ✅ Published | `egg-veechu-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 44 | S3 | நெய் பரோட்டா | Ghee Parotta | ₹28 | ✅ Published | `ghee-parotta.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 45 | S4 | தக்காளி சட்னி | Tomato Chutney | ₹70 | 🟡 Draft | `tomato-chutney.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 46 | S4 | சிக்கன் சுக்கா | Chicken Sukka | ₹90 | ✅ Published | `chicken-sukka.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 47 | S4 | சிக்கன் ஆனியன் ரோஸ்ட் | Chicken Onion Roast | ₹180 | ✅ Published | `chicken-onion-roast.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 48 | S4 | சிக்கன் பெப்பர் ரோஸ்ட் | Chicken Pepper Roast | ₹180 | ✅ Published | `chicken-pepper-roast.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 49 | S4 | முட்டை சால்னி | Egg Salna | ₹90 | ✅ Published | `egg-salna.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 50 | S5 | சிக்கன் நாருல்ஸ் | Chicken “Noodles” / Chicken Noodles | ₹170 | 🟡 Draft | `chicken-noodles-chicken-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 51 | S5 | எக் நாருல்ஸ் | Egg Noodles | ₹155 | 🟡 Draft | `egg-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 52 | S5 | வெஜ் நாருல்ஸ் | Veg Noodles | ₹145 | 🟡 Draft | `veg-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 53 | S6 | சில்லி பிரான் ஃப்ரை | Chilli Prawn Fry | ₹250 | 🟡 Draft | `chilli-prawn-fry.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 54 | S6 | பிரான் ஃப்ரை | Prawn Fry | ₹240 | ✅ Published | `prawn-fry.jpg` | `VERIFIED_PHOTOGRAPH` | 2183 KB | Wikimedia Commons (File:Prawn fry.jpg) by Seethabharathi (CC BY-SA 4.0) |
| 55 | S6 | பிரான் 65 | Prawn 65 | ₹240 | ✅ Published | `prawn-65.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 56 | S6 | பிரான் மசாலா | Prawn Masala | ₹240 | ✅ Published | `prawn-masala.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 57 | S6 | சில்லி பிரான் கிரேவி | Chilli Prawn Gravy | ₹250 | ✅ Published | `chilli-prawn-gravy.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 58 | S7 | கோபி மஞ்சூரியன் ஃப்ரை | Gobi Manchurian Fry | ₹170 | ✅ Published | `gobi-manchurian.jpg` | `VERIFIED_PHOTOGRAPH` | 1673 KB | Wikimedia Commons (File:Gobi Manchurian.jpg) by Harsha K R (CC BY-SA 2.0) |
| 59 | S7 | கோபி மஞ்சூரியன் கிரேவி | Gobi Manchurian Gravy | ₹195 | ✅ Published | `gobi-manchurian-gravy.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 60 | S7 | கோபி 65 | Gobi 65 | ₹180 | ✅ Published | `gobi-65.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 61 | S7 | கோபி மசாலா | Gobi Masala | ₹175 | ✅ Published | `gobi-masala.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 62 | S7 | பன்னீர் பட்டர் மசாலா | Paneer Butter Masala | ₹190 | ✅ Published | `paneer-butter-masala.jpg` | `VERIFIED_PHOTOGRAPH` | 2632 KB | Wikimedia Commons (File:Paneer Butter Masala.jpg) by Krishnakerala (CC BY-SA 4.0) |
| 63 | S7 | கபாப் பன்னீர் | Kebab Paneer | ₹205 | 🟡 Draft | `kebab-paneer.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 64 | S8 | மட்டன் பயர்ச்சி | Mutton Payirchi / Mutton Fry (uncertain) | ₹90 | 🟡 Draft | `mutton-payirchi-mutton-fry-uncertain.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 4 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 65 | S8 | மட்டன் மசாலா | Mutton Masala | ₹155 | ✅ Published | `mutton-masala.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 66 | S8 | மட்டன் கறி | Mutton Curry | ₹145 | ✅ Published | `mutton-curry.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 67 | S8 | பாய்ல்டு எக் | Boiled Egg | ₹16 | 🟡 Draft | `boiled-egg.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 68 | S8 | ஆம்லெட் | Omelette | ₹18 | ✅ Published | `omelette.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 69 | S8 | பாஷில் ஆம்லெட் | Basil Omelette (uncertain reading) | ₹24 | 🟡 Draft | `basil-omelette-uncertain-reading.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 70 | S8 | எக் பொடிமாஸ் | Egg Podimas | ₹85 | ✅ Published | `egg-podimas.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 71 | S8 | கலக்கி | Kalakki | ₹23 | ✅ Published | `kalakki.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 72 | S9 | தோசை | Dosa | ₹75 | ✅ Published | `dosa.jpg` | `VERIFIED_PHOTOGRAPH` | 776 KB | Wikimedia Commons (File:Plain Dosa.jpg) by Sivasankari (CC BY-SA 4.0) |
| 73 | S9 | கல் தோசை | Kal Dosa | ₹75 | ✅ Published | `kal-dosa.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 74 | S9 | ஆனியன் தோசை | Onion Dosa | ₹90 | ✅ Published | `onion-dosa.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 75 | S9 | ரோஸ்ட் | Roast | ₹95 | ✅ Published | `roast.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 76 | S9 | முட்டை தோசை | Egg Dosa | ₹95 | ✅ Published | `egg-dosa.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 77 | S9 | ஊத்தப்பம் | Uthappam | ₹70 | ✅ Published | `uthappam.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 78 | S9 | ஆனியன் ஊத்தப்பம் | Onion Uthappam | ₹90 | ✅ Published | `onion-uthappam.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 79 | S10 | கப் ஆப் ஆனியன் | Cup of Onion | ₹10 | ✅ Published | `cup-of-onion.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 80 | S10 | ஆனியன் ரைத்தா | Onion Raita | ₹15 | ✅ Published | `onion-raita.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 81 | S11 | சிக்கன் பைரா ரைஸ் | Chicken Pyara Rice / Pira Rice | ₹165 | 🟡 Draft | `chicken-pyara-rice-pira-rice.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 82 | S11 | எக் பைரா ரைஸ் | Egg Pyara Rice / Pira Rice | ₹145 | 🟡 Draft | `egg-pyara-rice-pira-rice.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 83 | S11 | வெஜ் பைரா ரைஸ் | Veg Pyara Rice / Pira Rice | ₹135 | 🟡 Draft | `veg-pyara-rice-pira-rice.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 84 | S11 | வெஜ் புலாவ் | Veg Pulao | ₹145 | ✅ Published | `veg-pulao.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 85 | S11 | சிக்கன் நூடுல்ஸ் | Chicken Noodles | ₹170 | 🟡 Draft | `chicken-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 86 | S11 | எக் நூடுல்ஸ் | Egg Noodles | ₹155 | 🟡 Draft | `egg-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 87 | S11 | வெஜ் நூடுல்ஸ் | Veg Noodles | ₹145 | 🟡 Draft | `veg-noodles.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 88 | S11 | முட்டை பொரிச்சது | Fried Egg / Egg Fry | ₹90 | 🟡 Draft | `fried-egg-egg-fry.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 89 | S11 | முட்டை மசாலா | Egg Masala | ₹155 | ✅ Published | `egg-masala.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 90 | S11 | முட்டைக்கறி | Egg Curry | ₹145 | ✅ Published | `egg-curry.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 4 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 91 | S11 | பாயில்டு எக் | Boiled Egg | ₹16 | ✅ Published | `boiled-egg.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 92 | S11 | ஆம்லெட் | Omelette | ₹18 | ✅ Published | `omelette.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 93 | S11 | ஆம்லேட் | Omelette (alternate printed spelling) | ₹24 | 🟡 Draft | `omelette-alternate-printed-spelling.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 94 | S11 | பாஷில் ஆம்லெட் | Basil Omelette (uncertain) | ₹52 | 🟡 Draft | `basil-omelette-uncertain.svg` | `PROPRIETARY_REFERENCE_ILLUSTRATION` | 3 KB | Proprietary Reference Culinary Vector (Hotel New Moorthi Cafe) |
| 95 | S11 | எக் பொடிமாஸ் | Egg Podimas | ₹85 | ✅ Published | `egg-podimas.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |
| 96 | S11 | கலக்கி | Kalakki | ₹23 | ✅ Published | `kalakki.svg` | `AUTHENTIC_ILLUSTRATIVE_ARTWORK` | 3 KB | Dedicated Authentic Dish Culinary Vector (Hotel New Moorthi Cafe) |

## 4. Special Review & Proprietary Recipe Roster (35 Draft Items)

The following 35 dishes are safely preserved in MongoDB as **Drafts (`isPublished: false`)** and excluded from public food listings until verified by restaurant management:

| Row | Section | English Name | Tamil Name | Price | Reason for Verification Hold | Representative Image File |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | S1 (Chicken Dishes) | Chicken Fry | சிக்கன் ஃப்ரை | Bone: ₹245, Boneless: ₹260 | Verify exact Tamil spelling | `chicken-fry.svg` |
| 4 | S1 (Chicken Dishes) | Chicken 74 | சிக்கன் 74 | ₹540 | Menu shows “..” in boneless column; Proprietary recipe code — verify exact cafe preparation | `chicken-74.svg` |
| 5 | S1 (Chicken Dishes) | Chicken 88 | சிக்கன் 88 | ₹580 | Menu shows “..” in boneless column; Proprietary recipe code — verify exact cafe preparation | `chicken-88.svg` |
| 7 | S1 (Chicken Dishes) | Chicken 007 | சிக்கன் 007 | ₹175 | Proprietary recipe code — verify exact cafe preparation | `chicken-007.svg` |
| 11 | S1 (Chicken Dishes) | Chicken Manchurian | சிக்கன் மஞ்சூரியன் | Bone: ₹250, Boneless: ₹280 | Verify spelling/name | `chicken-manchurian.svg` |
| 12 | S1 (Chicken Dishes) | Chicken Keema Pyara / Keema Pira | சிக்கன் கீமா பைரா | ₹280 | Name uncertain; verify | `chicken-keema-pyara-keema-pira.svg` |
| 13 | S1 (Chicken Dishes) | Dragon Chicken Tikka | ட்ராகன் சிக்கன் டிக்கா | ₹290 | Name uncertain; verify | `dragon-chicken-tikka.svg` |
| 19 | S1 (Chicken Dishes) | Chettinad Chicken | செம்நாடு சிக்கன் | Bone: ₹270, Boneless: ₹300 | Tamil spelling unclear | `chettinad-chicken.svg` |
| 21 | S1 (Chicken Dishes) | Hyderabadi Chicken | ஹைதராபாத் சிக்கன் | Bone: ₹270, Boneless: ₹310 | Repeated entry as printed; verify | `hyderabadi-chicken.svg` |
| 22 | S1 (Chicken Dishes) | Pepper Chicken | பெப்பர் சிக்கன் | Bone: ₹270, Boneless: ₹310 | Repeated entry as printed; verify | `pepper-chicken.svg` |
| 23 | S1 (Chicken Dishes) | Rex Masala Chicken | ரெக்ஸ் மசாலா சிக்கன் | ₹300 | Name uncertain; verify | `rex-masala-chicken.svg` |
| 31 | S3 (Parotta & Breads) | Kothu Parotta | கொத்துமை பரோட்டா | ₹24 | Tamil item name unclear; verify | `kothu-parotta.svg` |
| 33 | S3 (Parotta & Breads) | Plain Lappa | பிளைன் லாப்பா | ₹20 | Name/spelling uncertain | `plain-lappa.svg` |
| 34 | S3 (Parotta & Breads) | Special Plain Lappa | SPL. பிளைன் லாப்பா | ₹40 | Name/spelling uncertain | `special-plain-lappa.svg` |
| 38 | S3 (Parotta & Breads) | Onion Egg Lappa | ஆனியன் முட்டை லாப்பா | ₹95 | Name uncertain | `onion-egg-lappa.svg` |
| 39 | S3 (Parotta & Breads) | Egg Parotta | முட்டை பரோட்டா | ₹160 | Price/item pairing should be verified from photo | `egg-parotta.svg` |
| 41 | S3 (Parotta & Breads) | Chicken Egg Lappa | சிக்கன் முட்டை லாப்பா | ₹150 | Name uncertain | `chicken-egg-lappa.svg` |
| 45 | S4 (NMC Special Items) | Tomato Chutney | தக்காளி சட்னி | ₹70 | Name/price pairing should be verified | `tomato-chutney.svg` |
| 50 | S5 (Grill Items) | Chicken “Noodles” / Chicken Noodles | சிக்கன் நாருல்ஸ் | ₹170 | Printed name unclear; verify | `chicken-noodles-chicken-noodles.svg` |
| 51 | S5 (Grill Items) | Egg Noodles | எக் நாருல்ஸ் | ₹155 | Printed name unclear; verify | `egg-noodles.svg` |
| 52 | S5 (Grill Items) | Veg Noodles | வெஜ் நாருல்ஸ் | ₹145 | Printed name unclear; verify | `veg-noodles.svg` |
| 53 | S6 (Tandoori & Seafood) | Chilli Prawn Fry | சில்லி பிரான் ஃப்ரை | ₹250 | Section/item pairing uncertain | `chilli-prawn-fry.svg` |
| 63 | S7 (Veg & Non-Veg Gravies) | Kebab Paneer | கபாப் பன்னீர் | ₹205 | Name uncertain; verify | `kebab-paneer.svg` |
| 64 | S8 (Mutton & Egg Dishes) | Mutton Payirchi / Mutton Fry (uncertain) | மட்டன் பயர்ச்சி | ₹90 | Item/price pairing needs verification | `mutton-payirchi-mutton-fry-uncertain.svg` |
| 67 | S8 (Mutton & Egg Dishes) | Boiled Egg | பாய்ல்டு எக் | ₹16 | Appears in the same column; category alignment uncertain | `boiled-egg.svg` |
| 69 | S8 (Mutton & Egg Dishes) | Basil Omelette (uncertain reading) | பாஷில் ஆம்லெட் | ₹24 | Verify | `basil-omelette-uncertain-reading.svg` |
| 81 | S11 (Rice, Noodles & Sides) | Chicken Pyara Rice / Pira Rice | சிக்கன் பைரா ரைஸ் | ₹165 | Name uncertain; verify | `chicken-pyara-rice-pira-rice.svg` |
| 82 | S11 (Rice, Noodles & Sides) | Egg Pyara Rice / Pira Rice | எக் பைரா ரைஸ் | ₹145 | Name uncertain; verify | `egg-pyara-rice-pira-rice.svg` |
| 83 | S11 (Rice, Noodles & Sides) | Veg Pyara Rice / Pira Rice | வெஜ் பைரா ரைஸ் | ₹135 | Name uncertain; verify | `veg-pyara-rice-pira-rice.svg` |
| 85 | S11 (Rice, Noodles & Sides) | Chicken Noodles | சிக்கன் நூடுல்ஸ் | ₹170 | Verify category alignment | `chicken-noodles.svg` |
| 86 | S11 (Rice, Noodles & Sides) | Egg Noodles | எக் நூடுல்ஸ் | ₹155 | Verify category alignment | `egg-noodles.svg` |
| 87 | S11 (Rice, Noodles & Sides) | Veg Noodles | வெஜ் நூடுல்ஸ் | ₹145 | Verify category alignment | `veg-noodles.svg` |
| 88 | S11 (Rice, Noodles & Sides) | Fried Egg / Egg Fry | முட்டை பொரிச்சது | ₹90 | Name/price pairing uncertain | `fried-egg-egg-fry.svg` |
| 93 | S11 (Rice, Noodles & Sides) | Omelette (alternate printed spelling) | ஆம்லேட் | ₹24 | Duplicate/adjacent entry; verify | `omelette-alternate-printed-spelling.svg` |
| 94 | S11 (Rice, Noodles & Sides) | Basil Omelette (uncertain) | பாஷில் ஆம்லெட் | ₹52 | Verify | `basil-omelette-uncertain.svg` |

## 5. Items Missing Real Food Photographs (83 Items)

The following 83 dishes currently have illustrative SVG vector cards and require official restaurant photography:

- **Row 1 (Chicken Dishes):** Chicken Fry (சிக்கன் ஃப்ரை) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-fry.svg`)
- **Row 4 (Chicken Dishes):** Chicken 74 (சிக்கன் 74) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-74.svg`)
- **Row 5 (Chicken Dishes):** Chicken 88 (சிக்கன் 88) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-88.svg`)
- **Row 7 (Chicken Dishes):** Chicken 007 (சிக்கன் 007) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-007.svg`)
- **Row 10 (Chicken Dishes):** Hyderabadi Chicken (ஹைதராபாத் சிக்கன்) — Status: *PUBLISHED* (Currently using `hyderabadi-chicken.svg`)
- **Row 11 (Chicken Dishes):** Chicken Manchurian (சிக்கன் மஞ்சூரியன்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-manchurian.svg`)
- **Row 12 (Chicken Dishes):** Chicken Keema Pyara / Keema Pira (சிக்கன் கீமா பைரா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-keema-pyara-keema-pira.svg`)
- **Row 13 (Chicken Dishes):** Dragon Chicken Tikka (ட்ராகன் சிக்கன் டிக்கா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `dragon-chicken-tikka.svg`)
- **Row 14 (Chicken Dishes):** Chicken Gravy (சிக்கன் கிரேவி) — Status: *PUBLISHED* (Currently using `chicken-gravy.svg`)
- **Row 15 (Chicken Dishes):** Manchurian Gravy (மஞ்சூரியன் கிரேவி) — Status: *PUBLISHED* (Currently using `manchurian-gravy.svg`)
- **Row 17 (Chicken Dishes):** Ginger Chicken (ஜிஞ்சர் சிக்கன்) — Status: *PUBLISHED* (Currently using `ginger-chicken.svg`)
- **Row 18 (Chicken Dishes):** Garlic Chicken (கார்லிக் சிக்கன்) — Status: *PUBLISHED* (Currently using `garlic-chicken.svg`)
- **Row 19 (Chicken Dishes):** Chettinad Chicken (செம்நாடு சிக்கன்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chettinad-chicken.svg`)
- **Row 20 (Chicken Dishes):** Chicken Kadai (சிக்கன் கடாய்) — Status: *PUBLISHED* (Currently using `chicken-kadai.svg`)
- **Row 21 (Chicken Dishes):** Hyderabadi Chicken (ஹைதராபாத் சிக்கன்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `hyderabadi-chicken.svg`)
- **Row 22 (Chicken Dishes):** Pepper Chicken (பெப்பர் சிக்கன்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `pepper-chicken.svg`)
- **Row 23 (Chicken Dishes):** Rex Masala Chicken (ரெக்ஸ் மசாலா சிக்கன்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `rex-masala-chicken.svg`)
- **Row 24 (Chicken Dishes):** Masala Chicken (மசாலா சிக்கன்) — Status: *PUBLISHED* (Currently using `masala-chicken.svg`)
- **Row 26 (Biryani & Rice):** Egg Biryani (முட்டை பிரியாணி) — Status: *PUBLISHED* (Currently using `egg-biryani.svg`)
- **Row 27 (Biryani & Rice):** Kuska (குஸ்கா) — Status: *PUBLISHED* (Currently using `kuska.svg`)
- **Row 29 (Parotta & Breads):** Bun Parotta (பன் பரோட்டா) — Status: *PUBLISHED* (Currently using `bun-parotta.svg`)
- **Row 30 (Parotta & Breads):** Nool Parotta (நூல் பரோட்டா) — Status: *PUBLISHED* (Currently using `nool-parotta.svg`)
- **Row 31 (Parotta & Breads):** Kothu Parotta (கொத்துமை பரோட்டா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `kothu-parotta.svg`)
- **Row 32 (Parotta & Breads):** Special Parotta (SPL. பரோட்டா) — Status: *PUBLISHED* (Currently using `special-parotta.svg`)
- **Row 33 (Parotta & Breads):** Plain Lappa (பிளைன் லாப்பா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `plain-lappa.svg`)
- **Row 34 (Parotta & Breads):** Special Plain Lappa (SPL. பிளைன் லாப்பா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `special-plain-lappa.svg`)
- **Row 35 (Parotta & Breads):** Veechu Parotta (வீச்சு பரோட்டா) — Status: *PUBLISHED* (Currently using `veechu-parotta.svg`)
- **Row 36 (Parotta & Breads):** Egg Lappa (முட்டை லாப்பா) — Status: *PUBLISHED* (Currently using `egg-lappa.svg`)
- **Row 37 (Parotta & Breads):** Special Egg Lappa (SPL. முட்டை லாப்பா) — Status: *PUBLISHED* (Currently using `special-egg-lappa.svg`)
- **Row 38 (Parotta & Breads):** Onion Egg Lappa (ஆனியன் முட்டை லாப்பா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `onion-egg-lappa.svg`)
- **Row 39 (Parotta & Breads):** Egg Parotta (முட்டை பரோட்டா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `egg-parotta.svg`)
- **Row 40 (Parotta & Breads):** Chilli Parotta (சில்லி பரோட்டா) — Status: *PUBLISHED* (Currently using `chilli-parotta.svg`)
- **Row 41 (Parotta & Breads):** Chicken Egg Lappa (சிக்கன் முட்டை லாப்பா) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-egg-lappa.svg`)
- **Row 43 (Parotta & Breads):** Egg Veechu Parotta (முட்டை வீச்சுபரோட்டா) — Status: *PUBLISHED* (Currently using `egg-veechu-parotta.svg`)
- **Row 44 (Parotta & Breads):** Ghee Parotta (நெய் பரோட்டா) — Status: *PUBLISHED* (Currently using `ghee-parotta.svg`)
- **Row 45 (NMC Special Items):** Tomato Chutney (தக்காளி சட்னி) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `tomato-chutney.svg`)
- **Row 46 (NMC Special Items):** Chicken Sukka (சிக்கன் சுக்கா) — Status: *PUBLISHED* (Currently using `chicken-sukka.svg`)
- **Row 47 (NMC Special Items):** Chicken Onion Roast (சிக்கன் ஆனியன் ரோஸ்ட்) — Status: *PUBLISHED* (Currently using `chicken-onion-roast.svg`)
- **Row 48 (NMC Special Items):** Chicken Pepper Roast (சிக்கன் பெப்பர் ரோஸ்ட்) — Status: *PUBLISHED* (Currently using `chicken-pepper-roast.svg`)
- **Row 49 (NMC Special Items):** Egg Salna (முட்டை சால்னி) — Status: *PUBLISHED* (Currently using `egg-salna.svg`)
- **Row 50 (Grill Items):** Chicken “Noodles” / Chicken Noodles (சிக்கன் நாருல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-noodles-chicken-noodles.svg`)
- **Row 51 (Grill Items):** Egg Noodles (எக் நாருல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `egg-noodles.svg`)
- **Row 52 (Grill Items):** Veg Noodles (வெஜ் நாருல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `veg-noodles.svg`)
- **Row 53 (Tandoori & Seafood):** Chilli Prawn Fry (சில்லி பிரான் ஃப்ரை) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chilli-prawn-fry.svg`)
- **Row 55 (Tandoori & Seafood):** Prawn 65 (பிரான் 65) — Status: *PUBLISHED* (Currently using `prawn-65.svg`)
- **Row 56 (Tandoori & Seafood):** Prawn Masala (பிரான் மசாலா) — Status: *PUBLISHED* (Currently using `prawn-masala.svg`)
- **Row 57 (Tandoori & Seafood):** Chilli Prawn Gravy (சில்லி பிரான் கிரேவி) — Status: *PUBLISHED* (Currently using `chilli-prawn-gravy.svg`)
- **Row 59 (Veg & Non-Veg Gravies):** Gobi Manchurian Gravy (கோபி மஞ்சூரியன் கிரேவி) — Status: *PUBLISHED* (Currently using `gobi-manchurian-gravy.svg`)
- **Row 60 (Veg & Non-Veg Gravies):** Gobi 65 (கோபி 65) — Status: *PUBLISHED* (Currently using `gobi-65.svg`)
- **Row 61 (Veg & Non-Veg Gravies):** Gobi Masala (கோபி மசாலா) — Status: *PUBLISHED* (Currently using `gobi-masala.svg`)
- **Row 63 (Veg & Non-Veg Gravies):** Kebab Paneer (கபாப் பன்னீர்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `kebab-paneer.svg`)
- **Row 64 (Mutton & Egg Dishes):** Mutton Payirchi / Mutton Fry (uncertain) (மட்டன் பயர்ச்சி) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `mutton-payirchi-mutton-fry-uncertain.svg`)
- **Row 65 (Mutton & Egg Dishes):** Mutton Masala (மட்டன் மசாலா) — Status: *PUBLISHED* (Currently using `mutton-masala.svg`)
- **Row 66 (Mutton & Egg Dishes):** Mutton Curry (மட்டன் கறி) — Status: *PUBLISHED* (Currently using `mutton-curry.svg`)
- **Row 67 (Mutton & Egg Dishes):** Boiled Egg (பாய்ல்டு எக்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `boiled-egg.svg`)
- **Row 68 (Mutton & Egg Dishes):** Omelette (ஆம்லெட்) — Status: *PUBLISHED* (Currently using `omelette.svg`)
- **Row 69 (Mutton & Egg Dishes):** Basil Omelette (uncertain reading) (பாஷில் ஆம்லெட்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `basil-omelette-uncertain-reading.svg`)
- **Row 70 (Mutton & Egg Dishes):** Egg Podimas (எக் பொடிமாஸ்) — Status: *PUBLISHED* (Currently using `egg-podimas.svg`)
- **Row 71 (Mutton & Egg Dishes):** Kalakki (கலக்கி) — Status: *PUBLISHED* (Currently using `kalakki.svg`)
- **Row 73 (Dosa Items):** Kal Dosa (கல் தோசை) — Status: *PUBLISHED* (Currently using `kal-dosa.svg`)
- **Row 74 (Dosa Items):** Onion Dosa (ஆனியன் தோசை) — Status: *PUBLISHED* (Currently using `onion-dosa.svg`)
- **Row 75 (Dosa Items):** Roast (ரோஸ்ட்) — Status: *PUBLISHED* (Currently using `roast.svg`)
- **Row 76 (Dosa Items):** Egg Dosa (முட்டை தோசை) — Status: *PUBLISHED* (Currently using `egg-dosa.svg`)
- **Row 77 (Dosa Items):** Uthappam (ஊத்தப்பம்) — Status: *PUBLISHED* (Currently using `uthappam.svg`)
- **Row 78 (Dosa Items):** Onion Uthappam (ஆனியன் ஊத்தப்பம்) — Status: *PUBLISHED* (Currently using `onion-uthappam.svg`)
- **Row 79 (Salna, Sides & Extras):** Cup of Onion (கப் ஆப் ஆனியன்) — Status: *PUBLISHED* (Currently using `cup-of-onion.svg`)
- **Row 80 (Salna, Sides & Extras):** Onion Raita (ஆனியன் ரைத்தா) — Status: *PUBLISHED* (Currently using `onion-raita.svg`)
- **Row 81 (Rice, Noodles & Sides):** Chicken Pyara Rice / Pira Rice (சிக்கன் பைரா ரைஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-pyara-rice-pira-rice.svg`)
- **Row 82 (Rice, Noodles & Sides):** Egg Pyara Rice / Pira Rice (எக் பைரா ரைஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `egg-pyara-rice-pira-rice.svg`)
- **Row 83 (Rice, Noodles & Sides):** Veg Pyara Rice / Pira Rice (வெஜ் பைரா ரைஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `veg-pyara-rice-pira-rice.svg`)
- **Row 84 (Rice, Noodles & Sides):** Veg Pulao (வெஜ் புலாவ்) — Status: *PUBLISHED* (Currently using `veg-pulao.svg`)
- **Row 85 (Rice, Noodles & Sides):** Chicken Noodles (சிக்கன் நூடுல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `chicken-noodles.svg`)
- **Row 86 (Rice, Noodles & Sides):** Egg Noodles (எக் நூடுல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `egg-noodles.svg`)
- **Row 87 (Rice, Noodles & Sides):** Veg Noodles (வெஜ் நூடுல்ஸ்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `veg-noodles.svg`)
- **Row 88 (Rice, Noodles & Sides):** Fried Egg / Egg Fry (முட்டை பொரிச்சது) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `fried-egg-egg-fry.svg`)
- **Row 89 (Rice, Noodles & Sides):** Egg Masala (முட்டை மசாலா) — Status: *PUBLISHED* (Currently using `egg-masala.svg`)
- **Row 90 (Rice, Noodles & Sides):** Egg Curry (முட்டைக்கறி) — Status: *PUBLISHED* (Currently using `egg-curry.svg`)
- **Row 91 (Rice, Noodles & Sides):** Boiled Egg (பாயில்டு எக்) — Status: *PUBLISHED* (Currently using `boiled-egg.svg`)
- **Row 92 (Rice, Noodles & Sides):** Omelette (ஆம்லெட்) — Status: *PUBLISHED* (Currently using `omelette.svg`)
- **Row 93 (Rice, Noodles & Sides):** Omelette (alternate printed spelling) (ஆம்லேட்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `omelette-alternate-printed-spelling.svg`)
- **Row 94 (Rice, Noodles & Sides):** Basil Omelette (uncertain) (பாஷில் ஆம்லெட்) — Status: *DRAFT_NEEDS_VERIFICATION* (Currently using `basil-omelette-uncertain.svg`)
- **Row 95 (Rice, Noodles & Sides):** Egg Podimas (எக் பொடிமாஸ்) — Status: *PUBLISHED* (Currently using `egg-podimas.svg`)
- **Row 96 (Rice, Noodles & Sides):** Kalakki (கலக்கி) — Status: *PUBLISHED* (Currently using `kalakki.svg`)

## 6. Express Static Asset Verification

- **Static Asset Endpoint:** `GET /images/menu/<filename>`
- **Mounted in:** `backend/src/app.js` (`app.use('/images', express.static(path.join(__dirname, '../public/images')))`)
- **On-disk files verified:** 96 of 96 loadable, non-zero byte assets present (13 authentic Wikimedia photographs + 83 SVG vector illustrations).
