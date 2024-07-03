import { NextResponse } from 'next/server';
import getListings, { IListingsParams } from '@/app/actions/getListings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: IListingsParams = {
    userId: searchParams.get('userId') || undefined,
    guestCount: searchParams.get('guestCount') ? Number(searchParams.get('guestCount')) : undefined,
    roomCount: searchParams.get('roomCount') ? Number(searchParams.get('roomCount')) : undefined,
    bathroomCount: searchParams.get('bathroomCount') ? Number(searchParams.get('bathroomCount')) : undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    locationValue: searchParams.get('locationValue') || undefined,
    category: searchParams.get('category') || undefined,
    viewsCount: searchParams.get('viewsCount') ? Number(searchParams.get('viewsCount')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
  };

  try {
    const { listings, total } = await getListings(params);
    return NextResponse.json({ listings, total });
  } catch (error) {
    console.error('Error fetching listings:', error);

    return NextResponse.error();}
}
