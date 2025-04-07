import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { SafeListing } from "@/app/types"; // Import SafeListing type

/**
 * Interface representing a property listing favorited by a user
 *
 * Contains all listing data plus favorite-specific metadata
 *
 * @interface Favorite
 * @property {string} id - Unique identifier for the listing
 * @property {Date} createdAt - Date when the listing was created
 * @property {Array<{url: string}>} images - Array of image objects with URLs
 * @property {string} title - Title of the property listing
 * @property {string} description - Detailed description of the property
 * @property {string} category - Category type of the property
 * @property {number} roomCount - Number of rooms in the property
 * @property {number} bathroomCount - Number of bathrooms in the property
 * @property {number} guestCount - Maximum number of guests allowed
 * @property {string} locationValue - Location identifier value
 * @property {string|null} userId - ID of the user who owns the property
 * @property {number} price - Price per night in local currency
 * @property {number} favoritesCount - Number of users who favorited this listing
 * @property {number} viewCounter - Number of times the listing has been viewed
 */
interface Favorite {
  id: string;
  createdAt: Date;
  images: Array<{ url: string }>;
  title: string;
  description: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string | null;
  price: number;
  favoritesCount: number;
  viewCounter: number;
}

/**
 * Gets all property listings favorited by the current user
 *
 * Fetches listings that match the IDs stored in the user's favoriteIds array.
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

    const favorites: Favorite[] = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
      include: {
        images: true, // Include the images relation
      },
    });

    const safeFavorites: SafeListing[] = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
      images: favorite.images.map((image) => ({
        url: image.url,
      })),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
