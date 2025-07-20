# Development Guide

This guide covers the development workflow, setup, and best practices for the Courses & Careers project.

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Development](#component-development)
- [Testing](#testing)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Git Workflow](#git-workflow)
- [Debugging](#debugging)
- [Build Process](#build-process)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **VS Code**: Recommended editor
- **Browser**: Chrome/Firefox with dev tools

### Required VS Code Extensions

Install these extensions for optimal development experience:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker",
    "ms-vscode.vscode-json",
    "yzhang.markdown-all-in-one"
  ]
}
```

### Initial Setup

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
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:4321`

### Development Environment Variables

Create `.env.local` for local development:

```env
# Local development settings
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_DEVELOPMENT_MODE=true
PUBLIC_DEBUG_MODE=true

# Analytics (use test IDs for development)
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_MATOMO_URL=http://localhost:8080/
PUBLIC_MATOMO_SITE_ID=1

# Image optimization
PUBLIC_IMAGE_OPTIMIZATION=true
PUBLIC_IMAGE_CDN_URL=http://localhost:4321

# Feature flags
PUBLIC_FEATURE_LIVE_CHAT=false
PUBLIC_FEATURE_A_B_TESTING=false
```

## Project Structure

```
courses-careers.com/
├── .astro/                     # Astro build cache
├── .github/                    # GitHub Actions workflows
├── .vscode/                    # VS Code configuration
├── docs/                       # Documentation
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── favicon.ico             # Favicon
│   ├── robots.txt              # SEO directives
│   └── site.webmanifest        # PWA manifest
├── src/                        # Source code
│   ├── assets/                 # Build-time assets
│   │   ├── images/             # Optimized images
│   │   └── logo.svg            # SVG assets
│   ├── components/             # Reusable components
│   │   ├── AccessibilityAnnouncer.tsx
│   │   ├── Analytics.astro
│   │   ├── CookieConsent.tsx
│   │   ├── CourseCard.astro
│   │   ├── FaviconMeta.astro
│   │   ├── OptimizedImage.astro
│   │   └── ...
│   ├── config/                 # Configuration files
│   │   └── imageConfig.ts
│   ├── layouts/                # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── Layout.astro
│   ├── lib/                    # Utility libraries
│   │   ├── accessibility.ts
│   │   ├── analytics.ts
│   │   └── cookies.ts
│   ├── pages/                  # Route pages
│   │   ├── index.astro
│   │   ├── undergraduate/
│   │   ├── postgraduate/
│   │   └── ...
│   ├── styles/                 # Global styles
│   │   ├── global.css
│   │   └── accessibility.css
│   ├── utils/                  # Helper functions
│   │   └── imageHelpers.ts
│   └── env.d.ts                # TypeScript environment types
├── scripts/                    # Build and utility scripts
├── astro.config.mjs            # Astro configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Development Workflow

### Daily Development Process

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**:
   - Follow coding standards
   - Write tests for new features
   - Update documentation

4. **Test changes**:
   ```bash
   npm run test
   npm run test:a11y
   npm run build
   ```

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run start            # Alias for dev

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run type-check       # Check TypeScript types

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run end-to-end tests
npm run test:a11y        # Run accessibility tests
npm run test:perf        # Run performance tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Build Analysis
npm run analyze          # Analyze bundle size
npm run lighthouse       # Run Lighthouse audit
npm run size-limit       # Check bundle size limits

# Deployment
npm run deploy:staging   # Deploy to staging
npm run deploy:prod      # Deploy to production
npm run deploy:preview   # Deploy preview build
```

## Coding Standards

### TypeScript Guidelines

1. **Use strict mode**:
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

2. **Define interfaces for props**:
   ```typescript
   interface CourseCardProps {
     title: string;
     description: string;
     imageUrl?: string;
     category: 'undergraduate' | 'postgraduate' | 'further';
     duration: number;
     requirements: string[];
   }
   ```

3. **Use utility types**:
   ```typescript
   type CourseCategory = Pick<Course, 'category' | 'level'>;
   type RequiredCourseInfo = Required<Pick<Course, 'title' | 'description'>>;
   ```

### Astro Component Guidelines

1. **Component structure**:
   ```astro
   ---
   // TypeScript imports and logic
   interface Props {
     title: string;
     description?: string;
   }
   
   const { title, description = '' } = Astro.props;
   ---
   
   <!-- HTML template -->
   <div class="component">
     <h2>{title}</h2>
     {description && <p>{description}</p>}
   </div>
   
   <style>
     /* Component-specific styles */
     .component {
       padding: 1rem;
     }
   </style>
   ```

2. **Props validation**:
   ```typescript
   interface Props {
     title: string;
     level: 'undergraduate' | 'postgraduate';
     featured?: boolean;
   }
   
   const { title, level, featured = false } = Astro.props;
   
   // Validation
   if (!title || title.length < 3) {
     throw new Error('Title is required and must be at least 3 characters');
   }
   ```

### React Component Guidelines

1. **Functional components with hooks**:
   ```typescript
   import { useState, useEffect } from 'react';
   
   interface SearchProps {
     onSearch: (query: string) => void;
     placeholder?: string;
   }
   
   export default function Search({ onSearch, placeholder = 'Search...' }: SearchProps) {
     const [query, setQuery] = useState('');
     
     useEffect(() => {
       const debounced = setTimeout(() => {
         onSearch(query);
       }, 300);
       
       return () => clearTimeout(debounced);
     }, [query, onSearch]);
     
     return (
       <input
         type="text"
         value={query}
         onChange={(e) => setQuery(e.target.value)}
         placeholder={placeholder}
         className="search-input"
       />
     );
   }
   ```

2. **Custom hooks**:
   ```typescript
   import { useState, useEffect } from 'react';
   
   export function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value);
     
     useEffect(() => {
       const handler = setTimeout(() => {
         setDebouncedValue(value);
       }, delay);
       
       return () => clearTimeout(handler);
     }, [value, delay]);
     
     return debouncedValue;
   }
   ```

### CSS/Tailwind Guidelines

1. **Use Tailwind utilities first**:
   ```html
   <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
     <h3 class="text-xl font-semibold text-gray-900 mb-2">Course Title</h3>
     <p class="text-gray-600 mb-4">Course description...</p>
   </div>
   ```

2. **Custom CSS for complex layouts**:
   ```css
   .course-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
     gap: 2rem;
   }
   
   @media (max-width: 768px) {
     .course-grid {
       grid-template-columns: 1fr;
     }
   }
   ```

3. **CSS custom properties for themes**:
   ```css
   :root {
     --color-primary: #1d4ed8;
     --color-secondary: #059669;
     --spacing-section: 4rem;
   }
   
   .section {
     padding: var(--spacing-section) 0;
   }
   ```

## Component Development

### Creating New Components

1. **Astro component template**:
   ```astro
   ---
   // src/components/NewComponent.astro
   interface Props {
     title: string;
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
   }
   
   const { 
     title, 
     variant = 'primary', 
     size = 'md' 
   } = Astro.props;
   
   const classes = [
     'component',
     `component--${variant}`,
     `component--${size}`
   ].join(' ');
   ---
   
   <div class={classes}>
     <h2>{title}</h2>
     <slot />
   </div>
   
   <style>
     .component {
       padding: 1rem;
       border-radius: 0.5rem;
     }
     
     .component--primary {
       background-color: var(--color-primary);
       color: white;
     }
     
     .component--secondary {
       background-color: var(--color-secondary);
       color: white;
     }
     
     .component--sm { padding: 0.5rem; }
     .component--md { padding: 1rem; }
     .component--lg { padding: 2rem; }
   </style>
   ```

2. **React component template**:
   ```typescript
   // src/components/NewComponent.tsx
   import { useState } from 'react';
   
   interface NewComponentProps {
     title: string;
     onAction?: () => void;
     children?: React.ReactNode;
   }
   
   export default function NewComponent({ 
     title, 
     onAction,
     children 
   }: NewComponentProps) {
     const [isActive, setIsActive] = useState(false);
     
     const handleClick = () => {
       setIsActive(!isActive);
       onAction?.();
     };
     
     return (
       <div className={`component ${isActive ? 'active' : ''}`}>
         <h2 className="component__title">{title}</h2>
         <button 
           onClick={handleClick}
           className="component__button"
         >
           Toggle
         </button>
         {children && (
           <div className="component__content">
             {children}
           </div>
         )}
       </div>
     );
   }
   ```

### Component Documentation

Document components with JSDoc:

```typescript
/**
 * CourseCard displays course information in a card format
 * 
 * @param title - The course title
 * @param description - Course description (optional)
 * @param imageUrl - Course image URL (optional)
 * @param category - Course category
 * @param duration - Course duration in months
 * @param requirements - Array of course requirements
 * 
 * @example
 * <CourseCard
 *   title="Computer Science BSc"
 *   description="Learn programming and software development"
 *   category="undergraduate"
 *   duration={36}
 *   requirements={['A-levels', 'Mathematics']}
 * />
 */
```

## Testing

### Unit Testing

Use Jest and Testing Library:

```typescript
// src/components/__tests__/CourseCard.test.tsx
import { render, screen } from '@testing-library/react';
import CourseCard from '../CourseCard';

describe('CourseCard', () => {
  const defaultProps = {
    title: 'Test Course',
    category: 'undergraduate' as const,
    duration: 36,
    requirements: ['A-levels']
  };

  test('renders course title', () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  test('displays duration correctly', () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.getByText('36 months')).toBeInTheDocument();
  });

  test('handles missing description', () => {
    render(<CourseCard {...defaultProps} />);
    expect(screen.queryByText('description')).not.toBeInTheDocument();
  });
});
```

### Integration Testing

Test component interactions:

```typescript
// src/__tests__/CourseSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CourseSearch from '../components/CourseSearch';

describe('CourseSearch Integration', () => {
  test('filters courses by search term', async () => {
    render(<CourseSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search courses...');
    fireEvent.change(searchInput, { target: { value: 'computer' } });
    
    await waitFor(() => {
      expect(screen.getByText('Computer Science BSc')).toBeInTheDocument();
      expect(screen.queryByText('Biology BSc')).not.toBeInTheDocument();
    });
  });
});
```

### Accessibility Testing

Test with axe-core:

```typescript
// src/__tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import CourseCard from '../components/CourseCard';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  test('CourseCard has no accessibility violations', async () => {
    const { container } = render(
      <CourseCard
        title="Test Course"
        category="undergraduate"
        duration={36}
        requirements={['A-levels']}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### End-to-End Testing

Use Playwright:

```typescript
// tests/e2e/course-search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Course Search', () => {
  test('user can search for courses', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('[placeholder="Search courses..."]', 'computer');
    await page.press('[placeholder="Search courses..."]', 'Enter');
    
    await expect(page.locator('.course-card')).toContainText('Computer Science');
  });
  
  test('filters work correctly', async ({ page }) => {
    await page.goto('/undergraduate');
    
    await page.click('[data-testid="filter-category"]');
    await page.click('text=Engineering');
    
    await expect(page.locator('.course-card')).toContainText('Engineering');
  });
});
```

## Performance Guidelines

### Image Optimization

1. **Use OptimizedImage component**:
   ```astro
   import OptimizedImage from '@/components/OptimizedImage.astro';
   
   <OptimizedImage
     src="/images/course-hero.jpg"
     alt="Course overview"
     width={800}
     height={400}
     loading="lazy"
     formats={['avif', 'webp', 'jpeg']}
   />
   ```

2. **Lazy loading for below-fold content**:
   ```astro
   <OptimizedImage
     src="/images/course-detail.jpg"
     alt="Course details"
     loading="lazy"
     placeholder="blur"
   />
   ```

### Code Splitting

1. **Dynamic imports for large components**:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   
   function App() {
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <HeavyComponent />
       </Suspense>
     );
   }
   ```

