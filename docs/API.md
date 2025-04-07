# API Documentation

This document outlines all API endpoints available in the Yemen Property Rental Platform.

## Authentication

### Register a New User

```
POST /api/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Authentication (NextAuth)

NextAuth.js endpoints handle user authentication:

```
POST /api/auth/signin
POST /api/auth/callback/:provider
GET /api/auth/session
POST /api/auth/signout
```

## Listings

### Get Listings

```
GET /api/listings
```

**Query Parameters:**

- `userId` - Filter by owner
- `guestCount` - Minimum guest capacity
- `roomCount` - Minimum room count
- `bathroomCount` - Minimum bathroom count
- `startDate` - Available from date
- `endDate` - Available until date
- `locationValue` - Location identifier
- `category` - Property category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**

```json
{
  "listings": [
    {
      "id": "listing-id",
      "title": "Property Title",
      "description": "Property description",
      "category": "شاليهات",
      "roomCount": 3,
      "bathroomCount": 2,
      "guestCount": 6,
      "locationValue": "location-id",
      "price": 5000,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "user": {
        /* user data */
      },
      "images": [{ "url": "image-url" }],
      "favoritesCount": 5,
      "viewCounter": 120
    }
  ],
  "total": 45
}
```

### Create Listing

```
POST /api/listings
```

**Request Body:**

```json
{
  "category": "شاليهات",
  "location": { "value": "location-id", "label": "Location Name" },
  "guestCount": 4,
  "roomCount": 2,
  "bathroomCount": 1,
  "imageSrc": ["image-url-1", "image-url-2"],
  "price": 5000,
  "title": "Property Title",
  "description": "Property description",
  "phone": "123456789",
  "paymentMethod": "Cash"
}
```

**Response:**

```json
{
  "id": "listing-id",
  "title": "Property Title",
  "description": "Property description"
  /* ... other listing fields ... */
}
```

### Delete Listing

```
DELETE /api/listings/:listingId
```

**Response:**

```json
{
  "message": "Listing deleted successfully"
}
```

## Favorites

### Add to Favorites

```
POST /api/favorites/:listingId
```

**Response:** Updated user object

### Remove from Favorites

```
DELETE /api/favorites/:listingId
```

**Response:** Updated user object

## Reservations

### Get Reservations

```
GET /api/reservations
```

**Query Parameters:**

- `authorId` - Filter by property owner
- `userId` - Filter by guest
- `page` - Page number
- `limit` - Items per page

**Response:**

```json
{
  "reservations": [
    {
      "id": "reservation-id",
      "startDate": "2023-01-10T00:00:00.000Z",
      "endDate": "2023-01-15T00:00:00.000Z",
      "totalPrice": 25000,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "listing": {
        /* listing data */
      }
    }
  ],
  "total": 5
}
```

### Create Reservation

```
POST /api/reservations
```

**Request Body:**

```json
{
  "listingId": "listing-id",
  "startDate": "2023-01-10T00:00:00.000Z",
  "endDate": "2023-01-15T00:00:00.000Z",
  "totalPrice": 25000
}
```

**Response:** Updated listing with new reservation

### Cancel Reservation

```
DELETE /api/reservations/:reservationId
```

**Response:** Deletion confirmation object

## Views

### Increment View Count

```
POST /api/views/:listingId
```

**Response:** Updated listing object with incremented view counter
