/**
 * NextAuth.js API Route
 *
 * This API route configures authentication for the application using NextAuth.js.
 * It sets up multiple authentication providers, database integration with Prisma,
 * and custom authentication strategies.
 *
 * Features:
 * - Multiple OAuth providers (GitHub, Google)
 * - Email/password credentials provider with bcrypt password comparison
 * - Prisma adapter for database integration
 * - JWT-based session strategy
 * - Custom sign-in page configuration
 *
 * @module api/auth/[...nextauth]
 */

import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

/**
 * NextAuth configuration options
 *
 * Defines all authentication providers, database adapter,
 * session configuration, and custom page routes.
 *
 * @type {AuthOptions}
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      /**
       * Authorizes a user based on provided credentials
       *
       * Checks email/password against database records with bcrypt comparison.
       *
       * @async
       * @param {Object} credentials - User-provided credentials
       * @returns {Promise<User|null>} User object if authorized, null otherwise
       * @throws {Error} When credentials are invalid
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
