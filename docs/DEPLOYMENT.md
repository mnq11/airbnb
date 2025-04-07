# Deployment Guide

This guide explains how to deploy the Yemen Property Rental Platform to production environments.

## Production Requirements

- Node.js hosting environment (Vercel recommended)
- MongoDB Atlas account for database
- Environment variables configuration
- Domain name (optional)

## Deployment Options

### 1. Vercel Deployment (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Steps:

1. **Create a Vercel Account**

   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI (Optional)**

   ```bash
   npm install -g vercel
   ```

3. **Connect Repository**

   - Import your GitHub/GitLab/Bitbucket repository in the Vercel dashboard
   - Or use the CLI: `vercel`

4. **Configure Environment Variables**

   - Add all required environment variables in the Vercel project settings:
     - `MONGODATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (set to your production URL)
     - OAuth provider credentials

5. **Deploy**

   - Automatic deployment will start when you push to the main branch
   - Or manually deploy using the dashboard or CLI: `vercel --prod`

6. **Custom Domain (Optional)**
   - Add your custom domain in the Vercel project settings
   - Follow Vercel's instructions to configure DNS

### 2. Self-Hosted Deployment

#### Prerequisites:

- Linux server with Node.js installed
- PM2 or similar process manager
- MongoDB instance
- Nginx or similar web server for proxy

#### Steps:

1. **Clone Repository**

   ```bash
   git clone https://github.com/yourusername/property-rental-platform.git
   cd property-rental-platform
   ```

2. **Install Dependencies**

   ```bash
   npm install --production
   ```

3. **Build the Application**

   ```bash
   npm run build
   ```

4. **Set Environment Variables**
   Create a `.env` file with all required variables:

   ```
   MONGODATABASE_URL=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=https://yourdomain.com
   GITHUB_ID=...
   GITHUB_SECRET=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

5. **Start with PM2**

   ```bash
   pm2 start npm --name "rental-platform" -- start
   ```

6. **Configure Nginx**

   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

7. **Enable HTTPS with Let's Encrypt**
   ```bash
   certbot --nginx -d yourdomain.com
   ```

## Post-Deployment Checklist

- Verify all pages load correctly
- Test authentication flows
- Confirm listing creation works
- Test reservation system
- Ensure proper error handling
- Check responsive design across devices
- Monitor for any errors or performance issues

## Scaling Considerations

- Consider MongoDB Atlas scaling options for database
- Implement caching for frequently accessed data
- Use Vercel Edge Functions for global distribution
- Enable proper Next.js caching settings
- Monitor performance and adjust resources as needed

## Monitoring

- Set up Vercel Analytics or Google Analytics
- Configure error logging (Sentry recommended)
- Set up uptime monitoring
- Monitor database performance

## Troubleshooting

### Common Issues

- **Build Failures**: Check your build logs for errors
- **API Errors**: Verify environment variables are set correctly
- **Database Connection Issues**: Check MongoDB connection string and network settings
- **Image Upload Problems**: Verify image storage configuration
- **OAuth Login Failures**: Check callback URLs in provider settings

For additional help, refer to the project's GitHub issues or contact the maintainers.
