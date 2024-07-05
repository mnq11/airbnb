// File: /app/actions/getReservations.ts

import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
}

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
