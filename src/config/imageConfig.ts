/**
 * Image optimization configuration for the Courses & Careers website
 */

export const imageConfig = {
  // Default quality settings for different formats
  quality: {
    avif: 80,
    webp: 85,
    jpg: 85,
    png: 90,
  },

  // Breakpoints for responsive images
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Default widths for responsive images
  defaultWidths: [320, 640, 768, 1024, 1280, 1536, 1920],

  // Image size presets
  presets: {
    thumbnail: {
      width: 150,
      height: 150,
      quality: 80,
    },
    small: {
      width: 400,
      height: 300,
      quality: 85,
    },
    medium: {
      width: 800,
      height: 600,
      quality: 85,
    },
    large: {
      width: 1200,
      height: 800,
      quality: 90,
    },
    hero: {
      width: 1920,
      height: 1080,
      quality: 90,
    },
  },

  // Lazy loading configuration
  lazyLoading: {
    rootMargin: '50px 0px',
    threshold: 0.01,
    // Images to always load eagerly (by class or ID)
    eagerSelectors: [
      '.hero-image',
      '.above-fold',
      '#main-logo',
    ],
  },

  // External domains allowed for image optimization
  allowedDomains: [
    'images.unsplash.com',
    'cdn.courses-careers.com',
    'via.placeholder.com',
  ],

  // Remote patterns for external images
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'cdn.courses-careers.com',
      pathname: '/images/**',
    },
  ],

  // Output formats in order of preference
  outputFormats: ['avif', 'webp', 'jpg'] as const,

  // Cache settings
  cache: {
    directory: './.astro/image-cache',
    maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
  },

  // Placeholder settings
  placeholder: {
    type: 'blur', // 'blur' | 'dominantColor' | 'none'
    blurRadius: 20,
    quality: 10,
  },
};

/**
 * Get image configuration for specific use cases
 */
export function getImageConfig(preset: keyof typeof imageConfig.presets) {
  return imageConfig.presets[preset];
}

/**
 * Get responsive image widths based on container
 */
export function getResponsiveWidths(maxWidth: number): number[] {
  return imageConfig.defaultWidths.filter(w => w <= maxWidth * 2);
}

/**
 * Generate sizes attribute based on breakpoints
 */
export function generateSizes(maxWidth?: number): string {
  const { sm, md, lg, xl } = imageConfig.breakpoints;
  
  if (!maxWidth) {
    return '100vw';
  }
  
  if (maxWidth <= sm) {
    return '100vw';
  } else if (maxWidth <= md) {
    return `(max-width: ${sm}px) 100vw, ${maxWidth}px`;
  } else if (maxWidth <= lg) {
    return `(max-width: ${sm}px) 100vw, (max-width: ${md}px) 90vw, ${maxWidth}px`;
  } else {
    return `(max-width: ${sm}px) 100vw, (max-width: ${md}px) 90vw, (max-width: ${lg}px) 80vw, ${maxWidth}px`;
  }
}