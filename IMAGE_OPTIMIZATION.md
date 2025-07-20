# Image Optimization Guide

This document describes how to use the image optimization features in the Courses & Careers Astro project.

## Setup Complete

The following has been configured:

1. **Astro with Sharp** - High-performance image processing
2. **Custom Components** - Reusable image components for different use cases
3. **Optimization Settings** - Configured in `astro.config.mjs`
4. **TypeScript Support** - Full type safety for image imports

## Components

### 1. OptimizedImage

Basic optimized image component with automatic format conversion and responsive sizing.

```astro
import OptimizedImage from '@components/OptimizedImage.astro';

<OptimizedImage
  src="/src/assets/images/hero-bg.jpg"
  alt="Description of image"
  width={1920}
  height={1080}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 1920px"
/>
```

**Props:**
- `src`: Image path or imported image
- `alt`: Alt text (required)
- `width`/`height`: Dimensions
- `loading`: 'eager' | 'lazy' (default: 'lazy')
- `sizes`: Responsive sizes string
- `quality`: Image quality (0-100)
- `format`: Output format
- `placeholder`: 'blur' | 'dominantColor' | 'none'

### 2. ResponsivePicture

Art-directed responsive images with multiple formats.

```astro
import ResponsivePicture from '@components/ResponsivePicture.astro';

<ResponsivePicture
  src="/src/assets/images/campus.jpg"
  alt="Campus view"
  widths={[400, 800, 1200]}
  formats={['avif', 'webp']}
  sizes="(max-width: 640px) 100vw, 1200px"
/>
```

### 3. BackgroundImage

Optimized background images with overlay support.

```astro
import BackgroundImage from '@components/BackgroundImage.astro';

<BackgroundImage
  src="/src/assets/images/hero-bg.jpg"
  overlay={true}
  overlayOpacity={0.5}
  loading="eager"
>
  <h1>Hero Content</h1>
</BackgroundImage>
```

### 4. ImageGallery

Interactive image gallery with lightbox.

```astro
import ImageGallery from '@components/ImageGallery.astro';

const images = [
  { src: '/path/to/image1.jpg', alt: 'Image 1', caption: 'Caption 1' },
  { src: '/path/to/image2.jpg', alt: 'Image 2', caption: 'Caption 2' },
];

<ImageGallery
  images={images}
  columns={3}
  lightbox={true}
/>
```

## Adding Real Images

When you have actual images:

1. Place them in `/src/assets/images/`
2. Import them in your Astro components:

```astro
---
import heroImage from '../assets/images/hero-bg.jpg';
import OptimizedImage from '@components/OptimizedImage.astro';
---

<OptimizedImage
  src={heroImage}
  alt="Hero background"
  loading="eager"
/>
```

## Image Manifest

The `/src/assets/images/image-manifest.json` file documents the expected images and their properties. Update this when adding new images.

## Performance Best Practices

1. **Above-the-fold images**: Use `loading="eager"`
2. **Below-the-fold images**: Use `loading="lazy"` (default)
3. **Hero images**: Consider using `priority` loading
4. **Thumbnails**: Use smaller `width` and `height` values
5. **Gallery images**: Always use lazy loading except for the first few

## Configuration

Image optimization settings in `astro.config.mjs`:

```js
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      limitInputPixels: false,
    },
  },
  domains: ['cdn.example.com'], // Allowed external domains
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.example.com',
    },
  ],
}
```

## Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## Placeholder Images

While real images are not available, the components will show placeholder images. Once you add real images to `/src/assets/images/`, the components will automatically use them.

## Examples

View working examples at:
- `/` - Basic demo page
- `/image-showcase` - Comprehensive showcase of all features