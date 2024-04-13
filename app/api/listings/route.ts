// app/api/listings/route.ts
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import getCurrentUser from "@/app/actions/getCurrentUser";
import {Prisma} from ".prisma/client";
import ListingCreateInput = Prisma.ListingCreateInput;
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { title, description, images = [], category, roomCount, bathroomCount, guestCount, location, price } = body;


  // console.log( "body", body );

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // First, create the listing and its associated images
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      user: {
        connect: {
          id: currentUser.id,
        },
      },
      images: {
        create: images.map((imageUrl: any) => ({
          url: imageUrl,
        })),
      },
    } as ListingCreateInput,
    include: { images: true },
  });


  return NextResponse.json(listing);
}

const viewCounter = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { listingId } = req.query;
  if (!listingId) {
    res.status(400).json({ message: 'Listing ID is required' });
    return;
  }

  try {
    const updatedListing = await prisma.listing.update({
      where: { id: listingId as string },
      data: { viewCounter: { increment: 1 } },
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'An error occurred while incrementing the view count' });
  }
};

export default viewCounter;