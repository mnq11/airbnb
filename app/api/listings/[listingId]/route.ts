// app/api/listings/[listingId]/route.ts
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(request: Request) {
  const listingId = request.url.split('/').pop();

  if (!listingId) {
    return NextResponse.error();
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    // First, delete the related ListingImage records
    await prisma.listingImage.deleteMany({
      where: {
        listingId: listingId,
      },
    });

    // Then, delete the Listing record
    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });

    return NextResponse.json({ message: 'Listing deleted successfully', redirectURL: '/properties' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
