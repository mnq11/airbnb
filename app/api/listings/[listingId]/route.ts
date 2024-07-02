import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

interface IParams {
  listingId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  // Increment the favoritesCount for the listing
  await prisma.listing.update({
    where: { id: listingId },
    data: { favoritesCount: { increment: 1 } },
  });

  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  // Check if the listing exists and belongs to the current user
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { favoritesCount: true, userId: true },
  });

  if (!listing) {
    return NextResponse.error();
  }

  if (listing.userId !== currentUser.id) {
    return NextResponse.error();
  }

  // Decrement the favoritesCount for the listing if it's greater than 0
  if (listing.favoritesCount > 0) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { decrement: 1 } },
    });
  } else {
    console.log(`Cannot decrement favoritesCount for listing ${listingId}. Current count is ${listing.favoritesCount}`);
  }

  // Delete the listing
  await prisma.listing.delete({
    where: { id: listingId },
  });

  return NextResponse.json({ message: 'Listing deleted successfully' });
}
