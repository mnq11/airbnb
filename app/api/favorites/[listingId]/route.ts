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
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  // Increment the favoritesCount for the listing
  const listing = await prisma.listing.update({
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
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  // Decrement the favoritesCount for the listing
  const listing = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      favoritesCount: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json(user);
}
