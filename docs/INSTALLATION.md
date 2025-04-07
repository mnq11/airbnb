# Installation Guide

This guide will walk you through setting up the Yemen Property Rental Platform for local development.

## Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- GitHub and Google developer accounts (for OAuth)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODATABASE_URL="mongodb+srv://your-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth - GitHub
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/property-rental-platform.git
   cd property-rental-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Access the application at `http://localhost:3000`

## OAuth Configuration

### GitHub OAuth Setup

1. Go to GitHub Developer Settings: https://github.com/settings/developers
2. Create a new OAuth App
3. Set the homepage URL to `http://localhost:3000`
4. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and Client Secret to your `.env.local` file

### Google OAuth Setup

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project
3. Set up OAuth consent screen
4. Create OAuth credentials
5. Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

## Troubleshooting

### Common Issues

- **Prisma Client Error**: If you encounter issues with Prisma, try running:

  ```bash
  npx prisma db push
  npx prisma generate
  ```

- **MongoDB Connection**: Ensure your MongoDB connection string is correct and includes username, password, and database name.

- **NextAuth Errors**: Make sure NEXTAUTH_SECRET is set and NEXTAUTH_URL matches your local environment.

For additional help, please open an issue on GitHub.
