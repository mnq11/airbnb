import prisma from "@/app/libs/prismadb";
import { SafeListing } from "@/app/types";

/**
 * Interface for listing search parameters
 *
 * Defines all possible filter parameters that can be applied when searching for property listings.
 * All parameters are optional to allow for flexible querying.
 *
 * @interface IListingsParams
 * @property {string} [userId] - Filter listings by owner/creator ID
 * @property {number} [guestCount] - Minimum number of guests the property should accommodate
 * @property {number} [roomCount] - Minimum number of rooms the property should have
 * @property {number} [bathroomCount] - Minimum number of bathrooms the property should have
 * @property {string} [startDate] - Start date for availability check (ISO string)
 * @property {string} [endDate] - End date for availability check (ISO string)
 * @property {string} [locationValue] - Location identifier for geographic filtering
 * @property {string} [category] - Property category/type filter
 * @property {number} [viewsCount] - Minimum number of views for popularity filtering
 * @property {number} [page] - Page number for pagination (default: 1)
 * @property {number} [limit] - Number of results per page (default: 10)
 */
export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  viewsCount?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetches property listings with filtering, pagination and availability checking
 *
 * This server action retrieves property listings from the database based on the provided
 * filter parameters. It supports complex queries including:
 * - Filtering by property attributes (rooms, guests, bathrooms)
 * - Location-based filtering
 * - Category filtering
 * - Availability date range checking (excludes properties with reservations in the date range)
 * - Pagination support
 * - Popularity filtering by view count
 *
 * The function also handles data transformation by:
 * - Converting dates to ISO strings for client-side use
 * - Formatting images into the expected client-side structure
 *
 * @async
 * @function getListings
 * @param {IListingsParams} params - Search and filter parameters
 * @returns {Promise<{listings: SafeListing[], total: number}>} Paginated listings and total count
 * @throws {Error} If the database query fails
 */
export default async function getListings(
  params: IListingsParams,
): Promise<{ listings: SafeListing[]; total: number }> {
  try {
    // Extract all filter parameters from the params object
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
      viewsCount,
      page = 1,
      limit = 10,
    } = params;

    // Build query object based on provided filters
    let query: any = {};

    // Filter by user ID (owner of the listing)
    if (userId) {
      query.userId = userId;
    }

    // Filter by category/property type
    if (category) {
      query.category = category;
    }

    // Filter by minimum room count
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount, // Convert to number and find listings with >= roomCount
      };
    }

    // Filter by minimum guest capacity
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount, // Convert to number and find listings with >= guestCount
      };
    }

    // Filter by minimum bathroom count
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount, // Convert to number and find listings with >= bathroomCount
      };
    }

    // Filter by location
    if (locationValue) {
      query.locationValue = locationValue;
    }

    // Filter by date range availability
    // Excludes listings that have reservations overlapping with the requested dates
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    // Filter by minimum view count (popularity)
    if (viewsCount) {
      query.viewsCount = {
        gte: +viewsCount, // Convert to number and find listings with >= viewsCount
      };
    }

    // Determine sorting order
    let orderBy: any = { createdAt: "desc" }; // Default sort: newest first
    if (!category && !locationValue && !params.userId) { 
      // If no specific category, location, or user filter is applied,
      // sort by viewCounter descending for the general home page.
      orderBy = { viewCounter: "desc" };
    }

    // Get total count of matching listings for pagination
    const total = await prisma.listing.count({ where: query });

    // Fetch the listings with pagination and dynamic sorting
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: orderBy, // Apply the determined sort order
      include: {
        images: true, // Include the listing images
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform database listings to safe listings format for client use
    // This includes date serialization and image URL formatting
    const safeListings: SafeListing[] = listings.map((listing: any) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      images: listing.images.map((image: any) => ({ url: image.url })),
    }));

    // Return both the listings and total count for pagination
    return {
      listings: safeListings,
      total,
    };
  } catch (error: any) {
    console.error("Error fetching listings:", error); // Log the error
    throw new Error("Failed to fetch listings."); // Throw a more specific error
  }
}
