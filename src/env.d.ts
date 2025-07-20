/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Image types for Astro
interface ImportMetaEnv {
  readonly PUBLIC_IMAGE_CDN_URL?: string;
  readonly PUBLIC_IMAGE_OPTIMIZATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declare module for image imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}