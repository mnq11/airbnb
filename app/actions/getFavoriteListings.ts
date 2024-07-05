import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { SafeListing } from "@/app/types"; // Import SafeListing type

// Define the interface for your favorite object
interface Favorite {
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
}

export default async function getFavoriteListings(): Promise<SafeListing[]> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites: Favorite[] = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
      include: {
        images: true, // Include the images relation
      },
    });

    const safeFavorites: SafeListing[] = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
      images: favorite.images.map((image) => ({
        url: image.url,
      })),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
