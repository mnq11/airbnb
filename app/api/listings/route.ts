/**
 * API route for managing property listings
 * 
 * This route handles fetching listings with various filters and
 * creating new property listings with associated metadata and images.
 * 
 * @module api/listings
 */

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getListings from "@/app/actions/getListings";

/**
 * Fetch listings with optional filtering
 * 
 * Supports filtering by user, guest count, room count, bathroom count, 
 * date range, location, category, and view count. Also supports pagination.
 * 
 * @async
 * @function GET
 * @param {Request} request - The incoming request object with search parameters
 * @returns {Promise<NextResponse>} JSON response with listings and total count
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = {
    userId: searchParams.get("userId") || undefined,
    guestCount: searchParams.get("guestCount")
      ? Number(searchParams.get("guestCount"))
      : undefined,
    roomCount: searchParams.get("roomCount")
      ? Number(searchParams.get("roomCount"))
      : undefined,
    bathroomCount: searchParams.get("bathroomCount")
      ? Number(searchParams.get("bathroomCount"))
      : undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    locationValue: searchParams.get("locationValue") || undefined,
    category: searchParams.get("category") || undefined,
    viewsCount: searchParams.get("viewsCount")
      ? Number(searchParams.get("viewsCount"))
      : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  try {
    const { listings, total } = await getListings(params);
    return NextResponse.json({ listings, total });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Error fetching listings" },
      { status: 500 },
    );
  }
}

/**
 * Create a new property listing
 * 
 * Creates a new listing with all associated metadata and images.
 * Requires authenticated user and properly formatted listing data.
 * 
 * @async
 * @function POST
 * @param {Request} request - The incoming request with listing data in body
 * @returns {Promise<NextResponse>} JSON response with the created listing
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    const data = await request.json();

    const {
      category,
      location,
      guestCount,
      roomCount,
      bathroomCount,
      price,
      title,
      description,
      phone,
      paymentMethod,
      imageSrc,
    } = data;

    const locationValue = location.value;
    const updatedDescription = `${description}\n\nرقم الهاتف: ${phone}\nطريقة الدفع المفضلة: ${paymentMethod}`;

    const newListing = await prisma.listing.create({
      data: {
        category,
        locationValue,
        guestCount,
        roomCount,
        bathroomCount,
        price: parseInt(price, 10),
        title,
        description: updatedDescription,
        userId: currentUser.id,
        images: {
          create: imageSrc.map((url: string) => ({ url })),
        },
      },
    });

    return NextResponse.json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the listing" },
      { status: 500 },
    );
  }
}
