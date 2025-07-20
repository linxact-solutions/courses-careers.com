# Cloudflare Pages Setup Instructions

## GitHub Secrets Configuration

Before the automated deployment can work, you need to add the following secrets to your GitHub repository:

1. Go to your repository: https://github.com/linxact-solutions/courses-careers.com
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Add the following secrets:

### Required Secrets:

1. **CLOUDFLARE_API_TOKEN**
   - Your API token: `XX00Y8E70l_R2EvLhx4EjOrHfvpah0eynBaGNGdp`
   - This token needs "Cloudflare Pages:Edit" permissions

2. **CLOUDFLARE_ACCOUNT_ID**
   - Your Account ID: `03b2b89689c35cf8f6e80326ef55cb22`

## Manual Cloudflare Pages Setup (Alternative)

If you prefer to set up manually through the Cloudflare dashboard:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to "Pages" in the left sidebar
3. Click "Create a project"
4. Connect to Git → Select GitHub
5. Select the repository: `linxact-solutions/courses-careers.com`
6. Configure build settings:
   - Project name: `courses-careers-com`
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18

## Custom Domain Configuration

After deployment, add your custom domains:

1. In Cloudflare Pages project settings
2. Go to "Custom domains" tab
3. Add both:
   - `courses-careers.com`
   - `www.courses-careers.com`

Since the domain is already in Cloudflare, it will automatically update DNS records.

## Deployment Status

- Production URL: https://courses-careers-com.pages.dev
- Custom domain: https://courses-careers.com (after configuration)

## Next Steps

1. Add the GitHub secrets mentioned above
2. The next push to main branch will trigger automatic deployment
3. Configure custom domains in Cloudflare Pages dashboard