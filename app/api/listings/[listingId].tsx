import React from 'react';
import ListingHead from '@/app/components/listings/ListingHead';
import { useRouter } from 'next/router';

// Mock data for demonstration purposes
const mockListing = {
  title: 'Example Listing',
  locationValue: 'US',
  images: [{ url: 'https://example.com/image1.jpg' }, { url: 'https://example.com/image2.jpg' }],
  id: '1',
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://example.com/johndoe.jpg',
    hashedPassword: 'hashedpassword',
    favoriteIds: [],
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    emailVerified: null
  },
  favoritesCount: 10,
  viewCounter: 20,
};


const ListingPage: React.FC = () => {
  const router = useRouter();
  const { listingId } = router.query;

  // Fetch your listing data here using the listingId
  // For this example, we'll use the mockListing data

  return (
    <div>
      <ListingHead
        title={mockListing.title}
        locationValue={mockListing.locationValue}
        images={mockListing.images}
        id={mockListing.id}
        currentUser={mockListing.currentUser}
        favoritesCount={mockListing.favoritesCount}
        viewCounter={mockListing.viewCounter}
        onView={() => void 0}
      />

    </div>
  );
};

export default ListingPage;
