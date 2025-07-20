/**
 * Image optimization helpers for Astro projects
 */

export interface ImageSize {
  width: number;
  suffix: string;
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: ImageSize[];
  formats?: string[];
  quality?: number;
  loading?: 'eager' | 'lazy';
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  basePath: string,
  sizes: ImageSize[],
  format: string = 'jpg'
): string {
  return sizes
    .map(({ width, suffix }) => {
      const filename = basePath.replace(/\.[^/.]+$/, '');
      return `${filename}-${suffix}.${format} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const { mobile = 640, tablet = 1024, desktop = 1280 } = breakpoints;
  
  return `(max-width: ${mobile}px) 100vw, (max-width: ${tablet}px) 90vw, ${desktop}px`;
}

/**
 * Get optimal image dimensions based on container width
 */
export function getOptimalDimensions(
  containerWidth: number,
  aspectRatio: number = 16 / 9
): { width: number; height: number } {
  const pixelDensity = window.devicePixelRatio || 1;
  const optimalWidth = Math.ceil(containerWidth * pixelDensity);
  const optimalHeight = Math.ceil(optimalWidth / aspectRatio);
  
  return { width: optimalWidth, height: optimalHeight };
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function initLazyLoading(selector: string = '[data-lazy]'): void {
  const images = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.removeAttribute('data-lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without Intersection Observer
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.dataset.src) {
        htmlImg.src = htmlImg.dataset.src;
      }
    });
  }
}

/**
 * Calculate blur data URL for placeholder
 */
export async function generateBlurDataURL(
  imagePath: string,
  width: number = 20,
  height: number = 20
): Promise<string> {
  // This is a placeholder implementation
  // In a real scenario, you would use a library like plaiceholder
  // or generate this during build time
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb' filter='url(%23blur)'/%3E%3C/svg%3E`;
}

/**
 * Get image format based on browser support
 */
export function getOptimalFormat(): 'avif' | 'webp' | 'jpg' {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Check AVIF support
  if (canvas.toDataURL('image/avif').indexOf('image/avif') === 5) {
    return 'avif';
  }
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('image/webp') === 5) {
    return 'webp';
  }
  
  return 'jpg';
}

/**
 * Image loading priority based on viewport position
 */
export function getLoadingPriority(element: HTMLElement): 'eager' | 'lazy' {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // If element is in the first viewport, load eagerly
  if (rect.top < viewportHeight && rect.bottom > 0) {
    return 'eager';
  }
  
  return 'lazy';
}