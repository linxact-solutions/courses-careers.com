# SEO Infrastructure Documentation

This document describes the comprehensive SEO infrastructure implemented for courses-careers.com, including automatic sitemap generation, structured data (JSON-LD), and SEO utilities.

## Overview

The SEO infrastructure provides:

1. **Auto-generated XML Sitemap** - Automatically scans all pages and generates `sitemap.xml`
2. **Comprehensive JSON-LD Structured Data** - Rich snippets for search engines
3. **Breadcrumb Navigation** - Hierarchical navigation with structured data
4. **SEO Utilities** - Helper functions for SEO optimization

## Files Created

- `/src/utils/seo.js` - Core SEO utilities and sitemap generation
- `/src/pages/sitemap.xml.js` - Auto-generating sitemap endpoint
- `/src/components/StructuredData.astro` - JSON-LD structured data component
- `/src/components/Breadcrumb.astro` - Breadcrumb navigation component
- Updated `/src/layouts/Layout.astro` - Integrated structured data and breadcrumbs

## Features

### 1. Auto-Generated Sitemap

The sitemap automatically includes all `.astro` pages with:
- **Proper priorities**: Homepage (1.0), main sections (0.9), subsections (0.8), articles (0.7)
- **Change frequencies**: Daily, weekly, monthly, yearly based on content type
- **Last modified dates**: Based on file modification times
- **XML validation**: Proper XML format with required elements

**Access**: `https://www.courses-careers.com/sitemap.xml`

**Current pages included**: 66+ pages across all sections

### 2. JSON-LD Structured Data

Comprehensive structured data schemas for:

#### Organization Schema
- Company information (BigChoice Group Ltd)
- Contact details and social media
- Service offerings

#### Website Schema
- Site-wide information
- Search functionality
- Language specification

#### Page-Specific Schemas

**Homepage**:
- Enhanced EducationalOrganization
- Service catalog with course and career offerings

**Article Pages**:
- BlogPosting schema
- Author, publish date, keywords
- Reading time and word count

**University Profiles**:
- EducationalOrganization schema
- Location, founding date, contact info
- CourseInstance for specific programs

**Career Pages**:
- JobPosting schema
- Job details, salary, requirements
- Employment type and location

**All Pages**:
- BreadcrumbList for navigation
- WebPage schema with metadata

### 3. Breadcrumb Navigation

- Automatic breadcrumb generation from URL structure
- Proper accessibility with ARIA labels
- Responsive design with mobile optimizations
- Structured data integration

### 4. SEO Utilities

The `seo.js` utility provides:

```javascript
// Get all pages for sitemap
getAllPages()

// Generate XML sitemap
generateSitemapXML(pages)

// Create breadcrumbs from URL
generateBreadcrumbs(url)

// Get page type for structured data
getPageType(url)

// URL validation and cleaning
validateSitemapUrl(url)

// Canonical URL generation
getCanonicalUrl(path)
```

## Usage Examples

### Basic Page (No Special Structured Data)

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout 
  title="Page Title"
  description="Page description"
  keywords="relevant, keywords, here"
>
  <!-- Page content -->
</Layout>
```

### Article Page with Rich Structured Data

```astro
---
import Layout from '../layouts/Layout.astro';

const structuredData = {
  type: 'article',
  article: {
    title: 'Article Title',
    description: 'Article description',
    publishDate: '2025-07-01',
    modifiedDate: '2025-07-08',
    author: 'Author Name',
    keywords: ['keyword1', 'keyword2'],
    content: 'Article content for word count...'
  }
};
---

<Layout 
  title="Article Title"
  description="Article description"
  structuredData={structuredData}
>
  <!-- Article content -->
</Layout>
```

### University Profile with Multiple Schemas

```astro
---
import Layout from '../layouts/Layout.astro';

const structuredData = {
  type: 'university',
  university: {
    name: 'University Name',
    description: 'University description',
    location: 'City, Country',
    founded: '1966',
    website: 'https://university.edu',
    logo: '/path/to/logo.png'
  },
  course: {
    name: 'Course Name',
    description: 'Course description',
    provider: 'University Name',
    level: 'Undergraduate/Postgraduate',
    subject: 'Subject Area'
  }
};
---

<Layout 
  title="University Profile"
  structuredData={structuredData}
>
  <!-- University profile content -->
</Layout>
```

### Career/Job Page

```astro
---
import Layout from '../layouts/Layout.astro';

const structuredData = {
  type: 'career',
  job: {
    title: 'Job Title',
    description: 'Job description',
    location: 'Location',
    employmentType: 'FULL_TIME',
    company: 'Company Name',
    salary: 'Salary range'
  }
};
---

<Layout 
  title="Career Guide"
  structuredData={structuredData}
>
  <!-- Career content -->
</Layout>
```

## Configuration

### Site Configuration

Edit `SITE_CONFIG` in `/src/utils/seo.js`:

```javascript
export const SITE_CONFIG = {
  url: 'https://www.courses-careers.com',
  name: 'Courses & Careers',
  description: "UK's leading guide to university courses...",
  organization: {
    name: 'BigChoice Group Ltd',
    url: 'https://www.courses-careers.com',
    logo: 'https://www.courses-careers.com/images/header/cc_logo.png',
    sameAs: [
      'https://www.facebook.com/coursesandcareers',
      'https://twitter.com/coursescareers',
      'https://www.linkedin.com/company/bigchoice-group'
    ]
  }
};
```

### Page Priorities and Change Frequencies

Modify `getPageSEOConfig()` in `/src/utils/seo.js` to adjust:
- Homepage: priority 1.0, daily updates
- Main sections: priority 0.9, weekly updates
- Subsections: priority 0.8, weekly updates
- Articles: priority 0.7, monthly updates
- Legal pages: priority 0.3, yearly updates

## SEO Benefits

1. **Rich Snippets**: Enhanced search results with structured data
2. **Better Crawling**: XML sitemap helps search engines discover content
3. **Improved Navigation**: Breadcrumbs enhance user experience and SEO
4. **Schema Markup**: Helps search engines understand content context
5. **Mobile Optimization**: Responsive breadcrumbs and structured data
6. **Accessibility**: ARIA labels and semantic markup

## Validation

### Test Sitemap
- Visit `/sitemap.xml` to see generated sitemap
- Use Google Search Console to submit sitemap
- Validate XML format with online validators

### Test Structured Data
- Use Google's Rich Results Test tool
- Check Schema.org validator
- Verify in Google Search Console

### Performance
- Sitemap cached for 1 hour
- Minimal impact on page load times
- Structured data compressed in production

## Maintenance

The SEO infrastructure is largely automated:

1. **Sitemap**: Updates automatically when pages are added/modified
2. **Structured Data**: Applied via Layout component props
3. **Breadcrumbs**: Generated automatically from URL structure

Only manual updates needed:
- Site configuration changes
- New structured data types
- Custom breadcrumb overrides

## Troubleshooting

### Sitemap Issues
- Check file permissions on `/src/pages` directory
- Verify `.astro` files are properly formatted
- Check server logs for generation errors

### Structured Data Issues
- Validate JSON-LD syntax
- Check required properties for each schema type
- Test with Google's structured data testing tool

### Breadcrumb Issues
- Verify URL structure matches expected patterns
- Check custom breadcrumb overrides
- Ensure proper accessibility attributes