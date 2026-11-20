/**
 * Image Resolution Utility
 * Maps API-provided image URLs to locally available assets.
 * Preserves original API response while resolving missing SVGs to existing files.
 */

// Mapping of API imageUrl paths to locally available assets
const IMAGE_URL_MAP = {
  // Direct SVG -> existing asset mappings (per validation report)
  '/images/menu/chicken-biryani.svg': '/images/menu/chicken-biryani.jpg',
  '/images/menu/rava-dosa.svg': '/images/menu/onion-dosa.svg',
  '/images/menu/ghee-roast-dosa.svg': '/images/menu/dosa.jpg',
  
  // Semantic fallbacks - create appropriate SVG artwork for these
  '/images/menu/heritage-thali.svg': '/images/menu/heritage-thali.svg',
  '/images/menu/filter-kaapi.svg': '/images/menu/filter-kaapi.svg',
  '/images/menu/medu-vada.svg': '/images/menu/medu-vada.svg',
  '/images/menu/podi-idli.svg': '/images/menu/podi-idli.svg',
};

/**
 * Resolves an API image URL to a locally available asset.
 * @param {string} apiImageUrl - The imageUrl from API response
 * @returns {string} - The resolved local asset URL
 */
export const resolveImageUrl = (apiImageUrl) => {
  if (!apiImageUrl) return apiImageUrl;
  
  // Return mapped asset if exists, otherwise return original
  return IMAGE_URL_MAP[apiImageUrl] || apiImageUrl;
};

/**
 * Resolves image URL from a food object, preserving the original object.
 * @param {Object} food - Food object with imageUrl/image property
 * @returns {string} - Resolved image URL
 */
export const getResolvedImageUrl = (food) => {
  const apiImageUrl = food.imageUrl || food.image;
  return resolveImageUrl(apiImageUrl);
};

export default {
  resolveImageUrl,
  getResolvedImageUrl,
};