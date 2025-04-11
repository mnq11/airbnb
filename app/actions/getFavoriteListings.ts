import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { SafeListing } from "@/app/types"; // Import SafeListing type

/**
 * Gets all property listings favorited by the current user
 *
 * Fetches listings that match the IDs stored in the user's favoriteIds array.
 * Includes latitude and longitude fields.
 * Transforms database listings into safe objects for client-side use by
 * stringifying dates and formatting nested objects.
 *
 * @async
 * @function getFavoriteListings
 * @returns {Promise<SafeListing[]>} Promise resolving to an array of favorited listings
 * @throws {Error} Throws an error if the database operation fails
 */
export default async function getFavoriteListings(): Promise<SafeListing[]> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // Fetch favorite listings directly using Prisma type
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
      select: { // Use select to ensure all required fields are included
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
        images: {
          select: { url: true } // Select only the URL from images
        },
      },
    });

    // Map the fetched data to SafeListing type
    const safeFavorites: SafeListing[] = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
      // Images are already in the correct format due to the select statement
    }));

    return safeFavorites;
  } catch (error: any) {
    console.error("Error fetching favorite listings:", error);
    throw new Error("Failed to fetch favorite listings.");
  }
}
