// src/utils/apcCalculator.js
// Dynamic Article Processing Charges (APC) and Fee Waiver Calculator for JMES

export const SOUTH_ASIAN_COUNTRIES = [
  'afghanistan', 'bangladesh', 'bhutan', 'maldives', 'nepal', 'pakistan', 'sri lanka'
];

/**
 * Calculates original APC and final payable amount after waiver
 * @param {Object} params
 * @param {string} params.country - Author country
 * @param {boolean} params.isFemaleAuthor - Whether corresponding or primary author is female
 * @param {number} params.waiverPercent - Approved fee waiver (0 to 50%)
 * @param {Object} params.settings - Admin configured settings
 * @returns {Object} { currency, originalAmount, waiverPercent, discountAmount, finalPayable, categoryLabel, appliedRule }
 */
export function calculateAPC({
  country = '',
  isFemaleAuthor = false,
  waiverPercent = 0,
  settings = null
}) {
  const apcRates = settings?.apc_rates || {
    india: { amount: 4500, currency: 'INR' },
    south_asia: { amount: 100, currency: 'USD' },
    female_authorship: { amount: 100, currency: 'USD' },
    rest_of_world: { amount: 150, currency: 'USD' }
  };

  const priority = settings?.overlap_priority || 'female_first'; // 'female_first' or 'country_first'
  const cleanCountry = (country || '').trim().toLowerCase();

  let currency = 'USD';
  let originalAmount = apcRates.rest_of_world.amount;
  let categoryLabel = 'Rest of the World';
  let appliedRule = 'Standard International APC';

  const isIndia = cleanCountry === 'india';
  const isSouthAsia = SOUTH_ASIAN_COUNTRIES.includes(cleanCountry);

  if (priority === 'female_first' && isFemaleAuthor) {
    currency = apcRates.female_authorship.currency;
    originalAmount = apcRates.female_authorship.amount;
    categoryLabel = 'Female Authorship (Global Support Rate)';
    appliedRule = 'Female Authorship Initiative Rate';
  } else if (isIndia) {
    currency = apcRates.india.currency;
    originalAmount = apcRates.india.amount;
    categoryLabel = 'India (Domestic Rate)';
    appliedRule = 'Domestic Indian Authorship Rate';
  } else if (isSouthAsia) {
    currency = apcRates.south_asia.currency;
    originalAmount = apcRates.south_asia.amount;
    categoryLabel = 'Other South Asian Countries';
    appliedRule = 'South Asian Regional Rate';
  } else if (isFemaleAuthor) {
    currency = apcRates.female_authorship.currency;
    originalAmount = apcRates.female_authorship.amount;
    categoryLabel = 'Female Authorship (Global Support Rate)';
    appliedRule = 'Female Authorship Initiative Rate';
  } else {
    currency = apcRates.rest_of_world.currency;
    originalAmount = apcRates.rest_of_world.amount;
    categoryLabel = 'Rest of the World';
    appliedRule = 'Standard International APC';
  }

  // Waiver percentage clamped to max 50% as per JMES policy
  const validWaiver = Math.min(Math.max(Number(waiverPercent) || 0, 0), 50);
  const discountAmount = Math.round((originalAmount * validWaiver) / 100);
  const finalPayable = Math.max(originalAmount - discountAmount, 0);

  return {
    currency,
    originalAmount,
    waiverPercent: validWaiver,
    discountAmount,
    finalPayable,
    categoryLabel,
    appliedRule
  };
}
