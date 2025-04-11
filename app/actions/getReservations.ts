// File: /app/actions/getReservations.ts

import prisma from "@/app/libs/prismadb";
import { SafeReservation } from "@/app/types"; // Import the correct SafeReservation type

/**
 * Interface for getReservations parameters
 *
 * @interface IParams
 * @property {string} [listingId] - Filter reservations by specific property listing ID
 * @property {string} [userId] - Filter reservations by user who made the booking
 * @property {string} [authorId] - Filter reservations by property owner ID
 * @property {number} [page=1] - Page number for pagination
 * @property {number} [limit=10] - Number of reservations per page
 */
interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
}

/**
 * Retrieves reservations with filtering and pagination support
 *
 * This function fetches reservation data from the database with various filtering options:
 * - By listing ID (for a specific property's reservations)
 * - By user ID (for trips booked by a specific user)
 * - By author ID (for reservations on properties owned by a specific user)
 *
 * The function also supports pagination and includes detailed property information
 * with each reservation. Date fields are converted to ISO strings for client use.
 *
 * @async
 * @function getReservations
 * @param {IParams} params - Filter and pagination parameters
 * @returns {Promise<{reservations: SafeReservation[], total: number}>} Reservations and total count
 * @throws {Error} If database query fails
 */
export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId, page = 1, limit = 10 } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const total = await prisma.reservation.count({ where: query });

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: {
          select: {
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
            latitude: true,
            longitude: true,
            images: {
              select: { url: true }
            },
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const safeReservations: SafeReservation[] = reservations.map(
      (reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation.listing.createdAt.toISOString(),
        },
      })
    );

    return {
      reservations: safeReservations,
      total,
    };
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations.");
  }
}
