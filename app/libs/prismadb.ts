/**
 * Prisma client singleton configuration
 * 
 * This module configures and exports a singleton instance of PrismaClient
 * to prevent multiple instances during development hot reloading.
 * In production, it creates a single instance, while in development it
 * attaches the instance to the global object to maintain connection across reloads.
 * 
 * @module libs/prismadb
 */

import { PrismaClient } from "@prisma/client";

/**
 * Extends the global namespace to include the prisma client
 */
declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, attach to global to preserve connection between hot reloads
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  prisma = globalThis.prisma;
}

export default prisma;
