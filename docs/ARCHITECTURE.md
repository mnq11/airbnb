# Architecture Overview

This document describes the architecture of the Yemen Property Rental Platform.

## System Architecture

![Architecture Diagram](/docs/images/architecture-diagram.png)

The application follows a modern Next.js architecture with React components, API routes, and database integration.

## Logical Architecture Diagram

```mermaid
graph TD
    subgraph "Client Layer"
        A[User Interface] --> B[React Components]
        B --> C[Custom Hooks]
        B --> D[Zustand Store]
    end
    
    subgraph "Server Layer"
        E[Next.js App Router] --> F[API Routes]
        E --> G[Server Components]
        F --> H[NextAuth.js]
        F --> I[Server Actions]
    end
    
    subgraph "Data Layer"
        J[Prisma ORM] --> K[MongoDB]
    end
    
    D <--> F
    C <--> F
    G <--> J
    F <--> J
    I <--> J
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#bbf,stroke:#333,stroke-width:2px
```

## Key Components

### Frontend

- **Next.js App Router**: Routes and renders pages
- **React Components**: UI building blocks
- **Zustand Stores**: State management for modals and UI state
- **React Query/SWR**: Data fetching and caching
- **TypeScript**: Type safety throughout the application

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **NextAuth.js**: Authentication system
- **Prisma ORM**: Database access layer
- **Middleware**: Request processing and validation

### Database

- **MongoDB**: Document database
- **Collections**:
  - Users
  - Accounts (OAuth)
  - Listings
  - ListingImages
  - Reservations

## Data Flow

1. **User Interaction** → Client-side React components
2. **Data Fetching** → API routes or Server Components
3. **Data Persistence** → Prisma ORM → MongoDB
4. **Authentication** → NextAuth.js → Database

## Directory Structure

```
├── app/
│   ├── actions/          # Server actions for data fetching
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── favorites/    # Favorites management
│   │   ├── listings/     # Listing CRUD operations
│   │   ├── register/     # User registration
│   │   ├── reservations/ # Reservation management
│   │   └── views/        # View counter functionality
│   ├── components/       # React components
│   │   ├── inputs/       # Form input components
│   │   ├── listings/     # Listing-related components
│   │   ├── modals/       # Modal dialog components
│   │   └── navbar/       # Navigation components
│   ├── favorites/        # Favorites page
│   ├── hooks/            # Custom React hooks
│   ├── libs/             # Utility libraries
│   ├── listings/         # Listing pages
│   ├── providers/        # Context providers
│   ├── reservations/     # Reservation pages
│   ├── trips/            # User trips page
│   ├── types/            # TypeScript definitions
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── pages/
│   └── api/
│       └── auth/         # NextAuth API routes
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## User Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant Auth as AuthAPI
    participant DB as Database
    
    User->>UI: Click Login
    UI->>UI: Open Login Modal
    User->>UI: Enter Credentials
    UI->>Auth: POST /api/auth
    Auth->>DB: Verify User
    DB->>Auth: User Data
    Auth->>UI: JWT Session
    UI->>UI: Update UI State
```

### Listing Creation Flow

```mermaid
flowchart TD
    A[User] --> B{Authenticated?}
    B -->|No| C[Login Modal]
    B -->|Yes| D[Click Add Property]
    D --> E[Open RentModal]
    E --> F[Multi-step Form]
    F --> G[Submit Listing]
    G --> H[Create in Database]
    H --> I[Redirect to Listing]
```

## Performance Considerations

- Server Components for data-heavy pages
- Client Components for interactive elements
- Image optimization with Next.js Image component
- Pagination for listing results
- Optimistic UI updates for better user experience

## Security Measures

- NextAuth.js for secure authentication
- Password hashing with bcrypt
- JWT session management
- Prisma for type-safe database queries
- Input validation on API endpoints
- Owner verification for sensitive operations 

## Detailed Subsystem Diagrams

### Reservation System Workflow

