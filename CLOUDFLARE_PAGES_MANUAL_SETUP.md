# Manual Cloudflare Pages Setup Guide

Follow these steps to manually set up Cloudflare Pages for your courses-careers.com site:

## Step 1: Access Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the left sidebar, click on **"Pages"**
3. Click the **"Create a project"** button
4. Select **"Connect to Git"**

## Step 2: Connect GitHub Repository

1. Click **"Connect GitHub account"**
2. Authorize Cloudflare to access your GitHub repositories
3. Select the repository: `linxact-solutions/courses-careers.com`
4. Click **"Begin setup"**

## Step 3: Configure Build Settings

Set the following build configuration:

- **Project name**: `courses-careers-com`
- **Production branch**: `main`
- **Framework preset**: Select "Astro" (or leave as "None" if not available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`

## Step 4: Environment Variables (Optional)

If you need any environment variables, add them here. For now, you can skip this step.

## Step 5: Advanced Settings

Scroll down to "Advanced" and set:
- **Node.js version**: `18`

## Step 6: Deploy

1. Click **"Save and Deploy"**
2. Cloudflare will start building your site
3. Wait for the first deployment to complete (usually takes 2-5 minutes)

## Step 7: Add Custom Domains

After the initial deployment succeeds:

1. Go to your project in Cloudflare Pages
2. Click on the **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Add your domains:
   - First add: `courses-careers.com`
   - Then add: `www.courses-careers.com`
5. Since your domain is already in Cloudflare, it will automatically configure the DNS records

## Step 8: Verify DNS Configuration

Cloudflare will automatically add these DNS records:

```
courses-careers.com     CNAME    courses-careers-com.pages.dev
www.courses-careers.com CNAME    courses-careers-com.pages.dev
```

## Step 9: SSL/HTTPS

SSL certificates are automatically provisioned by Cloudflare. Your site will be available via HTTPS immediately.

## Step 10: Test Your Site

Once DNS propagates (usually within minutes), your site will be accessible at:
- https://courses-careers.com
- https://www.courses-careers.com

## Automatic Deployments

After this manual setup, every push to the `main` branch will automatically trigger a new deployment through Cloudflare's GitHub integration.

## Troubleshooting

If you encounter any issues:

1. Check the build logs in Cloudflare Pages dashboard
2. Ensure Node.js version is set to 18
3. Verify the build command and output directory are correct
4. Check that all dependencies are in package.json

## Next Steps

Once the site is live, you can:
- Monitor deployments in the Cloudflare Pages dashboard
- Set up preview deployments for pull requests
- Configure additional settings like redirects and headers (already done via _redirects and _headers files)