2. **Route-based code splitting**:
   ```typescript
   // Astro automatically splits by page
   // Manual splitting for large dependencies
   const Chart = lazy(() => import('chart.js'));
   ```

### Performance Monitoring

Monitor performance in development:

```typescript
// src/utils/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
}

// Usage
measurePerformance('Course rendering', () => {
  // Component rendering logic
});
```

## Accessibility Guidelines

### ARIA Implementation

1. **Semantic HTML first**:
   ```html
   <nav aria-label="Main navigation">
     <ul>
       <li><a href="/" aria-current="page">Home</a></li>
       <li><a href="/courses">Courses</a></li>
     </ul>
   </nav>
   ```

2. **ARIA labels for dynamic content**:
   ```typescript
   function SearchResults({ results, query }: Props) {
     return (
       <div
         role="region"
         aria-label="Search results"
         aria-live="polite"
         aria-atomic="true"
       >
         <p>Found {results.length} courses for "{query}"</p>
         {results.map(course => (
           <CourseCard key={course.id} {...course} />
         ))}
       </div>
     );
   }
   ```

### Keyboard Navigation

1. **Focus management**:
   ```typescript
   import { useEffect, useRef } from 'react';
   
   function Modal({ isOpen, onClose }: Props) {
     const modalRef = useRef<HTMLDivElement>(null);
     
     useEffect(() => {
       if (isOpen) {
         modalRef.current?.focus();
       }
     }, [isOpen]);
     
     return (
       <div
         ref={modalRef}
         role="dialog"
         aria-modal="true"
         tabIndex={-1}
         onKeyDown={(e) => {
           if (e.key === 'Escape') onClose();
         }}
       >
         {/* Modal content */}
       </div>
     );
   }
   ```

