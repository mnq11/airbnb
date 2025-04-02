import prisma from "@/app/libs/prismadb";

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
 * the associated user (owner) and images. Transforms database entities
 * into safe objects for client-side use by stringifying dates.
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
      include: {
        user: true,
        images: true,
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: listing.user
        ? {
            ...listing.user,
            createdAt: listing.user.createdAt.toString(),
            updatedAt: listing.user.updatedAt.toString(),
            emailVerified: listing.user.emailVerified?.toString() || null,
          }
        : null,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
