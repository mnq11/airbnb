# Yemen Property Rental Platform

![Platform Logo](/public/images/logo.png)

## Overview

A full-featured property rental platform built with Next.js, React, TypeScript, and MongoDB. This application enables users to list properties, make reservations, and manage their rental experiences.

### Key Features

- User authentication with email/password and OAuth providers
- Property listing creation and management
- Advanced search with filters for location, dates, and guest counts
- Reservation system with calendar integration
- Favorites tracking system
- View counter for listing popularity
- Responsive design with Arabic localization

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see [Installation Guide](./docs/INSTALLATION.md))
4. Run development server: `npm run dev`
5. Access the application at `http://localhost:3000` or your machine ip

## Documentation

- [Installation Guide](./docs/INSTALLATION.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Maps**: Leaflet
- **Forms**: React Hook Form

## Screenshots

![Homepage](/docs/images/homepage.png)
![Listing Detail](/docs/images/listing-detail.png)
![Search Modal](/docs/images/search-modal.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
