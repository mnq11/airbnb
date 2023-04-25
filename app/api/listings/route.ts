// app/api/listings/route.ts
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import getCurrentUser from "@/app/actions/getCurrentUser";
import {Prisma} from ".prisma/client";
import ListingCreateInput = Prisma.ListingCreateInput;

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
