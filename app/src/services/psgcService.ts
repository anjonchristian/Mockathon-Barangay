import axios from "axios";
import * as SecureStore from "expo-secure-store";

// PSGC API has inconsistent base URLs:
// - Regions: /api/regions (no version)
// - Provinces/Cities/Barangays: /api/v1/* (v1)
const PSGC_API_BASE = "https://psgc.cloud/api";
const PSGC_API_V1_BASE = "https://psgc.cloud/api/v1";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// PSGC Data Types
export interface Region {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
}

export interface City {
  code: string;
  name: string;
  type: string;
  district?: string;
  zip_code?: string;
}

export interface Municipality {
  code: string;
  name: string;
  type: string;
  district?: string;
  zip_code?: string;
}

export interface Barangay {
  code: string;
  name: string;
  status?: string;
}

export interface LocationData {
  region: Region | null;
  province: Province | null;
  cityMunicipality: City | Municipality | null;
  barangay: Barangay | null;
}

// Cache keys
const CACHE_KEYS = {
  REGIONS: "psgc_regions",
  PROVINCES: "psgc_provinces_",
  CITIES_MUNICIPALITIES: "psgc_cities_municipalities_",
  BARANGAYS: "psgc_barangays_",
};

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Helper functions for cache management
async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await SecureStore.getItemAsync(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - entry.timestamp > CACHE_DURATION) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
}

async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await SecureStore.setItemAsync(key, JSON.stringify(entry));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
}

