// pages/api/listings/[listingId]/viewCounter.ts

// Handles PUT requests to increment view counter
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { listingId } = req.query;
  if (!listingId) {
    return res.status(400).json({ message: 'Listing ID is required' });
  }

  try {
    await prisma.listing.update({
      where: { id: listingId as string },
      data: { viewCounter: { increment: 1 } },
    });
    res.status(200).json({ message: 'View count incremented successfully' });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'An error occurred while incrementing the view count' });
  }
}