```mermaid
sequenceDiagram
    actor Guest as Guest
    actor Host as Property Owner
    participant UI as Frontend
    participant API as Reservation API
    participant DB as Database
    participant Notif as Notifications
    
    Guest->>UI: Select Dates on Listing
    UI->>UI: Calculate Total Price
    Guest->>UI: Submit Reservation
    UI->>API: POST /api/reservations
    API->>DB: Create Reservation
    DB->>API: Reservation Created
    API->>UI: Success Response
    UI->>UI: Show Confirmation
    API->>Notif: Notify Host
    Notif->>Host: New Reservation Alert
    
    Host->>UI: View Reservations
    UI->>API: GET /api/reservations
    API->>DB: Query Reservations
    DB->>API: Reservation Data
    API->>UI: Display Reservations
    
    Host->>UI: Accept/Reject Reservation
    UI->>API: PATCH /api/reservations/{id}
    API->>DB: Update Status
    DB->>API: Status Updated
    API->>Notif: Notify Guest
    Notif->>Guest: Reservation Status Update
```

### Property Listing Subsystem

```mermaid
graph TD
    subgraph "Listing Creation"
        A[RentModal] --> B{Category Selection}
        B --> C{Location Selection}
        C --> D{Property Details}
        D --> E{Images Upload}
        E --> F{Description}
        F --> G{Price Setting}
        G --> H[Submit Listing]
    end
    
    subgraph "Listing Display"
        I[ListingCard] --> J[Image Carousel]
        I --> K[Price Display]
        I --> L[Favorite Button]
        I --> M[Location]
        I --> N[Category]
    end
    
    subgraph "Listing Detail"
        O[ListingClient] --> P[Header]
        O --> Q[Images]
        O --> R[Description]
        O --> S[Amenities]
        O --> T[Map]
        O --> U[Reservation Calendar]
    end
    
    H --> X[API: createListing]
    X --> Y[Prisma: Create]
    Y --> Z[Database]
    
    Z --> AA[API: getListings]
    AA --> I
    Z --> AB[API: getListingById]
    AB --> O
```

### Authentication System Detail

```mermaid
flowchart TD
    A[User] --> B[Login Form]
    A --> C[Registration Form]
    A --> D[OAuth Providers]
    
    B --> E[NextAuth API]
    C --> F[Register API]
    D --> E
    
    E --> G{Valid Credentials?}
    F --> H[Create User]
    H --> E
    
    G -->|Yes| I[JWT Session]
    G -->|No| J[Error Response]
    
    I --> K[Current User Middleware]
    K --> L[Safe User Object]
    
    L --> M[Protected Routes]
    L --> N[Conditional UI Elements]
    L --> O[UserMenu Component]
```

### State Management with Zustand

```mermaid
graph TD
    subgraph "Modal Stores"
        A[useLoginModal] --> B[LoginModal Component]
        C[useRegisterModal] --> D[RegisterModal Component]
        E[useRentModal] --> F[RentModal Component]
        G[useSearchModal] --> H[SearchModal Component]
    end
    
    subgraph "Component Interactions"
        I[UserMenu] --> A
        I --> C
        I --> E
        J[Navbar] --> G
        K[EmptyState] --> A
        L[Category Selection] --> G
    end
    
    subgraph "Data Flow"
        M[State Changes] --> N[UI Updates]
        O[User Actions] --> P[Store Methods]
        P --> M
    end
    
    B --> Q[Auth API]
    D --> Q
    F --> R[Listings API]
    H --> S[Search Parameters]
    S --> T[Filtered Results]
```

### Search & Filtering System

```mermaid
graph TD
    subgraph "User Interface"
        A[Search Bar] --> B[SearchModal]
        C[Filter Buttons] --> B
        D[Map View Toggle] --> E[Map Component]
    end
    
    subgraph "Search Logic"
        B --> F[Search Parameters]
        F --> G[useSearchParams Hook]
        G --> H[URL Query Parameters]
        H --> I[getListings API]
    end
    
    subgraph "Filtering Components"
        F --> J[Location Input]
        F --> K[Date Range Picker]
        F --> L[Guest Counter]
        F --> M[Category Filter]
        F --> N[Price Range]
        F --> O[Room/Bathroom Count]
    end
    
    subgraph "Results Display"
        I --> P[ListingGrid]
        I --> E
        P --> Q[ListingCard Components]
        E --> R[Map Markers]
        R --> Q
    end
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style P fill:#9bf,stroke:#333,stroke-width:2px
```

### Favorites System

