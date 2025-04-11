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
    // Return 401 Unauthorized
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    // Return 400 Bad Request for invalid ID
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Fetch the listing to check ownership before deleting
  const listing = await prisma.listing.findUnique({
    where: { id: listingId, userId: currentUser.id }, // Combine check
    select: { id: true }, // Only need to know if it exists and belongs to user
  });

  // If listing doesn't exist or doesn't belong to the user
  if (!listing) {
     // Return 403 Forbidden (or 404 Not Found - 403 is often better for security)
    return NextResponse.json({ error: "Listing not found or you do not have permission to delete it." }, { status: 403 });
  }

  // Delete the listing - No need to check/decrement favoritesCount here
  try {
    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
     // Return 500 Internal Server Error if deletion fails
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