2. **Skip links**:
   ```astro
   <a href="#main-content" class="skip-link">
     Skip to main content
   </a>
   ```

## Git Workflow

### Branch Naming

Use descriptive branch names:

```bash
# Feature branches
git checkout -b feature/course-search
git checkout -b feature/user-authentication

# Bug fix branches
git checkout -b fix/image-loading-issue
git checkout -b fix/accessibility-contrast

# Hotfix branches
git checkout -b hotfix/critical-security-fix
```

### Commit Messages

Use conventional commits:

```bash
# Format: type(scope): description
feat(search): add course filtering functionality
fix(images): resolve loading issues on mobile
docs(readme): update installation instructions
style(css): improve button hover states
refactor(utils): extract common helper functions
test(courses): add unit tests for CourseCard
```

### Pull Request Process

1. **Create descriptive PR title**:
   ```
   feat(search): Add advanced course filtering with categories and duration
   ```

2. **Include PR description**:
   ```markdown
   ## Description
   Adds advanced filtering options to the course search functionality.
   
   ## Changes
   - Added filter dropdowns for category and duration
   - Implemented search term highlighting
   - Added URL parameter support for shareable filters
   
   ## Testing
   - [x] Unit tests pass
   - [x] Accessibility tests pass
   - [x] Manual testing on mobile
   
   ## Screenshots
   [Include before/after screenshots]
   ```

