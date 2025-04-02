/**
 * API route for user registration
 *
 * Handles creating new user accounts with email, name, and secure password storage.
 * Performs validation and prevents duplicate email registrations.
 *
 * @module api/register
 */

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

/**
 * Register a new user
 *
 * Creates a new user account with hashed password. Validates required fields
 * and prevents registration with an email that's already in use.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request with registration data in the body
 * @returns {Promise<NextResponse>} JSON response with the created user or error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
