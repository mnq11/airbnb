import prisma from "@/app/libs/prismadb";
import { SafeUser } from "@/app/types"; // Corrected import path

/**
 * Interface for parameters needed to retrieve a listing by ID
 *
 * @interface IParams
 * @property {string} [listingId] - Optional listing ID to search for
 */
interface IParams {
  listingId?: string;
}

/**
 * Gets detailed information for a specific property listing by ID
 *
 * Fetches the listing with matching ID from the database, including
 * the associated user (owner), images, latitude, and longitude.
 * Transforms database entities into safe objects for client-side use
 * by stringifying dates.
 *
 * @async
 * @function getListingById
 * @param {IParams} params - Object containing the listingId to search for
 * @returns {Promise<Object|null>} Promise resolving to the listing object or null if not found
 * @throws {Error} Throws an error if the database operation fails
 */
export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: { // Use select to explicitly include fields
        id: true,
        title: true,
        description: true,
        createdAt: true,
        category: true,
        roomCount: true,
        bathroomCount: true,
        guestCount: true,
        locationValue: true,
        userId: true,
        price: true,
        favoritesCount: true,
        viewCounter: true,
        latitude: true, // Explicitly select latitude
        longitude: true, // Explicitly select longitude
        user: true,
        images: true, // Include images here as well
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      // Assuming SafeUser type includes the necessary fields
      user: listing.user ? {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      } : null,
      // No need to map images if they are already included in the select
    };
  } catch (error: any) {
    console.error("Error fetching listing by ID:", error); // Log the error
    throw new Error("Failed to fetch listing details."); // Throw a more specific error
  }
}
