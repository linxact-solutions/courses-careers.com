/**
 * SEO Utilities for courses-careers.com
 * Provides functions for sitemap generation, breadcrumb creation, and SEO helpers
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively get all .astro files from a directory
 * @param {string} dir - Directory to search
 * @param {string} basePath - Base path for relative URLs
 * @returns {Array} Array of file paths
 */
async function getAstroFiles(dir, basePath = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
    
    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const subFiles = await getAstroFiles(fullPath, relativePath);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(relativePath);
    }
  }
  
  return files;
}

/**
 * Site configuration for SEO
 */
export const SITE_CONFIG = {
  url: 'https://www.courses-careers.com',
  name: 'Courses & Careers',
  description: "UK's leading guide to university courses, college programs, and career opportunities",
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

/**
 * Get all pages from the src/pages directory
 * @returns {Array} Array of page objects with url, lastmod, priority, changefreq
 */
export async function getAllPages() {
  const pages = [];
  const pagesDir = path.join(process.cwd(), 'src/pages');
  
  try {
    // Recursively get all .astro files in pages directory
    const astroFiles = await getAstroFiles(pagesDir);
    
    for (const file of astroFiles) {
      // Skip test files and special files
      if (file.includes('test.') || file.includes('404.') || file.includes('500.')) {
        continue;
      }
      
      // Convert file path to URL
      let url = file
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '')
        .replace(/^index$/, '');
      
      // Add leading slash if not empty
      if (url && !url.startsWith('/')) {
        url = '/' + url;
      }
      
      // If empty, it's the homepage
      if (!url) {
        url = '/';
      }
      
      // Get file stats for lastmod
      const filePath = path.join(pagesDir, file);
      const stats = fs.statSync(filePath);
      
      // Determine priority and changefreq based on URL
      const { priority, changefreq } = getPageSEOConfig(url);
      
      pages.push({
        url,
        lastmod: stats.mtime.toISOString().split('T')[0],
        priority,
        changefreq,
        file
      });
    }
    
    // Sort by priority (high to low) then by URL
    return pages.sort((a, b) => {
      if (a.priority !== b.priority) {
        return parseFloat(b.priority) - parseFloat(a.priority);
      }
      return a.url.localeCompare(b.url);
    });
    
  } catch (error) {
    console.error('Error scanning pages:', error);
    return [];
  }
}

/**
 * Get SEO configuration for a page based on its URL
 * @param {string} url - The page URL
 * @returns {object} Object with priority and changefreq
 */
