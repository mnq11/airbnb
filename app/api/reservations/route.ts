/**
 * API route for managing property reservations
 *
 * This route handles fetching reservations with pagination and filtering,
 * as well as creating new reservations for property listings.
 *
 * @module api/reservations
 */

import { NextResponse } from "next/server";
import getReservations from "@/app/actions/getReservations";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

/**
 * Fetch reservations with filtering and pagination
 *
 * Can filter by author (property owner) or user (guest who made the reservation).
 * Supports pagination with configurable page size.
 *
 * @async
 * @function GET
 * @param {Request} request - The incoming request object with search parameters
 * @returns {Promise<NextResponse>} JSON response with reservations and total count
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const authorId = searchParams.get("authorId") || undefined;
  const userId = searchParams.get("userId") || undefined;

  if (!authorId && !userId) {
    return NextResponse.json(
      { error: "Author ID or User ID is required" },
      { status: 400 },
    );
  }

  try {
    const { reservations, total } = await getReservations({
      authorId,
      userId,
      page,
      limit,
    });

    return NextResponse.json({ reservations: reservations || [], total });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Create a new reservation
 *
 * Creates a reservation for a specific listing with start date, end date,
 * and total price calculated for the stay.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request with reservation data in body
 * @returns {Promise<NextResponse>} JSON response with the created reservation
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
