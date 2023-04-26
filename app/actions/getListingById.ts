import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
        images: true,
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: listing.user
          ? {
            ...listing.user,
            createdAt: listing.user.createdAt.toString(),
            updatedAt: listing.user.updatedAt.toString(),
            emailVerified: listing.user.emailVerified?.toString() || null,
          }
          : null,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
