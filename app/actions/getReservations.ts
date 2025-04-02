// File: /app/actions/getReservations.ts

import prisma from "@/app/libs/prismadb";

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
 * Interface for reservation data returned from the database
 * 
 * @interface Reservation
 * @property {string} id - Unique identifier for the reservation
 * @property {Date} createdAt - When the reservation was created
 * @property {Date} startDate - Check-in date
 * @property {Date} endDate - Check-out date
 * @property {string} userId - ID of user who made the reservation
 * @property {string} listingId - ID of the property being reserved
 * @property {number} totalPrice - Total price for the entire stay
 * @property {Object} listing - Detailed property information
 * @property {string} listing.id - Property ID
 * @property {Date} listing.createdAt - When the property listing was created
 * @property {Array<{url: string}>} listing.images - Property images
 * @property {string} listing.title - Property title
 * @property {string} listing.description - Property description
 * @property {string} listing.category - Property category/type
 * @property {number} listing.roomCount - Number of rooms
 * @property {number} listing.bathroomCount - Number of bathrooms
 * @property {number} listing.guestCount - Maximum number of guests
 * @property {string} listing.locationValue - Location identifier
 * @property {string|null} listing.userId - ID of property owner
 * @property {number} listing.price - Base price per night
 * @property {number} listing.favoritesCount - Number of users who favorited this property
 * @property {number} listing.viewCounter - Number of times this property has been viewed
 */
interface Reservation {
  id: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  userId: string;
  listingId: string;
  totalPrice: number;
  listing: {
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
  };
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
 * @returns {Promise<{reservations: any[], total: number}>} Reservations and total count
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

    const reservations: Reservation[] = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reservations: reservations.map((reservation: Reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation.listing.createdAt.toISOString(),
          images: reservation.listing.images.map((image) => ({
            url: image.url,
          })),
        },
      })),
      total,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
