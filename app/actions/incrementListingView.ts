'use server';

import prisma from "@/app/libs/prismadb";

/**
 * Increments the view counter for a specific listing.
 * 
 * @async
 * @function incrementListingView
 * @param {string} listingId - The ID of the listing to update.
 * @returns {Promise<void>}
 * @throws {Error} If the database update fails or listingId is missing.
 */
export default async function incrementListingView(listingId: string): Promise<void> {
  if (!listingId) {
    console.error("incrementListingView: listingId is required.");
    // Optionally throw an error or return early
    return; 
  }

  try {
    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        viewCounter: {
          increment: 1,
        },
      },
    });
    // console.log(`Incremented view count for listing: ${listingId}`); // Optional logging
  } catch (error) {
    console.error(`Error incrementing view count for listing ${listingId}:`, error);
    // Re-throw or handle the error as appropriate for your application
    // throw new Error(`Failed to increment view count for listing ${listingId}`);
  }
} 