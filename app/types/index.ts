import { Reservation, Listing, User } from "@prisma/client";

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: Omit<Listing, "createdAt"> & {
    createdAt: string;
    images: { url: string }[];
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
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  images: { url: string }[];
  viewCounter?: number;
};
