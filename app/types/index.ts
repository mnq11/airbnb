/**
 * Type definitions for the application
 *
 * This module contains safe versions of database types that are properly
 * serialized for use in the client-side code. It handles date serialization
 * and includes only the necessary fields for each model.
 *
 * @module types
 */

import { Reservation, Listing, User } from "@prisma/client";

/**
 * Safe version of Reservation for client-side use
 *
 * Converts dates to strings and includes necessary listing data
 * with proper typing for the nested listing object.
 *
 * @typedef {Object} SafeReservation
 */
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

/**
 * Safe version of User for client-side use
 *
 * Converts dates to strings and properly handles nullable fields.
 *
 * @typedef {Object} SafeUser
 */
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

/**
 * Safe version of Listing for client-side use
 *
 * Converts dates to strings and includes image URLs
 * in an appropriate format for rendering.
 *
 * @typedef {Object} SafeListing
 */
export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  images: { url: string }[];
  viewCounter?: number;
};
