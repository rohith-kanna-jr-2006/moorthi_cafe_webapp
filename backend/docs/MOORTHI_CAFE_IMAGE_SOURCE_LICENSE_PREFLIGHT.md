# Moorthy Cafe Image Source & Licence Verification — Preflight

**Status:** Live menu migration remains on hold. This report makes no MongoDB changes.

**Important limitation:** The links below identify publicly documented Wikimedia Commons images that may be suitable candidates. Except for the Chicken 65 URL noted below, they are not proof that the current local files in `backend/public/images/menu/` are those exact images. Each local asset must be matched to a documented source before its licence metadata is treated as verified.

## Confirmed correction: Chicken 65

The URL in the supplied command log resolves to [File:Chicken 65.jpg](https://commons.wikimedia.org/wiki/File:Chicken_65.jpg). That Commons page names **Charles Haynes** as the author and lists **CC BY-SA 2.0**, not CC BY-SA 4.0. Correct the audit if the current local `chicken-65.jpg` is confirmed to be this asset. The file's required source and licence details must be retained.

## Candidate sources for the 13 named photo assets

These are source-page candidates only. Before using one, the local agent should download it from its Commons file page, check the visual content, and record the source page, author, exact licence, and any edits. A matching filename is not proof that the local file came from that page.

| Project filename | Candidate source page | Author shown | Licence shown | Local-file match |
|---|---|---|---|---|
| `chicken-65.jpg` | https://commons.wikimedia.org/wiki/File:Chicken_65.jpg | Charles Haynes | CC BY-SA 2.0 | Download URL in the supplied log points here; verify current file |
| `chicken-biryani.jpg` | https://commons.wikimedia.org/wiki/File:A_picture_of_chicken_biryani.jpg | Thamizhpparithi Maari | CC BY-SA 4.0 | Not verified |
| `parotta.jpg` | https://commons.wikimedia.org/wiki/File:Parotta.jpg | Charles Haynes | CC BY-SA 2.0 | Not verified |
| `dosa.jpg` | https://commons.wikimedia.org/wiki/File:Plain_Dosa.jpg | Sivasankari | CC BY-SA 4.0 | Not verified |
| `chicken-kothu-parotta.jpg` | https://commons.wikimedia.org/wiki/File:Chicken_Kothu_Parotta.jpg | Thamizhpparithi Maari | CC BY-SA 4.0 | Not verified |
| `butter-chicken.jpg` | https://commons.wikimedia.org/wiki/File:ButterChicken.jpg | Interesting009 | CC BY-SA 4.0 | Not verified |
| `chicken-lollipop.jpg` | https://commons.wikimedia.org/wiki/File:Chicken_lolipop.jpg | Twilightin | CC BY-SA 4.0 | Not verified |
| `chicken-tikka.jpg` | https://commons.wikimedia.org/wiki/File:ChickenTikka.jpg | michaelwhays | CC BY 2.0 | Not verified |
| `chilli-chicken.jpg` | https://commons.wikimedia.org/wiki/File:CHILLI_CHICKEN.jpg | G.HarishGovindaraj | CC BY-SA 4.0 | Not verified |
| `gobi-manchurian.jpg` | https://commons.wikimedia.org/wiki/File:Gobi_Manchurian.jpg | Harsha K R | CC BY-SA 2.0 | Not verified |
| `paneer-butter-masala.jpg` | https://commons.wikimedia.org/wiki/File:Paneer_Butter_Masala.jpg | Krishnakerala | CC BY-SA 4.0 | Not verified |
| `pepper-chicken.jpg` | https://commons.wikimedia.org/wiki/File:Pepper_Chicken_(869566714).jpg | rovingI | CC BY 2.0 | Not verified |
| `prawn-fry.jpg` | https://commons.wikimedia.org/wiki/File:Prawn_fry.jpg | Seethabharathi | CC BY-SA 4.0 | Not verified |

## Licence requirements

- CC BY requires suitable attribution and a link to the licence: https://creativecommons.org/licenses/by/2.0/
- CC BY-SA also requires adaptations to be distributed under the same or a compatible licence: https://creativecommons.org/licenses/by-sa/2.0/ and https://creativecommons.org/licenses/by-sa/4.0/
- Do not assign the same licence to every Wikimedia image; licences vary by individual file.
- Do not imply the photographer endorses Hotel New Moorthi Cafe.

## Required local verification

1. Inspect each current JPG and establish provenance. A note such as “proprietary demo asset” alone does not establish who created it or whether it may be used.
2. If provenance cannot be established, either replace the file with a reviewed Commons candidate or mark it `UNVERIFIED_SOURCE` and keep its food unpublished until approved.
3. Create/maintain `backend/docs/IMAGE_ATTRIBUTION.md` with filename, dish, source page, author, exact licence URL, and edits (such as crop or resize).
4. Check the downloaded image visually; correct dish relevance matters. Generic food imagery must not be represented as the cafe's actual recipe/photo.
5. Record generated SVGs as illustrations, not photographs, and document how they were created and any external resources used.
6. Keep ambiguous menu rows unpublished until the food name/price is confirmed. Photo clearance does not verify menu transcription.
7. Keep live writes blocked. Before a future migration, run the dry-run again and verify the database target remains `mongodb://127.0.0.1:27017/moorthi_cafe`. Execute only after separate explicit approval.

## Database status

Based on the latest user-provided log, the last reported development counts are 30 foods, 6 categories, 37 users, 194 orders and 3 daily counters. The latest reported seeder invocation was `node backend/scripts/seedMenu.js --dry-run`. This chat has not accessed the user's local database; preserve these counts and do not run any live write.
