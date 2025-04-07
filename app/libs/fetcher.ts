/**
 * Axios-based data fetching utility
 *
 * A simple utility function that uses axios to fetch data from API endpoints.
 * Used with SWR for data fetching and caching throughout the application.
 *
 * @param {string} url - The API endpoint URL to fetch data from
 * @returns {Promise<any>} Promise resolving to the response data
 */
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;
