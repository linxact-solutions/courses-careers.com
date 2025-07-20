/**
 * Auto-generated XML Sitemap for courses-careers.com
 * Automatically scans all pages and generates sitemap with proper priorities and change frequencies
 */

import { getAllPages, generateSitemapXML } from '../utils/seo.js';

export async function GET() {
  try {
    // Get all pages from the site
    const pages = await getAllPages();
    
    // Generate XML sitemap
    const sitemapXML = generateSitemapXML(pages);
    
    // Return XML response with proper headers
    return new Response(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex' // Don't index the sitemap itself
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return error response
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.courses-careers.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  }
}