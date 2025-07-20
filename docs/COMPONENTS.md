# Component Documentation

This document provides comprehensive documentation for all components in the Courses & Careers project.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Form Components](#form-components)
- [Media Components](#media-components)
- [Analytics Components](#analytics-components)
- [Accessibility Components](#accessibility-components)
- [Utility Components](#utility-components)
- [Component Guidelines](#component-guidelines)
- [Testing Components](#testing-components)
- [Performance Considerations](#performance-considerations)

## Component Architecture

### Component Types

The project uses three main types of components:

1. **Astro Components** (`.astro`) - Server-side rendered components
2. **React Components** (`.tsx`) - Client-side interactive components
3. **Hybrid Components** - Astro components with React islands

### File Structure

```
src/components/
├── accessibility/          # Accessibility-focused components
│   ├── AccessibilityAnnouncer.tsx
│   ├── SkipLink.astro
│   └── AccessibleForm.tsx
├── analytics/             # Analytics and tracking components
│   ├── Analytics.astro
│   └── CookieConsent.tsx
├── forms/                 # Form-related components
│   ├── SearchForm.tsx
│   └── ContactForm.tsx
├── layout/               # Layout and navigation components
│   ├── Header.astro
│   ├── Footer.astro
│   └── Navigation.tsx
├── media/                # Image and media components
│   ├── OptimizedImage.astro
│   ├── ResponsivePicture.astro
│   ├── BackgroundImage.astro
│   └── ImageGallery.astro
├── ui/                   # General UI components
│   ├── Button.astro
│   ├── Card.astro
│   ├── Modal.tsx
│   └── Dropdown.tsx
└── utils/                # Utility components
    ├── FaviconMeta.astro
    └── SEOMeta.astro
```

## Layout Components

### Layout.astro

Main layout component that wraps all pages.

**File**: `src/layouts/Layout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalURL?: string;
  section?: string;
}
---
```

**Props**:
- `title` (required): Page title
- `description`: Meta description
- `keywords`: SEO keywords
- `ogImage`: Open Graph image URL
- `canonicalURL`: Canonical URL
- `section`: Current section for navigation

**Usage**:
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout 
  title="University Courses | Courses & Careers"
  description="Find the perfect university course for your future"
  keywords="university, courses, education, UK"
  section="undergraduate"
>
  <h1>University Courses</h1>
  <!-- Page content -->
</Layout>
```

**Features**:
- Responsive navigation
- SEO optimization
- Analytics integration
- Cookie consent management
- Accessibility features

### BaseLayout.astro

Minimal layout for special pages.

**File**: `src/layouts/BaseLayout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
}
---
```

**Usage**:
```astro
<BaseLayout title="404 - Page Not Found">
  <div class="error-page">
    <h1>Page Not Found</h1>
  </div>
</BaseLayout>
```

## UI Components

### CourseCard.astro

Displays course information in a card format.

**File**: `src/components/CourseCard.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  imageUrl?: string;
  category: 'undergraduate' | 'postgraduate' | 'further';
  duration: number;
  requirements: string[];
  featured?: boolean;
  url?: string;
}
---
```

**Props**:
- `title`: Course title
- `description`: Course description
- `imageUrl`: Course image URL
- `category`: Course category
- `duration`: Duration in months
- `requirements`: Entry requirements
- `featured`: Whether course is featured
- `url`: Course detail page URL

**Usage**:
```astro
<CourseCard
  title="Computer Science BSc"
  description="Learn programming, algorithms, and software development"
  category="undergraduate"
  duration={36}
  requirements={["A-levels", "Mathematics", "Physics"]}
  featured={true}
  url="/undergraduate/computer-science"
/>
```

**Features**:
- Responsive design
- Hover animations
- Category color coding
- Accessibility support
- SEO-friendly markup

### Button.astro

Reusable button component with multiple variants.

**File**: `src/components/Button.astro`

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  target?: '_blank' | '_self';
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}
---
```

**Usage**:
```astro
<!-- As button -->
<Button variant="primary" size="lg">
  Apply Now
</Button>

<!-- As link -->
<Button href="/courses" variant="outline">
  View Courses
</Button>

<!-- Loading state -->
<Button loading={true} disabled={true}>
  Processing...
</Button>
```

### Card.astro

Generic card component for content layout.

**File**: `src/components/Card.astro`

```astro
---
interface Props {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  href?: string;
  variant?: 'default' | 'featured' | 'compact';
  class?: string;
}
---
```

**Usage**:
```astro
<Card
  title="Student Finance Guide"
  subtitle="Everything you need to know about funding your education"
  imageUrl="/images/finance-guide.jpg"
  href="/student-advice/finance"
  variant="featured"
>
  <p>Learn about loans, grants, and scholarships available...</p>
</Card>
```

## Form Components

### AccessibleForm.tsx

Fully accessible form component with validation.

**File**: `src/components/AccessibleForm.tsx`

```typescript
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: (value: string) => string | null;
}

interface AccessibleFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitText?: string;
  loading?: boolean;
  title?: string;
  description?: string;
}
```

**Usage**:
```typescript
const contactFields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    validation: (value) => value.length < 2 ? 'Name must be at least 2 characters' : null
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: (value) => !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : null
  },
  {
    name: 'course',
    label: 'Interested Course',
    type: 'select',
    options: [
      { value: 'computer-science', label: 'Computer Science' },
      { value: 'engineering', label: 'Engineering' }
    ]
  }
];

<AccessibleForm
  fields={contactFields}
  onSubmit={handleSubmit}
  submitText="Send Message"
  title="Contact Us"
  description="Get in touch with our admissions team"
/>
```

**Features**:
- WCAG 2.2 AA compliant
- Real-time validation
- Error announcements
- Keyboard navigation
- Screen reader support

### SearchForm.tsx

Interactive search form for courses.

**File**: `src/components/SearchForm.tsx`

```typescript
interface SearchFormProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  initialQuery?: string;
  initialFilters?: SearchFilters;
}

interface SearchFilters {
  category?: string;
  duration?: string;
  level?: string;
  location?: string;
}
```

**Usage**:
```typescript
<SearchForm
  onSearch={handleSearch}
  placeholder="Search courses..."
  showFilters={true}
  initialQuery="computer science"
/>
```

**Features**:
- Debounced search
- Advanced filters
- URL parameter sync
- Autocomplete suggestions
- Mobile-responsive

## Media Components

### OptimizedImage.astro

High-performance image component with automatic optimization.

**File**: `src/components/OptimizedImage.astro`

```astro
---
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  placeholder?: 'blur' | 'dominantColor' | 'none';
  class?: string;
}
---
```

**Usage**:
```astro
<OptimizedImage
  src="/images/campus-hero.jpg"
  alt="University campus overview"
  width={1920}
  height={1080}
  loading="eager"
  sizes="(max-width: 768px) 100vw, 1920px"
  quality={85}
  format="webp"
  placeholder="blur"
/>
```

**Features**:
- Automatic format conversion
- Responsive sizing
- Lazy loading
- Blur placeholders
- WebP/AVIF support

### ResponsivePicture.astro

Advanced responsive image component for art direction.

**File**: `src/components/ResponsivePicture.astro`

```astro
---
interface Props {
  src: string;
  alt: string;
  widths: number[];
  formats?: string[];
  sizes?: string;
  loading?: 'eager' | 'lazy';
  class?: string;
}
---
```

**Usage**:
```astro
<ResponsivePicture
  src="/images/course-hero.jpg"
  alt="Course overview"
  widths={[400, 800, 1200, 1600]}
  formats={['avif', 'webp', 'jpeg']}
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 800px"
  loading="lazy"
/>
```

### BackgroundImage.astro

Optimized background image component with overlay support.

**File**: `src/components/BackgroundImage.astro`

```astro
---
interface Props {
  src: string;
  alt?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  loading?: 'eager' | 'lazy';
  class?: string;
}
---
```

**Usage**:
```astro
<BackgroundImage
  src="/images/hero-bg.jpg"
  alt="University background"
  overlay={true}
  overlayOpacity={0.6}
  overlayColor="black"
  loading="eager"
  class="hero-section"
>
  <div class="hero-content">
    <h1>Welcome to Courses & Careers</h1>
    <p>Find your perfect course</p>
  </div>
</BackgroundImage>
```

### ImageGallery.astro

Interactive image gallery with lightbox functionality.

**File**: `src/components/ImageGallery.astro`

```astro
---
interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface Props {
  images: GalleryImage[];
  columns?: number;
  gap?: string;
  lightbox?: boolean;
  captions?: boolean;
  class?: string;
}
---
```

**Usage**:
```astro
---
const galleryImages = [
  { 
    src: '/images/campus-1.jpg', 
    alt: 'Campus library',
    caption: 'Modern library facilities' 
  },
  { 
    src: '/images/campus-2.jpg', 
    alt: 'Science labs',
    caption: 'State-of-the-art laboratories' 
  }
];
---

<ImageGallery
  images={galleryImages}
  columns={3}
  lightbox={true}
  captions={true}
/>
```

## Analytics Components

### Analytics.astro

Multi-provider analytics integration component.

**File**: `src/components/Analytics.astro`

```astro
---
interface Props {
  ga4?: {
    measurementId: string;
  };
  matomo?: {
    url: string;
    siteId: string;
  };
  hubspot?: {
    portalId: string;
  };
  intercom?: {
    appId: string;
  };
  optimizely?: {
    projectId: string;
  };
}
---
```

**Usage**:
```astro
<Analytics 
  ga4={{ measurementId: "G-XXXXXXXXXX" }}
  matomo={{ url: "https://analytics.domain.com/", siteId: "1" }}
  hubspot={{ portalId: "XXXXXXXX" }}
  intercom={{ appId: "xxxxxxxx" }}
  optimizely={{ projectId: "XXXXXXXXX" }}
/>
```

**Features**:
- GDPR compliant
- Consent-based loading
- Privacy-focused configuration
- Multiple provider support
- Fallback tracking

### CookieConsent.tsx

GDPR-compliant cookie consent management.

**File**: `src/components/CookieConsent.tsx`

```typescript
interface CookieConsentProps {
  showBanner?: boolean;
  onConsentChange?: (consent: ConsentSettings) => void;
  position?: 'bottom' | 'top';
  theme?: 'light' | 'dark';
}

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}
```

**Usage**:
```typescript
<CookieConsent
  showBanner={true}
  onConsentChange={handleConsentChange}
  position="bottom"
  theme="light"
/>
```

**Features**:
- Granular consent controls
- Persistent preferences
- Keyboard accessible
- Multi-language support
- Customizable themes

## Accessibility Components

### AccessibilityAnnouncer.tsx

Live region announcements for screen readers.

**File**: `src/components/AccessibilityAnnouncer.tsx`

```typescript
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface AccessibilityAnnouncerProps {
  children?: React.ReactNode;
}
```

**Usage**:
```typescript
import { useAnnouncements } from '../components/AccessibilityAnnouncer';

function SearchResults() {
  const { announceSuccess, announceError } = useAnnouncements();
  
  const handleSearch = async (query: string) => {
    try {
      const results = await searchCourses(query);
      announceSuccess(`Found ${results.length} courses for "${query}"`);
    } catch (error) {
      announceError('Search failed. Please try again.');
    }
  };
}
```

### SkipLink.astro

Skip navigation links for keyboard users.

**File**: `src/components/SkipLink.astro`

```astro
---
interface Props {
  href?: string;
  text?: string;
  class?: string;
}
---
```

**Usage**:
```astro
<SkipLink href="#main-content" text="Skip to main content" />
<SkipLink href="#navigation" text="Skip to navigation" />
```

## Utility Components

### FaviconMeta.astro

Comprehensive favicon meta tags.

**File**: `src/components/FaviconMeta.astro`

```astro
---
interface Props {
  iconPath?: string;
  appleTouchIcon?: string;
  manifestPath?: string;
  themeColor?: string;
}
---
```

**Usage**:
```astro
<FaviconMeta
  iconPath="/favicon.ico"
  appleTouchIcon="/apple-touch-icon.png"
  manifestPath="/site.webmanifest"
  themeColor="#1d4ed8"
/>
```

### SEOMeta.astro

Advanced SEO meta tags and structured data.

**File**: `src/components/SEOMeta.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalURL?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  structuredData?: object;
}
---
```

**Usage**:
```astro
<SEOMeta
  title="Computer Science Courses | University Guide"
  description="Comprehensive guide to computer science degree programs"
  keywords="computer science, programming, software engineering, university"
  ogImage="/images/computer-science-og.jpg"
  canonicalURL="https://courses-careers.com/computer-science"
  type="article"
  publishedTime="2024-01-15"
  author="Courses & Careers Team"
  section="undergraduate"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Computer Science BSc",
    "description": "Learn programming and software development",
    "provider": {
      "@type": "Organization",
      "name": "University Name"
    }
  }}
/>
```

## Component Guidelines

### Design Principles

1. **Accessibility First**: All components must be accessible by default
2. **Progressive Enhancement**: Components work without JavaScript
3. **Responsive Design**: Mobile-first approach
4. **Performance**: Optimized for speed and efficiency
5. **Reusability**: Components should be flexible and reusable

### Props Interface

Always define TypeScript interfaces for props:

```typescript
interface ComponentProps {
  // Required props first
  title: string;
  description: string;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  
  // Event handlers
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  
  // Children and class
  children?: React.ReactNode;
  class?: string;
}
```

### Styling Guidelines

1. **Tailwind First**: Use Tailwind utilities for styling
2. **Custom CSS**: Use scoped styles for complex layouts
3. **CSS Variables**: Use for theme values
4. **Responsive**: Mobile-first responsive design

```astro
---
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'primary', size = 'md' } = Astro.props;

const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
};
const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
---

<button class={className}>
  <slot />
</button>
```

### Error Handling

Implement proper error boundaries and fallbacks:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-fallback">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function MyComponent() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Component error:', error, errorInfo);
      }}
    >
      <FeatureComponent />
    </ErrorBoundary>
  );
}
```

## Testing Components

### Unit Testing

Test components with Jest and Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant classes', () => {
    render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });

  test('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Testing

Test accessibility with axe-core:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import CourseCard from '../CourseCard';

expect.extend(toHaveNoViolations);

describe('CourseCard Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <CourseCard
        title="Test Course"
        description="Test description"
        category="undergraduate"
        duration={36}
        requirements={['A-levels']}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has proper heading structure', () => {
    render(
      <CourseCard
        title="Test Course"
        description="Test description"
        category="undergraduate"
        duration={36}
        requirements={['A-levels']}
      />
    );

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});
```

### Visual Testing

Use Storybook for component development and testing:

```typescript
// CourseCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import CourseCard from './CourseCard';

const meta: Meta<typeof CourseCard> = {
  title: 'Components/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Computer Science BSc',
    description: 'Learn programming, algorithms, and software development',
    category: 'undergraduate',
    duration: 36,
    requirements: ['A-levels', 'Mathematics', 'Physics'],
  },
};

export const Featured: Story = {
  args: {
    ...Default.args,
    featured: true,
  },
};

export const Postgraduate: Story = {
  args: {
    ...Default.args,
    title: 'Computer Science MSc',
    category: 'postgraduate',
    duration: 12,
    requirements: ['Bachelor\'s degree', 'Programming experience'],
  },
};
```

## Performance Considerations

### Code Splitting

Use dynamic imports for large components:

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Bundle Optimization

Optimize imports to reduce bundle size:

```typescript
// Bad - imports entire library
import { debounce } from 'lodash';

// Good - imports only what's needed
import debounce from 'lodash/debounce';

// Even better - use native alternatives
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};
```

### Image Optimization

Use optimized images in components:

```astro
<!-- Good - uses OptimizedImage -->
<OptimizedImage
  src="/images/course-hero.jpg"
  alt="Course overview"
  width={800}
  height={400}
  loading="lazy"
  formats={['avif', 'webp']}
/>

<!-- Avoid - unoptimized image -->
<img src="/images/course-hero.jpg" alt="Course overview" />
```

### Memory Management

Clean up resources in React components:

```typescript
import { useEffect, useRef } from 'react';

function Component() {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // Timer logic
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return <div>Component content</div>;
}
```

---

*For more information, see the main [README.md](../README.md) or other documentation in the `/docs` folder.*