/**
 * API route for managing specific listings by ID
 *
 * This route handles favoriting and deleting individual listings.
 * Only the owner of a listing can delete it.
 *
 * @module api/listings/[listingId]
 */

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

/**
 * Route parameters interface
 *
 * @interface IParams
 * @property {string} listingId - ID of the listing to manage
 */
interface IParams {
  listingId: string;
}

/**
 * Add the current listing to user's favorites
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
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  // Increment the favoritesCount for the listing
  await prisma.listing.update({
    where: { id: listingId },
    data: { favoritesCount: { increment: 1 } },
  });

  return NextResponse.json(user);
}

/**
 * Delete a listing (owner only)
 *
 * This endpoint first validates ownership, then decrements favorites count
 * if needed, and finally deletes the listing entirely.
 *
 * @async
 * @function DELETE
 * @param {Request} request - The incoming request object
 * @param {Object} params - The route parameters object
 * @param {IParams} params.params - The parsed route parameters
 * @returns {Promise<NextResponse>} JSON response with success message
 * @throws {Error} When listingId is invalid or user lacks permission
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

  // Check if the listing exists and belongs to the current user
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { favoritesCount: true, userId: true },
  });

  if (!listing) {
    return NextResponse.error();
  }

  if (listing.userId !== currentUser.id) {
    return NextResponse.error();
  }

  // Decrement the favoritesCount for the listing if it's greater than 0
  if (listing.favoritesCount > 0) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { decrement: 1 } },
    });
  } else {
    console.log(
      `Cannot decrement favoritesCount for listing ${listingId}. Current count is ${listing.favoritesCount}`,
    );
  }

  // Delete the listing
  await prisma.listing.delete({
    where: { id: listingId },
  });

  return NextResponse.json({ message: "Listing deleted successfully" });
}
