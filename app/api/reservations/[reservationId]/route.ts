/**
 * API route for managing individual reservations
 *
 * This route handles operations on specific reservations identified by ID,
 * currently supporting deletion by either the guest who made the reservation
 * or the owner of the property.
 *
 * @module api/reservations/[reservationId]
 */

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

/**
 * Route parameters interface
 *
 * @interface IParams
 * @property {string} [reservationId] - ID of the reservation to manage
 */
interface IParams {
  reservationId?: string;
}

/**
 * Delete a reservation
 *
 * Allows cancellation of a reservation by either the user who made it
 * or the owner of the property being reserved.
 *
 * @async
 * @function DELETE
 * @param {Request} request - The incoming request object
 * @param {Object} params - The route parameters object
 * @param {IParams} params.params - The parsed route parameters
 * @returns {Promise<NextResponse>} JSON response with deletion result
 * @throws {Error} When reservationId is invalid
 */
export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return NextResponse.json(reservation);
}
