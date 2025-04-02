/**
 * Custom hook for accessing and filtering Yemen region/area data
 * 
 * This hook provides utilities to access formatted Yemen region data for location selection
 * throughout the application. Used primarily in location dropdowns and map functionality.
 * 
 * @module hooks/useCountries
 */

// import countries from 'world-countries';
import countries from "../../app/components/inputs/yemenAreas.json";

/**
 * Formatted Yemen regions with essential properties for display and selection
 * 
 * @type {Array<{value: string, label: string, flag: string, latlng: number[], region: string}>}
 */
const formattedCountries = countries.map((country) => ({
  value: country.value,
  label: country.label,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

/**
 * Hook for working with Yemen region data
 * 
 * @returns {Object} Object containing utility functions for Yemen region data
 * @returns {Function} getAll - Returns all formatted Yemen regions
 * @returns {Function} getByValue - Returns a specific region by its value
 */
const useCountries = () => {
  /**
   * Get all Yemen regions in formatted structure
   * 
   * @returns {Array<{value: string, label: string, flag: string, latlng: number[], region: string}>}
   */
  const getAll = () => formattedCountries;

  /**
   * Find a specific Yemen region by its value identifier
   * 
   * @param {string} value - The region value to search for
   * @returns {Object|undefined} The matched region or undefined if not found
   */
  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCountries;
