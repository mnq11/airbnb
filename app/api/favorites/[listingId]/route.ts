/**
 * API route for managing favorite listings
 *
 * This route handles adding and removing listings from a user's favorites list.
 * It also maintains a favorites counter on each listing to track popularity.
 *
 * @module api/favorites
 */

import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

/**
 * Route parameters interface
 *
 * @interface IParams
 * @property {string} [listingId] - ID of the listing to favorite/unfavorite
 */
interface IParams {
  listingId?: string;
}

/**
 * Add a listing to the current user's favorites
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request object
 * @param {Object} params - The route parameters object
 * @param {IParams} params.params - The parsed route parameters
 * @returns {Promise<NextResponse>} JSON response with updated user data
 * @throws {Error} When listingId is invalid
 */
export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // Avoid adding duplicates if already favorited
  if (!favoriteIds.includes(listingId)) {
      favoriteIds.push(listingId);
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    // Increment the favoritesCount for the listing
    // Use updateMany to avoid errors if listing doesn't exist, although it ideally should
    await prisma.listing.updateMany({
      where: {
        id: listingId,
      },
      data: {
        favoritesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
      console.error("Error adding favorite:", error);
      return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

/**
 * Remove a listing from the current user's favorites
 *
 * @async
 * @function DELETE
 * @param {Request} request - The incoming request object
 * @param {Object} params - The route parameters object
 * @param {IParams} params.params - The parsed route parameters
 * @returns {Promise<NextResponse>} JSON response with updated user data
 * @throws {Error} When listingId is invalid
 */
export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
     return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  try {
    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    // Decrement the favoritesCount only if it's greater than 0
    await prisma.listing.updateMany({
      where: {
        id: listingId,
        favoritesCount: {
          gt: 0, // Only update if count is greater than 0
        },
      },
      data: {
        favoritesCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