3. **Request appropriate reviewers**:
   - Code review for logic and architecture
   - Design review for UI/UX changes
   - Accessibility review for a11y features

## Debugging

### Browser DevTools

1. **Performance profiling**:
   ```javascript
   // In browser console
   performance.mark('start-search');
   // ... search logic ...
   performance.mark('end-search');
   performance.measure('search-duration', 'start-search', 'end-search');
   ```

2. **Accessibility debugging**:
   ```javascript
   // Use axe-core in console
   axe.run(document, (err, results) => {
     if (err) throw err;
     console.log(results.violations);
   });
   ```

### VS Code Debugging

Configure `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Astro",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/astro",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Debugging Scenarios

1. **Component not rendering**:
   ```typescript
   // Add debug logging
   console.log('Component props:', props);
   console.log('Component state:', state);
   
   // Check component lifecycle
   useEffect(() => {
     console.log('Component mounted');
     return () => console.log('Component unmounted');
   }, []);
   ```

2. **Performance issues**:
   ```typescript
   // Use React DevTools Profiler
   import { Profiler } from 'react';
   
   function onRenderCallback(id, phase, actualDuration) {
     console.log('Render:', id, phase, actualDuration);
   }
   
   <Profiler id="CourseList" onRender={onRenderCallback}>
     <CourseList />
   </Profiler>
   ```

## Build Process

### Development Build

```bash
# Start dev server with hot reloading
npm run dev

# Build with source maps
npm run build:dev
```

### Production Build

```bash
# Clean build
npm run clean
npm run build

# Analyze bundle
npm run analyze
```

### Build Optimization

Configure in `astro.config.mjs`:

```javascript
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
    assetsPrefix: process.env.CDN_URL
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
});
```

## Common Tasks

### Adding a New Page

1. **Create page file**:
   ```bash
   touch src/pages/new-page.astro
   ```

2. **Add page content**:
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   
   const title = 'New Page';
   const description = 'Description of the new page';
   ---
   
   <Layout title={title} description={description}>
     <h1>{title}</h1>
     <p>{description}</p>
   </Layout>
   ```

### Adding a New Component

1. **Create component file**:
   ```bash
   touch src/components/NewComponent.astro
   ```

2. **Add component logic**:
   ```astro
   ---
   interface Props {
     title: string;
   }
   
   const { title } = Astro.props;
   ---
   
   <div class="new-component">
     <h2>{title}</h2>
     <slot />
   </div>
   ```

3. **Add tests**:
   ```bash
   touch src/components/__tests__/NewComponent.test.tsx
   ```

### Adding New Styles

1. **Add to global styles**:
   ```css
   /* src/styles/global.css */
   .new-utility-class {
     /* styles */
   }
   ```

2. **Add component styles**:
   ```astro
   <style>
     .component-specific {
       /* styles */
     }
   </style>
   ```

## Troubleshooting

### Common Development Issues

1. **Module resolution errors**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   
   # Clear TypeScript cache
   rm -rf .astro
   ```

3. **Build failures**:
   ```bash
   # Check build logs
   npm run build 2>&1 | tee build.log
   
   # Clear cache and rebuild
   npm run clean
   npm run build
   ```

4. **Hot reloading issues**:
   ```bash
   # Restart dev server
   npm run dev -- --force
   ```

### Performance Issues

1. **Slow development server**:
   ```bash
   # Reduce file watching
   npm run dev -- --host 0.0.0.0 --port 3000
   ```

2. **Large bundle size**:
   ```bash
   # Analyze bundle
   npm run analyze
   
   # Check dependencies
   npm ls --depth=0
   ```

### Getting Help

1. **Check documentation**:
   - [Astro Documentation](https://docs.astro.build/)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)

2. **Debug in browser**:
   - Use React DevTools
   - Check network requests
   - Analyze performance

3. **Ask for help**:
   - Create GitHub issue
   - Ask in team chat
   - Review with senior developer

---

*For more information, see the main [README.md](../README.md) or other documentation in the `/docs` folder.*