/**
 * API route for tracking listing view counts
 * 
 * This route handles incrementing the view counter for property listings
 * each time they are viewed by a user.
 * 
 * @module api/views/[listingId]
 */

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

/**
 * Route parameters interface
 * 
 * @interface IParams
 * @property {string} [listingId] - ID of the listing to increment views for
 */
interface IParams {
  listingId?: string;
}

/**
 * Increment view count for a listing
 * 
 * Updates the viewCounter field on a listing by adding 1 each time
 * the listing is viewed.
 * 
 * @async
 * @function POST
 * @param {Request} request - The incoming request object
 * @param {Object} params - The route parameters object
 * @param {IParams} params.params - The parsed route parameters
 * @returns {Promise<NextResponse>} JSON response with the updated listing
 * @throws {Error} When listingId is invalid
 */
export async function POST(request: Request, { params }: { params: IParams }) {
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Increment the viewsCount for the listing
  const listing = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      viewCounter: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(listing);
}
