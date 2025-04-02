import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

/**
 * Retrieves the current active session from NextAuth
 * 
 * This function is a wrapper around getServerSession that uses the application's
 * authentication options to retrieve the current session context.
 * 
 * @async
 * @function getSession
 * @returns {Promise<Session|null>} The current session or null if no active session exists
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Retrieves the currently authenticated user from the database
 * 
 * This server action fetches the current user's data based on their session email.
 * It performs safe error handling and serializes date fields for client-side use.
 * 
 * @async
 * @function getCurrentUser
 * @returns {Promise<SafeUser|null>} The current user with serialized dates or null if no authenticated user
 * @throws {null} Returns null instead of throwing if an error occurs during fetching
 */
export default async function getCurrentUser() {
  try {
    // Get the current session
    const session = await getSession();

    // If no session or no user email exists, return null
    if (!session?.user?.email) {
      return null;
    }

    // Fetch user data from database using their email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    // If user not found in database, return null
    if (!currentUser) {
      return null;
    }

    // Return user data with dates serialized to ISO strings for client-side use
    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    // Return null if any error occurs during the process
    return null;
  }
}