export function getPageSEOConfig(url) {
  // Homepage
  if (url === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  
  // Main section pages
  if (url.match(/^\/(further-education|undergraduate|postgraduate|jobs-and-careers|student-advice|online-magazines)$/)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  
  // Subsection pages (like subject-guide, university-profiles)
  if (url.match(/^\/(further-education|undergraduate|postgraduate|jobs-and-careers|student-advice|online-magazines)\/[^\/]+$/)) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  // Article pages
  if (url.includes('/article/') || url.match(/\/\d{4,}-/)) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Magazine pages
  if (url.includes('/emags/') || url.includes('/online-magazines/')) {
    return { priority: '0.6', changefreq: 'monthly' };
  }
  
  // Legal and utility pages
  if (url.match(/^\/(privacy-policy|terms-of-service|accessibility-statement|contact)$/)) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  
  // Default for other pages
  return { priority: '0.5', changefreq: 'monthly' };
}

/**
 * Generate XML sitemap content
 * @param {Array} pages - Array of page objects
 * @returns {string} XML sitemap content
 */
export function generateSitemapXML(pages) {
  const urls = pages.map(page => `  <url>
    <loc>${SITE_CONFIG.url}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate breadcrumb data for a given URL
 * @param {string} url - The current page URL
 * @returns {Array} Array of breadcrumb objects
 */
export function generateBreadcrumbs(url) {
  const breadcrumbs = [
    {
      name: 'Home',
      url: '/',
      position: 1
    }
  ];
  
  if (url === '/') {
    return breadcrumbs;
  }
  
  const pathSegments = url.split('/').filter(segment => segment);
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += '/' + segment;
    
    // Convert URL segment to readable name
    const name = convertUrlToTitle(segment);
    
    breadcrumbs.push({
      name,
      url: currentPath,
      position: index + 2
    });
  });
  
  return breadcrumbs;
}

/**
 * Convert URL segment to readable title
 * @param {string} segment - URL segment
 * @returns {string} Readable title
 */
export function convertUrlToTitle(segment) {
  // Handle special cases
  const titleMap = {
    'further-education': 'Further Education',
    'undergraduate': 'Undergraduate',
    'postgraduate': 'Postgraduate',
    'jobs-and-careers': 'Jobs & Careers',
    'student-advice': 'Student Advice',
    'online-magazines': 'Online Magazines',
    'subject-guide': 'Subject Guide',
    'university-profiles': 'University Profiles',
    'college-profiles': 'College Profiles',
    'career-sectors': 'Career Sectors',
    'job-search': 'Job Search',
    'student-finance': 'Student Finance',
    'uk-city-guide': 'UK City Guide',
    'mba-courses': 'MBA Courses',
    'courses-and-careers': 'Courses and Careers',
    'postgraduate-courses-and-careers': 'Postgraduate Courses and Careers',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'accessibility-statement': 'Accessibility Statement'
  };
  
  if (titleMap[segment]) {
    return titleMap[segment];
  }
  
  // For article URLs with IDs (e.g., "7690-australian-universities")
  if (segment.match(/^\d{4,}-/)) {
    return segment
      .replace(/^\d{4,}-/, '') // Remove ID prefix
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Default: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get page type based on URL for structured data
 * @param {string} url - The page URL
 * @returns {string} Page type (homepage, section, article, etc.)
 */
export function getPageType(url) {
  if (url === '/') return 'homepage';
  
  if (url.match(/^\/(further-education|undergraduate|postgraduate|jobs-and-careers|student-advice|online-magazines)$/)) {
    return 'section';
  }
  
  if (url.match(/^\/(further-education|undergraduate|postgraduate|jobs-and-careers|student-advice|online-magazines)\/[^\/]+$/)) {
    return 'subsection';
  }
  
  if (url.includes('/article/') || url.match(/\/\d{4,}-/)) {
    return 'article';
  }
  
  if (url.includes('/emags/')) {
    return 'magazine';
  }
  
  if (url.includes('/university-profiles/')) {
    return 'university';
  }
  
  if (url.includes('/career-sectors/')) {
    return 'career';
  }
  
  return 'page';
}

/**
 * Extract article metadata from content (if available)
 * @param {string} content - Article content
 * @returns {object} Metadata object
 */
export function extractArticleMetadata(content) {
  const metadata = {
    publishDate: null,
    author: 'Courses & Careers Editorial Team',
    keywords: [],
    estimatedReadingTime: 0
  };
  
  if (!content) return metadata;
  
  // Estimate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  metadata.estimatedReadingTime = Math.ceil(wordCount / 200);
  
  // Try to extract date from content or filename
  const dateMatch = content.match(/\b(20\d{2})\b/);
  if (dateMatch) {
    metadata.publishDate = `${dateMatch[1]}-01-01`; // Default to January 1st
  }
  
  return metadata;
}

/**
 * Generate canonical URL
 * @param {string} path - The page path
 * @returns {string} Full canonical URL
 */
export function getCanonicalUrl(path) {
  return `${SITE_CONFIG.url}${path}`;
}

/**
 * Validate and clean URL for sitemap
 * @param {string} url - URL to validate
 * @returns {string|null} Clean URL or null if invalid
 */
export function validateSitemapUrl(url) {
  // Remove any query parameters or fragments
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Ensure it starts with /
  if (!cleanUrl.startsWith('/')) {
    return null;
  }
  
  // Remove double slashes
  const normalizedUrl = cleanUrl.replace(/\/+/g, '/');
  
  // Remove trailing slash except for root
  if (normalizedUrl.length > 1 && normalizedUrl.endsWith('/')) {
    return normalizedUrl.slice(0, -1);
  }
  
  return normalizedUrl;
}