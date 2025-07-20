# Courses & Careers

A modern, accessible, and performance-optimized education portal built with Astro, providing comprehensive information about UK university courses, college programs, and career guidance.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [SEO & Performance](#seo--performance)
- [Accessibility](#accessibility)
- [Analytics & GDPR](#analytics--gdpr)
- [Content Management](#content-management)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **🎓 Education Portal**: Comprehensive database of UK university courses, college programs, and career paths
- **🔍 Advanced Search**: Sophisticated filtering and search capabilities for courses and careers
- **📱 Mobile-First Design**: Fully responsive design optimized for all devices
- **⚡ Lightning Fast**: Astro static site generation with optimal performance
- **♿ Accessibility**: WCAG 2.2 AA compliant with comprehensive accessibility features
- **🛡️ Privacy-First**: GDPR-compliant with granular cookie consent management
- **📊 Analytics**: Multi-provider analytics integration with privacy controls
- **🖼️ Image Optimization**: Advanced image processing with modern formats and responsive sizing
- **🌐 SEO Optimized**: Rich metadata, structured data, and search engine optimization

### Educational Content
- **Further Education**: College courses and professional development programs
- **Undergraduate**: Bachelor's degree programs across all disciplines
- **Postgraduate**: Master's and PhD programs with detailed information
- **Student Advice**: Financial guidance, accommodation, and student life
- **Career Guidance**: Job search tools and career sector insights
- **Online Magazines**: Digital publications with educational content

### Technical Features
- **Modern Stack**: Astro 4.x, TypeScript, Tailwind CSS
- **Component Library**: Reusable, accessible components
- **Image Processing**: Sharp-based optimization with WebP/AVIF support
- **Cookie Management**: Granular GDPR-compliant consent system
- **Multi-Analytics**: Google Analytics 4, Matomo, HubSpot integration
- **Progressive Enhancement**: Works without JavaScript
- **Print Optimization**: Dedicated print stylesheets

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/courses-careers.com.git
   cd courses-careers.com
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:4321`

### Environment Variables

Create a `.env` file in the project root:

```env
# Analytics Configuration
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_MATOMO_URL=https://analytics.your-domain.com/
PUBLIC_MATOMO_SITE_ID=1
PUBLIC_HUBSPOT_PORTAL_ID=XXXXXXXX
PUBLIC_INTERCOM_APP_ID=xxxxxxxx
PUBLIC_OPTIMIZELY_PROJECT_ID=XXXXXXXXX

# Site Configuration
PUBLIC_SITE_URL=https://www.courses-careers.com
PUBLIC_SITE_NAME=Courses & Careers
PUBLIC_SITE_DESCRIPTION=UK's leading guide to university courses and career opportunities

# Image Optimization
PUBLIC_IMAGE_CDN_URL=https://cdn.your-domain.com
PUBLIC_IMAGE_OPTIMIZATION=true

# Development
NODE_ENV=development
```

## Project Structure

```
courses-careers.com/
├── docs/                       # Documentation
│   ├── DEPLOYMENT.md          # Deployment instructions
│   ├── DEVELOPMENT.md         # Development guide
│   ├── COMPONENTS.md          # Component documentation
│   └── CONTENT.md            # Content management guide
├── public/                    # Static assets
│   ├── images/               # Image assets
│   ├── favicon.ico           # Favicon
│   └── robots.txt            # Search engine directives
├── src/                      # Source code
│   ├── assets/               # Build-time assets
│   ├── components/           # Reusable components
│   ├── layouts/              # Page layouts
│   ├── pages/                # Route pages
│   ├── styles/               # Global styles
│   ├── lib/                  # Utility libraries
│   └── utils/                # Helper functions
├── scripts/                  # Build scripts
├── snapshot/                 # Legacy content archive
├── astro.config.mjs          # Astro configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Technologies Used

### Core Technologies
- **[Astro](https://astro.build/)** - Static site generator with islands architecture
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing

### Analytics & Marketing
- **[Google Analytics 4](https://analytics.google.com/)** - Web analytics
- **[Matomo](https://matomo.org/)** - Privacy-focused analytics
- **[HubSpot](https://www.hubspot.com/)** - CRM and marketing automation
- **[Intercom](https://www.intercom.com/)** - Customer messaging
- **[Optimizely](https://www.optimizely.com/)** - A/B testing

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Vite](https://vitejs.dev/)** - Build tool

## Architecture

### Static Site Generation
The site uses Astro's static site generation (SSG) approach for optimal performance:

- **Build-time rendering**: All pages are pre-rendered at build time
- **Island architecture**: Interactive components are hydrated on demand
- **Partial hydration**: Only necessary JavaScript is loaded
- **Zero-JS by default**: Pages work without JavaScript

### Component Architecture
```
BaseLayout.astro              # Base HTML structure
├── Layout.astro              # Main layout with navigation
├── Analytics.astro           # Analytics integration
├── CookieManager.astro       # Cookie consent management
└── Page Components/          # Individual page components
    ├── CourseCard.astro      # Course information display
    ├── OptimizedImage.astro  # Image optimization
    └── AccessibleForm.tsx    # Form components
```

### State Management
- **URL-based routing**: Astro's file-based routing system
- **Local state**: Component-level state for interactive features
- **Cookie preferences**: Persistent user preferences
- **Analytics state**: User consent and tracking status

## SEO & Performance

### Search Engine Optimization
- **Semantic HTML**: Proper heading hierarchy and semantic markup
- **Meta tags**: Comprehensive OpenGraph and Twitter card support
- **Structured data**: JSON-LD for rich snippets
- **XML sitemap**: Auto-generated sitemap for search engines
- **Robots.txt**: Search engine crawler directives
- **Canonical URLs**: Proper canonical URL implementation

### Performance Optimization
- **Static generation**: Pre-rendered pages for instant loading
- **Image optimization**: WebP/AVIF formats with responsive sizing
- **CSS optimization**: Purged and minified CSS
- **JavaScript optimization**: Tree-shaking and code splitting
- **Critical CSS**: Inline critical CSS for faster rendering
- **Lazy loading**: Images and components loaded on demand

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms  
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.8s
- **Time to Interactive (TTI)**: < 3.8s

## Accessibility

### WCAG 2.2 AA Compliance
The site meets Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards:

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Proper ARIA labels and semantic HTML
- **Color contrast**: Minimum 4.5:1 contrast ratio
- **Focus indicators**: Visible focus indicators on all interactive elements
- **Alternative text**: Descriptive alt text for all images
- **Heading hierarchy**: Logical heading structure for navigation

### Accessibility Features
- **Skip links**: Allow users to bypass navigation
- **Reduced motion**: Respects user's motion preferences
- **High contrast**: Support for high contrast mode
- **Text scaling**: Works at 200% zoom
- **Form accessibility**: Proper labels and error messages
- **Live regions**: Screen reader announcements for dynamic content

For detailed accessibility information, see [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Analytics & GDPR

### Privacy-First Analytics
- **Consent-based tracking**: Analytics only load with user consent
- **IP anonymization**: All analytics providers configured for privacy
- **Cookie management**: Granular control over cookie categories
- **Data retention**: Automatic data deletion after 26 months
- **Opt-out support**: Easy consent withdrawal

### Cookie Categories
- **Necessary**: Essential site functionality (always enabled)
- **Analytics**: Website performance and usage analytics
- **Marketing**: Advertising and remarketing cookies
- **Functional**: Enhanced user experience features

For detailed analytics information, see [ANALYTICS_GDPR_README.md](ANALYTICS_GDPR_README.md).

## Content Management

### Content Structure
```
Pages/
├── Further Education/
│   ├── Subject guides
│   └── College profiles
├── Undergraduate/
│   ├── Subject guides
│   └── University profiles
├── Postgraduate/
│   ├── Subject guides
│   ├── University profiles
│   └── MBA courses
├── Student Advice/
│   ├── Student finance
│   └── UK city guide
├── Jobs & Careers/
│   ├── Career sectors
│   └── Job search
└── Online Magazines/
    ├── Current issues
    └── Archive
```

### Content Types
- **Articles**: Educational content with rich metadata
- **Profiles**: Institution and program descriptions
- **Guides**: Step-by-step educational resources
- **News**: Latest updates and announcements
- **Resources**: Downloadable materials and tools

## Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Check TypeScript and Astro

# Testing
npm run test         # Run test suite
npm run test:e2e     # Run end-to-end tests
npm run test:a11y    # Run accessibility tests
npm run test:perf    # Run performance tests

# Code Quality
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # Check TypeScript types

# Deployment
npm run deploy       # Deploy to production
npm run deploy:staging # Deploy to staging
npm run deploy:preview # Deploy preview build
```

### Development Workflow
1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow coding standards and conventions
3. **Run tests**: `npm run test` and `npm run test:a11y`
4. **Check build**: `npm run build`
5. **Commit changes**: Use conventional commit messages
6. **Push and create PR**: Follow PR template

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional commits**: Standardized commit messages

## Deployment

### Supported Platforms
- **Netlify**: Recommended for static hosting
- **Vercel**: Alternative static hosting
- **GitHub Pages**: For open source projects
- **AWS S3/CloudFront**: Enterprise deployment
- **Docker**: Containerized deployment

### Deployment Configuration
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variables
# (Set in your deployment platform)
PUBLIC_GA4_MEASUREMENT_ID=your-ga4-id
PUBLIC_MATOMO_URL=your-matomo-url
PUBLIC_SITE_URL=your-production-url
```

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Security

### Security Features
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HTTPS enforcement**: All traffic encrypted
- **Secure headers**: Security headers configured
- **Input validation**: All user inputs validated
- **Dependency scanning**: Regular security audits
- **Access controls**: Role-based access where applicable

### Security Best Practices
- **Regular updates**: Dependencies updated monthly
- **Vulnerability scanning**: Automated security scans
- **Secure configuration**: Environment variables for sensitive data
- **OWASP compliance**: Following OWASP guidelines
- **Privacy by design**: Data minimization principles

## Testing

### Test Types
- **Unit tests**: Component and utility testing
- **Integration tests**: API and service testing
- **End-to-end tests**: Full user journey testing
- **Accessibility tests**: WCAG compliance testing
- **Performance tests**: Core Web Vitals monitoring
- **Security tests**: Vulnerability scanning

### Testing Tools
- **Jest**: Unit testing framework
- **Playwright**: End-to-end testing
- **axe-core**: Accessibility testing
- **Lighthouse**: Performance auditing
- **OWASP ZAP**: Security testing

### Running Tests
```bash
# All tests
npm run test

# Specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:a11y
npm run test:perf

# Test coverage
npm run test:coverage
```

## Performance Optimization

### Build Optimization
- **Static site generation**: Pre-rendered pages
- **Tree shaking**: Unused code elimination
- **Code splitting**: Lazy loading of components
- **Asset optimization**: Minified CSS and JavaScript
- **Image optimization**: Modern formats and responsive sizing

### Runtime Optimization
- **Lazy loading**: Images and components loaded on demand
- **Caching**: Browser and CDN caching strategies
- **Compression**: Gzip and Brotli compression
- **Critical resource prioritization**: Above-the-fold content priority
- **Service worker**: Offline functionality (optional)

### Performance Monitoring
- **Core Web Vitals**: Continuous monitoring
- **Real User Monitoring (RUM)**: Performance in production
- **Lighthouse CI**: Automated performance testing
- **Bundle analysis**: Regular bundle size monitoring

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

#### Development Server Issues
```bash
# Restart development server
npm run dev -- --force
```

#### Image Loading Issues
- Check image paths in `/public/images/`
- Verify image formats are supported
- Check image optimization settings

#### Analytics Not Loading
- Verify environment variables are set
- Check cookie consent status
- Review browser console for errors

### Debug Mode
Enable debug logging:
```bash
# Environment variable
DEBUG=true npm run dev

# Or in browser console
localStorage.setItem('debug', 'true');
```

### Performance Issues
- Run Lighthouse audit
- Check bundle size: `npm run analyze`
- Monitor Core Web Vitals
- Review image optimization

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Create a pull request

### Code Standards
- Follow TypeScript best practices
- Use semantic HTML
- Implement accessibility features
- Add proper documentation
- Include tests for new features

### Pull Request Process
1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Request code review
5. Address feedback promptly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Component Documentation](docs/COMPONENTS.md)
- [Content Management](docs/CONTENT.md)
- [Accessibility Guide](ACCESSIBILITY.md)
- [Analytics & GDPR](ANALYTICS_GDPR_README.md)
- [Image Optimization](IMAGE_OPTIMIZATION.md)

### Contact
- **Technical Support**: technical@courses-careers.com
- **Content Issues**: content@courses-careers.com
- **Accessibility**: accessibility@courses-careers.com
- **Privacy**: privacy@courses-careers.com

### Community
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community Q&A and discussions
- **Discord**: Real-time developer chat (if available)

---

**Built with ❤️ by the Courses & Careers team**

*Last updated: January 2025*