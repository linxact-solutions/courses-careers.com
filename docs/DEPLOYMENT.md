# Deployment Guide

This guide covers deployment options and instructions for the Courses & Careers website.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Platforms](#deployment-platforms)
- [CI/CD Pipeline](#cicd-pipeline)
- [Domain Configuration](#domain-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

The Courses & Careers website is built with Astro and designed for static site deployment. It generates a fully static site that can be deployed to any static hosting platform or CDN.

### Build Output
- **Type**: Static site (HTML, CSS, JS, assets)
- **Output directory**: `dist/`
- **Build command**: `npm run build`
- **Node.js version**: 18.x or higher required for build

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18.x or higher** installed
2. **npm 9.x or higher** installed
3. **Git** access to the repository
4. **Environment variables** configured
5. **Analytics accounts** set up (GA4, Matomo, etc.)
6. **Domain name** and DNS access
7. **SSL certificate** (usually provided by hosting platform)

## Environment Configuration

### Required Environment Variables

Create environment variables in your deployment platform:

```bash
# Site Configuration
PUBLIC_SITE_URL=https://www.courses-careers.com
PUBLIC_SITE_NAME=Courses & Careers
PUBLIC_SITE_DESCRIPTION=UK's leading guide to university courses and career opportunities

# Analytics Configuration
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_MATOMO_URL=https://analytics.courses-careers.com/
PUBLIC_MATOMO_SITE_ID=1
PUBLIC_HUBSPOT_PORTAL_ID=XXXXXXXX
PUBLIC_INTERCOM_APP_ID=xxxxxxxx
PUBLIC_OPTIMIZELY_PROJECT_ID=XXXXXXXXX

# Image Optimization
PUBLIC_IMAGE_CDN_URL=https://cdn.courses-careers.com
PUBLIC_IMAGE_OPTIMIZATION=true

# Build Configuration
NODE_ENV=production
```

### Optional Environment Variables

```bash
# Development/Staging
PUBLIC_DEVELOPMENT_MODE=false
PUBLIC_DEBUG_MODE=false

# Third-party Services
PUBLIC_HOTJAR_ID=XXXXXXX
PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXXXX

# Performance
PUBLIC_PRELOAD_FONTS=true
PUBLIC_CRITICAL_CSS=true
```

## Deployment Platforms

### 1. Netlify (Recommended)

Netlify provides excellent support for Astro sites with automatic deployments.

#### Setup Steps:

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Build Settings**:
   ```bash
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add all required environment variables from above

4. **Deploy Settings**:
   ```bash
   Branch deploys: main
   Auto-deploy: enabled
   ```

#### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 404

[context.production.environment]
  NODE_ENV = "production"

[context.staging.environment]
  NODE_ENV = "staging"

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Vercel

Vercel offers seamless deployment for Astro applications.

#### Setup Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configuration**:
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "astro",
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/index.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

### 3. GitHub Pages

Deploy to GitHub Pages for open source projects.

#### Setup Steps:

1. **Create GitHub Action**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build site
         run: npm run build
         env:
           PUBLIC_SITE_URL: ${{ secrets.PUBLIC_SITE_URL }}
           PUBLIC_GA4_MEASUREMENT_ID: ${{ secrets.PUBLIC_GA4_MEASUREMENT_ID }}
       
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

2. **Configure Repository**:
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

### 4. AWS S3 + CloudFront

Enterprise deployment with AWS services.

#### Setup Steps:

1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://courses-careers-com
   ```

2. **Configure S3 for Static Website**:
   ```bash
   aws s3 website s3://courses-careers-com \
     --index-document index.html \
     --error-document 404.html
   ```

3. **Upload Files**:
   ```bash
   aws s3 sync dist/ s3://courses-careers-com \
     --delete \
     --cache-control max-age=31536000,public
   ```

4. **Create CloudFront Distribution**:
   ```json
   {
     "CallerReference": "courses-careers-2024",
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "S3-courses-careers-com",
           "DomainName": "courses-careers-com.s3.amazonaws.com",
           "S3OriginConfig": {
             "OriginAccessIdentity": ""
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-courses-careers-com",
       "ViewerProtocolPolicy": "redirect-to-https",
       "MinTTL": 0,
       "ForwardedValues": {
         "QueryString": false,
         "Cookies": {"Forward": "none"}
       }
     },
     "Comment": "Courses & Careers Website",
     "Enabled": true
   }
   ```

#### Deployment Script

Create `scripts/deploy-aws.sh`:
```bash
#!/bin/bash
set -e

# Build the site
npm run build

# Upload to S3
aws s3 sync dist/ s3://courses-careers-com \
  --delete \
  --cache-control max-age=31536000,public

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id EXXXXXXXXXX \
  --paths "/*"

echo "Deployment complete!"
```

### 5. Docker Deployment

For containerized deployment environments.

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers
COPY nginx-security.conf /etc/nginx/conf.d/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        include /etc/nginx/conf.d/security.conf;

        # Static file caching
        location ~* \.(js|css|woff2|jpg|jpeg|png|gif|svg|webp|avif)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "OK";
        }
    }
}
```

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Run accessibility tests
      run: npm run test:a11y
    
    - name: Build site
      run: npm run build
      env:
        PUBLIC_SITE_URL: ${{ secrets.PUBLIC_SITE_URL }}
        PUBLIC_GA4_MEASUREMENT_ID: ${{ secrets.PUBLIC_GA4_MEASUREMENT_ID }}
        PUBLIC_MATOMO_URL: ${{ secrets.PUBLIC_MATOMO_URL }}
        PUBLIC_MATOMO_SITE_ID: ${{ secrets.PUBLIC_MATOMO_SITE_ID }}
    
    - name: Run Lighthouse CI
      run: npx lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build site
      run: npm run build
      env:
        PUBLIC_SITE_URL: ${{ secrets.PUBLIC_SITE_URL }}
        PUBLIC_GA4_MEASUREMENT_ID: ${{ secrets.PUBLIC_GA4_MEASUREMENT_ID }}
        PUBLIC_MATOMO_URL: ${{ secrets.PUBLIC_MATOMO_URL }}
        PUBLIC_MATOMO_SITE_ID: ${{ secrets.PUBLIC_MATOMO_SITE_ID }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: false
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Branch Protection

Configure branch protection rules:

1. **Required status checks**:
   - `test`
   - `build`
   - `lighthouse-ci`

2. **Required reviews**:
   - At least 1 approving review
   - Dismiss stale reviews

3. **Restrictions**:
   - Restrict pushes to main branch
   - Require linear history

## Domain Configuration

### DNS Settings

Configure your DNS provider with these records:

```
# A records (for apex domain)
@     A     104.248.0.1
@     A     104.248.0.2

