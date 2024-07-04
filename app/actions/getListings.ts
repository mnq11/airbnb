import prisma from '@/app/libs/prismadb';
import { SafeListing } from '@/app/types';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  viewsCount?: number;
  page?: number;
  limit?: number;
}

export default async function getListings(params: IListingsParams): Promise<{ listings: SafeListing[], total: number }> {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
      viewsCount,
      page = 1,
      limit = 20,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    if (viewsCount) {
      query.viewsCount = {
        gte: +viewsCount,
      };
    }

    const total = await prisma.listing.count({ where: query });

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      listings: listings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        images: listing.images.map((image) => ({ url: image.url })),
      })),
      total,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
