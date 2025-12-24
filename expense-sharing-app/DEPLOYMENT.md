# Deployment Guide

## Prerequisites

- ✅ Supabase project created and configured
- ✅ Database schema applied
- ✅ Environment variables set locally
- ✅ Application tested locally

## Deployment Steps

### Step 1: Prepare for Deployment

1. **Verify Build**
   ```bash
   cd expense-sharing-app
   npm run build
   ```
   Ensure the build completes without errors.

2. **Test Production Build Locally**
   ```bash
   npm run start
   ```
   Visit `http://localhost:3000` and verify everything works.

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Select your scope (team/personal)
   - Confirm project name
   - Confirm project settings
   - Wait for deployment

4. **Set Environment Variables**
   
   After first deployment, set environment variables in Vercel dashboard:
   - Go to Vercel dashboard → Your Project → Settings → Environment Variables
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   
   Or use CLI:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Step 3: Configure Supabase for Production

1. **Update Supabase Site URL**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set Site URL to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - Add Redirect URLs:
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/auth/login`

2. **Verify RLS Policies**
   - Go to Supabase Dashboard → Database → Policies
   - Ensure all policies are enabled and active

3. **Test Production Auth**
   - Try signing up from production URL
   - Verify email confirmation works
   - Test login/logout flow

### Step 4: Verify Production Deployment

Run through the testing checklist:

1. ✅ Visit your production URL
2. ✅ Sign up with a new account
3. ✅ Create a group
4. ✅ Add an expense
5. ✅ Verify balances calculate correctly
6. ✅ Test logout and login
7. ✅ Check that protected routes require auth
8. ✅ Verify API responses are correct

### Alternative: Deploy with GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/expense-sharing-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |

## Post-Deployment Checklist

- [ ] Production URL is accessible
- [ ] Environment variables are set correctly
- [ ] Authentication works (signup, login, logout)
- [ ] Database operations work (create group, expense)
- [ ] RLS policies are enforced
- [ ] No console errors in browser
- [ ] API endpoints return expected responses
- [ ] Protected routes redirect to login
- [ ] Supabase Site URL is configured
- [ ] Email confirmations work (if enabled)

## Troubleshooting

### Issue: "Missing environment variables"
**Solution**: Ensure environment variables are set in Vercel dashboard and redeploy.

### Issue: "Unauthorized" errors in production
**Solution**: Check that Supabase Site URL matches your Vercel deployment URL.

### Issue: Authentication redirect loops
**Solution**: Verify middleware.ts is deployed and cookie settings are correct.

### Issue: Database connection errors
**Solution**: Check Supabase project status and verify connection string.

### Issue: Build fails
**Solution**: Check build logs in Vercel dashboard. Common issues:
- TypeScript errors
- Missing dependencies
- Import path issues

## Performance Optimization

1. **Enable Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```
   Add to `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

2. **Enable Edge Functions** (for faster response times)
   - Vercel automatically uses Edge Runtime for API routes when possible

3. **Monitor Performance**
   - Use Vercel Analytics to track page load times
   - Check Supabase Dashboard for database query performance

## Scaling Considerations

### Database
- Supabase Free Tier: 500MB database, 2GB bandwidth
- For production apps, consider upgrading to Pro tier

### Hosting
- Vercel Free Tier: 100GB bandwidth, unlimited deployments
- For high-traffic apps, consider upgrading to Pro tier

### Optimizations for Scale
1. Add database indexes (already included in schema)
2. Implement caching for frequently accessed data
3. Use Supabase edge functions for complex operations
4. Consider adding Redis for session storage
5. Implement rate limiting on API routes

## Security Best Practices

1. ✅ Environment variables not committed to git
2. ✅ RLS policies enabled on all tables
3. ✅ API routes validate user authentication
4. ✅ Input validation on all user inputs
5. ✅ HTTPS enforced (automatic with Vercel)
6. Consider adding:
   - Rate limiting
   - CORS configuration
   - Content Security Policy headers
   - Request logging

## Monitoring

1. **Vercel Dashboard**: Monitor deployments and errors
2. **Supabase Dashboard**: Monitor database usage and API calls
3. **Browser Console**: Check for client-side errors
4. **Set up alerts** for:
   - High error rates
   - Slow API responses
   - Database connection issues

## Backup and Recovery

1. **Database Backups**
   - Supabase automatically backs up database daily
   - Manual backups: Database → Backups in Supabase dashboard

2. **Code Backups**
   - Git repository serves as code backup
   - Vercel maintains deployment history

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Supabase Site URL to match custom domain

## Congratulations! 🎉

Your Expense Sharing App is now deployed and ready to use!

**Production URL**: Check your Vercel deployment for the live URL
**Database**: Hosted on Supabase
**Hosting**: Vercel Edge Network

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs
```