```mermaid
sequenceDiagram
    actor User
    participant UI as User Interface
    participant Heart as FavoriteButton
    participant API as Favorites API
    participant DB as Database
    participant List as FavoritesClient
    
    User->>UI: View Listing
    UI->>Heart: Render Heart Icon
    User->>Heart: Click Heart Icon
    
    alt User Not Logged In
        Heart->>UI: Show Login Modal
    else User Logged In
        Heart->>API: POST /api/favorites/{listingId}
        API->>DB: Update User Favorites
        DB->>API: Success Response
        API->>Heart: Update Heart State
        Heart->>UI: Visual Feedback
    end
    
    User->>UI: Navigate to Favorites Page
    UI->>API: GET /api/favorites
    API->>DB: Fetch User Favorites
    DB->>API: Favorites Data
    API->>List: Render Favorite Listings
    List->>UI: Display Grid of Favorites
    
    User->>Heart: Click Heart on Favorite
    Heart->>API: DELETE /api/favorites/{listingId}
    API->>DB: Remove from Favorites
    DB->>API: Success Response
    API->>List: Update UI
    List->>UI: Remove Card with Animation
```

### User Profile & Properties Management

```mermaid
graph TD
    subgraph "User Menu"
        A[UserMenu Component] --> B[Profile Option]
        A --> C[My Properties]
        A --> D[My Trips]
        A --> E[My Favorites]
        A --> F[My Reservations]
    end
    
    subgraph "Properties Management"
        C --> G[PropertiesPage]
        G --> H[PropertiesClient]
        H --> I[Listing Grid]
        I --> J[ListingCard]
        J --> K[Delete Button]
        K --> L[API: deleteListing]
        L --> M[DB: Remove Listing]
        
        A --> N[Add Property Button]
        N --> O[RentModal]
        O --> P[Create Listing Flow]
    end
    
    subgraph "Authentication & Profile"
        A --> Q[Login/Register]
        Q --> R[NextAuth]
        R --> S[User Session]
        S --> T[currentUser]
        T --> A
    end
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#9bf,stroke:#333,stroke-width:2px
    style T fill:#fd9,stroke:#333,stroke-width:2px
```

### Trip Management System

```mermaid
graph TD
    subgraph "Trip Pages & Components"
        A[TripsPage] --> B[TripsClient]
        B --> C[Trips List]
        C --> D[ListingCard]
        D --> E[Trip Info Overlay]
        E --> F[Date Range]
        E --> G[Total Price]
        E --> H[Status Badge]
        D --> I[Cancel Button]
    end
    
    subgraph "Data Flow"
        A --> J[getTrips Action]
        J --> K[Prisma: Find Reservations]
        K --> L[Filter by userId]
        L --> B
        
        I --> M[API: cancelReservation]
        M --> N[DB: Update Status]
        N --> O[Optimistic UI Update]
        O --> C
    end
    
    subgraph "Status Management"
        P[Reservation Status] --> Q{Status Types}
        Q -->|Pending| R[Yellow Badge]
        Q -->|Confirmed| S[Green Badge]
        Q -->|Cancelled| T[Red Badge]
        Q -->|Completed| U[Blue Badge]
    end
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#bbf,stroke:#333,stroke-width:2px
    style P fill:#fd9,stroke:#333,stroke-width:2px
```

### Image Upload & Management System

```mermaid
graph TD
    subgraph "Image Upload UI"
        A[ImageUpload Component] --> B[Dropzone]
        B --> C[Preview Grid]
        C --> D[Delete Button]
    end
    
    subgraph "Upload Logic"
        B --> E[File Selection]
        E --> F[Validation]
        F --> G[TempURL Generation]
        G --> H[Cloudinary Upload]
        H --> I[Image URL]
        I --> C
    end
    
    subgraph "Integration"
        J[RentModal] --> A
        I --> K[Listing Form Data]
        K --> L[API: createListing]
        L --> M[DB: Store URLs]
    end
    
    subgraph "Image Display"
        N[ListingCard] --> O[Image Carousel]
        P[ListingClient] --> Q[Image Grid]
        M --> N
        M --> P
    end
    
    style B fill:#f96,stroke:#333,stroke-width:2px
    style H fill:#9bf,stroke:#333,stroke-width:2px
    style M fill:#bbf,stroke:#333,stroke-width:2px
``` 