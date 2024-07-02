import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const {
      category,
      location, // This is the object containing label, value, latlng
      guestCount,
      roomCount,
      bathroomCount,
      price, // Ensure this is an integer
      title,
      description,
      phone,
      paymentMethod,
      imageSrc, // Ensure this is an array of string URLs
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
        price: parseInt(price, 10), // Convert the price to an integer
        title,
        description: updatedDescription,
        userId: currentUser.id,
        images: {
          create: imageSrc.map((url: string) => ({ url })), // Ensure each URL is mapped correctly
        },
      },
    });

    return NextResponse.json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