# CNAME records (for subdomains)
www   CNAME courses-careers.com
cdn   CNAME courses-careers.netlify.app

# MX records (for email)
@     MX    10 mail.courses-careers.com

# TXT records (for verification)
@     TXT   "v=spf1 include:_spf.google.com ~all"
```

### Subdomain Configuration

Set up subdomains for different services:

- `www.courses-careers.com` - Main site
- `cdn.courses-careers.com` - CDN for assets
- `analytics.courses-careers.com` - Matomo analytics
- `staging.courses-careers.com` - Staging environment

## SSL/TLS Setup

### Automated SSL (Recommended)

Most hosting platforms provide automatic SSL:

- **Netlify**: Automatic Let's Encrypt certificates
- **Vercel**: Automatic SSL certificates
- **Cloudflare**: SSL/TLS encryption

### Manual SSL Setup

For self-hosted deployments:

1. **Obtain SSL Certificate**:
   ```bash
   certbot certonly --webroot -w /var/www/html -d courses-careers.com
   ```

2. **Configure Web Server**:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name courses-careers.com;
       
       ssl_certificate /etc/letsencrypt/live/courses-careers.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/courses-careers.com/privkey.pem;
       
       # SSL configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
       ssl_prefer_server_ciphers off;
   }
   ```

## Performance Optimization

### CDN Configuration

Configure CDN for optimal performance:

```javascript
// cloudflare-workers.js
export default {
  async fetch(request) {
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    
    // Check cache first
    let response = await cache.match(cacheKey);
    
    if (!response) {
      // Fetch from origin
      response = await fetch(request);
      
      // Cache static assets
      if (request.url.includes('/assets/')) {
        response = new Response(response.body, {
          ...response,
          headers: {
            ...response.headers,
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
      
      // Cache in Cloudflare
      await cache.put(cacheKey, response.clone());
    }
    
    return response;
  }
};
```