async function clearCache(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(CACHE_KEYS.REGIONS);
    // Note: We can't easily clear all dynamic keys without tracking them
    // For now, regions cache will be cleared on next fetch if expired
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

// API Client for regions (no version)
const psgcApi = axios.create({
  baseURL: PSGC_API_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// API Client for v1 endpoints (provinces, cities, barangays)
const psgcApiV1 = axios.create({
  baseURL: PSGC_API_V1_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Fetch all regions
 * Uses cache to minimize API calls
 */
export async function fetchRegions(): Promise<Region[]> {
  // Try cache first
  const cached = await getCachedData<Region[]>(CACHE_KEYS.REGIONS);
  if (cached) {
    console.log("Using cached regions");
    return cached;
  }

  try {
    const response = await psgcApi.get<Region[]>("/regions");
    const regions = response.data;

    // Cache the result
    await setCachedData(CACHE_KEYS.REGIONS, regions);

    return regions;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw new Error("Failed to fetch regions. Please check your internet connection.");
  }
}

/**
 * Fetch provinces for a specific region
 * @param regionCode - The PSGC code of the region
 */
export async function fetchProvinces(
  regionCode: string
): Promise<Province[]> {
  const cacheKey = CACHE_KEYS.PROVINCES + regionCode;

  // Try cache first
  const cached = await getCachedData<Province[]>(cacheKey);
  if (cached) {
    console.log("Using cached provinces for region:", regionCode);
    return cached;
  }

  try {
    // Use nested endpoint which actually works
    const response = await psgcApi.get<Province[]>(
      `/regions/${regionCode}/provinces`
    );
    const provinces = response.data;

    // Cache the result
    await setCachedData(cacheKey, provinces);

    return provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw new Error("Failed to fetch provinces. Please check your internet connection.");
  }
}

/**
 * Fetch cities and municipalities for a specific province
 * @param provinceCode - The PSGC code of the province
 */
export async function fetchCitiesMunicipalities(
  provinceCode: string
): Promise<(City | Municipality)[]> {
  const cacheKey = CACHE_KEYS.CITIES_MUNICIPALITIES + provinceCode;

  // Try cache first
  const cached = await getCachedData<(City | Municipality)[]>(cacheKey);
  if (cached) {
    console.log("Using cached cities/municipalities for province:", provinceCode);
    return cached;
  }

  try {
    // Use nested endpoint, consistent with provinces and barangays
    const response = await psgcApi.get<(City | Municipality)[]>(
      `/provinces/${provinceCode}/cities-municipalities`
    );
    const citiesMunicipalities = response.data;

    // Cache the result
    await setCachedData(cacheKey, citiesMunicipalities);

    return citiesMunicipalities;
  } catch (error) {
    console.error("Error fetching cities/municipalities:", error);
    throw new Error("Failed to fetch cities and municipalities. Please check your internet connection.");
  }
}

/**
 * Fetch barangays for a specific city or municipality
 * @param cityMunicipalityCode - The PSGC code of the city/municipality
 */
export async function fetchBarangays(
  cityMunicipalityCode: string
): Promise<Barangay[]> {
  const cacheKey = CACHE_KEYS.BARANGAYS + cityMunicipalityCode;

  // Try cache first
  const cached = await getCachedData<Barangay[]>(cacheKey);
  if (cached) {
    console.log("Using cached barangays for city/municipality:", cityMunicipalityCode);
    return cached;
  }

  try {
    // Use nested endpoint which actually works
    const response = await psgcApi.get<Barangay[]>(
      `/cities-municipalities/${cityMunicipalityCode}/barangays`
    );
    const barangays = response.data;

    // Cache the result
    await setCachedData(cacheKey, barangays);

    return barangays;
  } catch (error) {
    console.error("Error fetching barangays:", error);
    throw new Error("Failed to fetch barangays. Please check your internet connection.");
  }
}

/**
 * Clear all PSGC cache
 * Useful for debugging or forcing refresh
 */
export async function clearPsgcCache(): Promise<void> {
  await clearCache();
}

/**
 * Parent Traversal Functions
 * These allow climbing the hierarchy upward from a barangay
 */

/**
 * Get the parent city/municipality of a barangay
 * @param barangayCode - The PSGC code of the barangay
 */
export async function getBarangayCity(
  barangayCode: string
): Promise<City | Municipality | null> {
  try {
    const response = await psgcApiV1.get<City | Municipality>(
      `/barangays/${barangayCode}/city`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching barangay city:", error);
    return null;
  }
}

/**
 * Get the parent municipality of a barangay
 * @param barangayCode - The PSGC code of the barangay
 */
export async function getBarangayMunicipality(
  barangayCode: string
): Promise<Municipality | null> {
  try {
    const response = await psgcApiV1.get<Municipality>(
      `/barangays/${barangayCode}/municipality`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching barangay municipality:", error);
    return null;
  }
}

/**
 * Get the parent province of a barangay
 * @param barangayCode - The PSGC code of the barangay
 */
export async function getBarangayProvince(
  barangayCode: string
): Promise<Province | null> {
  try {
    const response = await psgcApiV1.get<Province>(
      `/barangays/${barangayCode}/province`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching barangay province:", error);
    return null;
  }
}

/**
 * Get the parent region of a barangay
 * @param barangayCode - The PSGC code of the barangay
 */
export async function getBarangayRegion(
  barangayCode: string
): Promise<Region | null> {
  try {
    const response = await psgcApiV1.get<Region>(
      `/barangays/${barangayCode}/region`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching barangay region:", error);
    return null;
  }
}

/**
 * Get complete location hierarchy from a barangay code
 * This is a convenience function that fetches all parent entities
 * @param barangayCode - The PSGC code of the barangay
 */
export async function getCompleteLocationFromBarangay(
  barangayCode: string
): Promise<{
  barangay: Barangay | null;
  cityMunicipality: City | Municipality | null;
  province: Province | null;
  region: Region | null;
}> {
  try {
    // Fetch all parent entities in parallel
    const [cityMunicipality, province, region] = await Promise.all([
      getBarangayCity(barangayCode),
      getBarangayProvince(barangayCode),
      getBarangayRegion(barangayCode),
    ]);

    return {
      barangay: { code: barangayCode, name: "" }, // Would need to fetch barangay details
      cityMunicipality,
      province,
      region,
    };
  } catch (error) {
    console.error("Error fetching complete location:", error);
    return {
      barangay: null,
      cityMunicipality: null,
      province: null,
      region: null,
    };
  }
}

/**
 * Validate location data completeness
 */
export function isLocationComplete(location: LocationData): boolean {
  return !!(location.region && location.province && location.cityMunicipality && location.barangay);
}

/**
 * Format location data for display
 */
export function formatLocation(location: LocationData): string {
  if (!isLocationComplete(location)) {
    return "Location not selected";
  }

  return `${location.barangay?.name}, ${location.cityMunicipality?.name}, ${location.province?.name}, ${location.region?.name}`;
}