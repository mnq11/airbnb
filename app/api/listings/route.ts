// app/api/listings/route.ts
// Handles POST requests to create a listing
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { Prisma } from '.prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { title, description, images = [], category, roomCount, bathroomCount, guestCount, location, price } = req.body;
    // Assuming validation passes
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
          connect: { id: currentUser.id },
        },
        images: {
          create: images.map((imageUrl: any) => ({ url: imageUrl })),
        },
      },
      include: { images: true },
    });

    res.status(201).json(listing);
  } catch (error: any) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Failed to create listing' });
  }
}