### Asset Optimization

Configure asset optimization:

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    assets: 'assets',
    assetsPrefix: 'https://cdn.courses-careers.com/'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'date-fns']
          }
        }
      }
    }
  }
});
```

## Monitoring

### Uptime Monitoring

Set up uptime monitoring:

```yaml
# uptime-monitoring.yml
monitors:
  - name: "Courses & Careers Main Site"
    url: "https://www.courses-careers.com"
    interval: 30s
    timeout: 10s
    alerts:
      - type: email
        recipients: ["admin@courses-careers.com"]
      - type: slack
        webhook: "https://hooks.slack.com/..."
```

### Performance Monitoring

Monitor Core Web Vitals:

```javascript
// performance-monitoring.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  const url = 'https://analytics.courses-careers.com/collect';
  
  // Use navigator.sendBeacon() if available
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking

Set up error tracking:

```javascript
// error-tracking.js
window.addEventListener('error', (event) => {
  const errorData = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Send to error tracking service
  fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(errorData)
  });
});
```

## Rollback Procedures

### Automated Rollback

Set up automated rollback for failed deployments:

```yaml
# rollback-workflow.yml
name: Rollback on Failure

on:
  deployment_status:
    types: [failure]

jobs:
  rollback:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'failure'
    steps:
    - name: Rollback to Previous Version
      run: |
        # Get previous successful deployment
        PREVIOUS_SHA=$(git log --format="%H" -n 2 | tail -1)
        
        # Trigger rollback deployment
        curl -X POST \
          -H "Authorization: Bearer ${{ secrets.NETLIFY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d "{\"branch\": \"main\", \"sha\": \"$PREVIOUS_SHA\"}" \
          "https://api.netlify.com/api/v1/sites/${{ secrets.NETLIFY_SITE_ID }}/deploys"
```

### Manual Rollback

For manual rollback procedures:

1. **Identify Last Good Version**:
   ```bash
   git log --oneline -10
   ```

2. **Create Rollback Branch**:
   ```bash
   git checkout -b rollback-to-stable <commit-hash>
   git push origin rollback-to-stable
   ```

3. **Deploy Rollback**:
   - Update deployment to use rollback branch
   - Verify functionality
   - Investigate original issue

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
npm run build 2>&1 | tee build.log

# Common fixes
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues

```bash
# Check environment variables
env | grep PUBLIC_

# Verify in build
console.log(import.meta.env.PUBLIC_SITE_URL);
```

#### Asset Loading Issues

```bash
# Check asset paths
ls -la dist/assets/

# Verify in browser
curl -I https://your-site.com/assets/main.css
```

#### Performance Issues

```bash
# Run Lighthouse audit
npx lighthouse https://your-site.com --output=json > audit.json

# Check bundle size
npm run build -- --analyze
```

### Debugging Tools

```bash
# Deploy with debugging
DEBUG=* npm run build

# Check deployment logs
netlify logs --site-id=your-site-id

# Monitor real-time
watch 'curl -s -o /dev/null -w "%{http_code}" https://your-site.com'
```

### Emergency Procedures

1. **Complete Site Failure**:
   - Enable maintenance mode
   - Rollback to last known good version
   - Investigate issue in staging

2. **Partial Functionality Issues**:
   - Identify affected features
   - Consider feature flags
   - Deploy hotfix if possible

3. **Performance Degradation**:
   - Check CDN status
   - Monitor server resources
   - Implement caching improvements

## Post-Deployment Checklist

After each deployment:

- [ ] Site loads correctly
- [ ] All pages render properly
- [ ] Forms work correctly
- [ ] Analytics tracking active
- [ ] Cookie consent functioning
- [ ] Images loading optimized
- [ ] SEO meta tags present
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable
- [ ] Error monitoring active
- [ ] Accessibility features working
- [ ] Mobile responsiveness verified

## Support

For deployment issues:
- **Technical**: technical@courses-careers.com
- **DevOps**: devops@courses-careers.com
- **Emergency**: emergency@courses-careers.com

---

*For more information, see the main [README.md](../README.md) or other documentation in the `/docs` folder.*