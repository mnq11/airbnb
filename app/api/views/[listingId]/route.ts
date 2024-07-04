// app/api/views/[listingId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Increment the viewsCount for the listing
  const listing = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      viewCounter: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(listing);
}
