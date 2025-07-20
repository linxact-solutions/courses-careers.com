#!/usr/bin/env node

/**
 * Favicon Generation Script for courses-careers.com
 * 
 * Generates complete favicon set from SVG logo including:
 * - All required PNG sizes (16x16 to 512x512)
 * - favicon.ico for legacy browsers
 * - apple-touch-icon.png
 * - Microsoft tile icons
 * 
 * Usage: node scripts/generate-favicons.js
 */

import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All required favicon sizes
const sizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 64, name: 'icon-64x64.png' },
  { size: 70, name: 'icon-70x70.png' }, // Microsoft
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 150, name: 'icon-150x150.png' }, // Microsoft
  { size: 180, name: 'icon-180x180.png' }, // Apple
  { size: 192, name: 'icon-192x192.png' }, // Android
  { size: 310, name: 'icon-310x310.png' }, // Microsoft large tile
  { size: 512, name: 'icon-512x512.png' }, // PWA
];

// Special named files
const specialFiles = [
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' },
];

async function generateFavicons() {
  console.log('🎨 Generating Favicon Set for courses-careers.com');
  console.log('===================================================');
  
  const inputSvg = path.join(__dirname, '../src/assets/logo-icon.svg');
  const outputDir = path.join(__dirname, '../public');

  // Check if we have the required dependencies
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (error) {
    console.error('❌ Sharp not found. Please install it first:');
    console.error('   npm install --save-dev sharp');
    console.error('   Then run this script again.');
    process.exit(1);
  }

  try {
    // Verify input file exists
    await fs.access(inputSvg);
    console.log(`📁 Source: ${inputSvg}`);
    console.log(`📁 Output: ${outputDir}\n`);

    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);

    // Generate all standard sizes
    console.log('⚡ Generating PNG files...');
    const allSizes = [...sizes, ...specialFiles];
    
    for (const { size, name } of allSizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);
      
      console.log(`  ✓ ${name} (${size}x${size})`);
    }

    // Generate favicon.ico using multiple sizes
    console.log('\n⚡ Generating favicon.ico...');
    try {
      const toIco = (await import('to-ico')).default;
      
      // Create multiple PNG buffers for ICO
      const icoSizes = [16, 32, 48];
      const icoBuffers = await Promise.all(
        icoSizes.map(size => 
          sharp(svgBuffer)
            .resize(size, size, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer()
        )
      );
      
      const icoBuffer = await toIco(icoBuffers);
      await fs.writeFile(path.join(outputDir, 'favicon.ico'), icoBuffer);
      console.log('  ✓ favicon.ico (16x16, 32x32, 48x48)');
      
    } catch (error) {
      console.log('  ⚠️  favicon.ico generation failed. Install to-ico:');
      console.log('     npm install --save-dev to-ico');
      console.log('     Then run this script again for ICO generation.');
    }

    console.log('\n🎉 Favicon generation complete!');
    console.log('\nGenerated files:');
    console.log('================');
    
    // List all generated files
    for (const { name, size } of allSizes) {
      console.log(`  📄 ${name} (${size}x${size})`);
    }
    console.log('  📄 favicon.ico (multi-size)');
    
    console.log('\n📋 Next steps:');
    console.log('  1. Verify all files were generated in /public');
    console.log('  2. Update HTML head tags to reference favicon files');
    console.log('  3. Update site.webmanifest with correct icon paths');
    console.log('  4. Test favicons in different browsers and devices');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFavicons();
}

export { generateFavicons, sizes, specialFiles };