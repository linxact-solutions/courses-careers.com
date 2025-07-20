# Content Management Guide

This guide covers content management, schemas, and content creation workflows for the Courses & Careers website.

## Table of Contents

- [Content Architecture](#content-architecture)
- [Content Types](#content-types)
- [Content Schemas](#content-schemas)
- [Content Creation Workflow](#content-creation-workflow)
- [SEO Guidelines](#seo-guidelines)
- [Image Management](#image-management)
- [Content Organization](#content-organization)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Optimization](#performance-optimization)
- [Content Migration](#content-migration)
- [Quality Assurance](#quality-assurance)
- [Maintenance](#maintenance)

## Content Architecture

### Site Structure

The website follows a hierarchical content structure:

```
/
├── Further Education/
│   ├── Subject Guide/
│   │   ├── Fashion Design Courses
│   │   ├── GCSE Results
│   │   └── ...
│   └── College Profiles/
│       ├── College A
│       ├── College B
│       └── ...
├── Undergraduate/
│   ├── Subject Guide/
│   │   ├── Accountancy Courses
│   │   ├── Business Courses
│   │   ├── Engineering Courses
│   │   └── ...
│   └── University Profiles/
│       ├── University A
│       ├── University B
│       └── ...
├── Postgraduate/
│   ├── Subject Guide/
│   │   ├── Computer Science
│   │   ├── Engineering
│   │   ├── MBA Courses
│   │   └── ...
│   ├── University Profiles/
│   │   ├── University A
│   │   ├── University B
│   │   └── ...
│   └── MBA Courses/
│       └── ...
├── Student Advice/
│   ├── Student Finance/
│   │   ├── Accommodation Guide
│   │   ├── Bursaries and Scholarships
│   │   ├── Student Debt
│   │   └── ...
│   └── UK City Guide/
│       └── ...
├── Jobs & Careers/
│   ├── Career Sectors/
│   │   ├── Legal Careers
│   │   ├── Technology Careers
│   │   └── ...
│   └── Job Search/
│       └── ...
└── Online Magazines/
    ├── Courses and Careers/
    └── Postgraduate Courses and Careers/
```

### Content Hierarchy

1. **Section Level**: Main categories (Further Education, Undergraduate, etc.)
2. **Category Level**: Subject guides, profiles, advice topics
3. **Article Level**: Individual content pieces
4. **Component Level**: Reusable content blocks

## Content Types

### 1. Course Information

**Purpose**: Detailed information about educational programs

**Schema**:
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'further' | 'undergraduate' | 'postgraduate';
  category: string;
  subcategory?: string;
  duration: {
    value: number;
    unit: 'months' | 'years';
  };
  requirements: {
    academic: string[];
    english?: string;
    other?: string[];
  };
  institution: {
    name: string;
    location: string;
    website?: string;
  };
  fees: {
    domestic?: number;
    international?: number;
    currency: string;
  };
  modules: Module[];
  careerProspects: string[];
  applicationDeadlines: {
    domestic?: string;
    international?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  images: {
    hero?: string;
    gallery?: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  published: boolean;
  lastUpdated: string;
  author: string;
}

interface Module {
  name: string;
  description: string;
  credits?: number;
  mandatory: boolean;
}
```

**Example**:
```json
{
  "id": "computer-science-bsc",
  "title": "Computer Science BSc",
  "description": "Learn programming, algorithms, and software development in this comprehensive undergraduate program.",
  "level": "undergraduate",
  "category": "Computing",
  "subcategory": "Computer Science",
  "duration": {
    "value": 3,
    "unit": "years"
  },
  "requirements": {
    "academic": [
      "A-levels: ABB including Mathematics",
      "GCSE: Grade 4 in English and Mathematics"
    ],
    "english": "IELTS 6.5 overall with 6.0 in each component",
    "other": [
      "Personal statement",
      "Reference letter"
    ]
  },
  "institution": {
    "name": "University of Technology",
    "location": "London, UK",
    "website": "https://www.unitech.ac.uk"
  },
  "fees": {
    "domestic": 9250,
    "international": 25000,
    "currency": "GBP"
  },
  "modules": [
    {
      "name": "Programming Fundamentals",
      "description": "Introduction to programming concepts and languages",
      "credits": 20,
      "mandatory": true
    },
    {
      "name": "Data Structures",
      "description": "Fundamental data structures and algorithms",
      "credits": 20,
      "mandatory": true
    }
  ],
  "careerProspects": [
    "Software Developer",
    "Systems Analyst",
    "Data Scientist",
    "Cybersecurity Specialist"
  ],
  "applicationDeadlines": {
    "domestic": "2024-01-15",
    "international": "2024-01-01"
  },
  "seo": {
    "title": "Computer Science BSc | University of Technology",
    "description": "Study Computer Science at University of Technology. Learn programming, algorithms, and software development. Apply now for September 2024 entry.",
    "keywords": ["computer science", "programming", "software development", "university", "degree"],
    "canonicalUrl": "/undergraduate/computer-science-bsc"
  },
  "published": true,
  "lastUpdated": "2024-01-15T10:00:00Z",
  "author": "admissions@unitech.ac.uk"
}
```

### 2. Institution Profiles

**Purpose**: Comprehensive information about educational institutions

**Schema**:
```typescript
interface Institution {
  id: string;
  name: string;
  shortName?: string;
  type: 'university' | 'college' | 'institute';
  location: {
    city: string;
    country: string;
    region?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  established: number;
  description: string;
  highlights: string[];
  rankings: {
    overall?: number;
    subjects?: {
      subject: string;
      ranking: number;
      source: string;
    }[];
  };
  facilities: {
    library: boolean;
    laboratories: boolean;
    sports: boolean;
    accommodation: boolean;
    other: string[];
  };
  studentInfo: {
    totalStudents?: number;
    internationalStudents?: number;
    employmentRate?: number;
    studentSatisfaction?: number;
  };
  courses: string[]; // Course IDs
  contact: {
    website: string;
    email: string;
    phone: string;
    admissions: {
      email: string;
      phone: string;
    };
  };
  images: {
    logo: string;
    hero: string;
    gallery: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  published: boolean;
  lastUpdated: string;
  author: string;
}
```

### 3. Articles and Guides

**Purpose**: Educational content, advice, and information articles

**Schema**:
```typescript
interface Article {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string; // Markdown content
  category: string;
  subcategory?: string;
  type: 'guide' | 'news' | 'advice' | 'feature';
  tags: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
    email?: string;
  };
  publishedDate: string;
  lastUpdated: string;
  readingTime: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  relatedArticles: string[]; // Article IDs
  relatedCourses: string[]; // Course IDs
  images: {
    hero: string;
    alt: string;
    gallery?: {
      url: string;
      alt: string;
      caption?: string;
    }[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    structuredData?: object;
  };
  published: boolean;
  featured: boolean;
  archived: boolean;
}
```

### 4. Career Information

**Purpose**: Career guidance and job sector information

**Schema**:
```typescript
interface Career {
  id: string;
  title: string;
  description: string;
  sector: string;
  averageSalary: {
    entry: number;
    experienced: number;
    currency: string;
  };
  skills: {
    required: string[];
    preferred: string[];
  };
  qualifications: {
    minimum: string[];
    preferred: string[];
  };
  workEnvironment: string[];
  careerProgression: {
    level: string;
    title: string;
    description: string;
    timeframe: string;
  }[];
  relatedCourses: string[]; // Course IDs
  employers: {
    name: string;
    website?: string;
    size: 'small' | 'medium' | 'large';
  }[];
  jobOutlook: {
    growth: 'declining' | 'stable' | 'growing' | 'fast-growing';
    description: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  published: boolean;
  lastUpdated: string;
  author: string;
}
```

## Content Creation Workflow

### 1. Content Planning

**Steps**:
1. **Identify Content Needs**
   - Analyze user queries and search terms
   - Review competitor content
   - Identify content gaps
   - Prioritize based on user value

2. **Content Strategy**
   - Define target audience
   - Set content objectives
   - Plan content calendar
   - Assign responsibilities

3. **Research and Preparation**
   - Gather accurate information
   - Verify facts and figures
   - Collect relevant images
   - Prepare content outline

### 2. Content Creation

**Process**:
1. **Writing**
   - Follow content guidelines
   - Use clear, accessible language
   - Include relevant keywords naturally
   - Structure content logically

2. **Review and Editing**
   - Fact-check all information
   - Proofread for grammar and spelling
   - Ensure accessibility compliance
   - Verify links and references

3. **SEO Optimization**
   - Optimize title and description
   - Add relevant keywords
   - Create structured data
   - Optimize images and alt text

### 3. Content Publication

**Checklist**:
- [ ] Content follows style guide
- [ ] All links are working
- [ ] Images are optimized
- [ ] SEO metadata is complete
- [ ] Accessibility requirements met
- [ ] Content is fact-checked
- [ ] Legal compliance verified
- [ ] Preview in staging environment
- [ ] Final approval obtained

## SEO Guidelines

### Title Optimization

**Format**: `Primary Keyword | Secondary Keyword | Brand`

**Examples**:
- `Computer Science Courses | University Guide | Courses & Careers`
- `Student Finance Guide | Loans and Grants | Courses & Careers`
- `MBA Programs | Business School Rankings | Courses & Careers`

**Guidelines**:
- Keep titles under 60 characters
- Include primary keyword near the beginning
- Make titles descriptive and compelling
- Avoid keyword stuffing
- Use pipes (|) as separators

### Meta Descriptions

**Format**: Action-oriented description with keywords

**Examples**:
- `Find the best computer science degree programs at top UK universities. Compare courses, entry requirements, and career prospects. Apply now for 2024 entry.`
- `Complete guide to student finance in the UK. Learn about loans, grants, and scholarships. Calculate your funding and apply for support.`

**Guidelines**:
- Keep descriptions between 150-160 characters
- Include primary keyword
- Write for users, not search engines
- Include call-to-action
- Make each description unique

### Keyword Strategy

**Primary Keywords**:
- Course names (e.g., "computer science degree")
- Institution names (e.g., "University of Oxford")
- General terms (e.g., "student finance", "career advice")

**Long-tail Keywords**:
- Specific queries (e.g., "best computer science universities UK")
- Question-based (e.g., "how to apply for student loan")
- Location-specific (e.g., "universities in London")

**Keyword Placement**:
- Page title
- Meta description
- H1 heading
- First paragraph
- Subheadings (H2, H3)
- Image alt text
- URL slug

### Structured Data

**Course Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Computer Science BSc",
  "description": "Comprehensive undergraduate program in computer science",
  "provider": {
    "@type": "Organization",
    "name": "University of Technology",
    "url": "https://www.unitech.ac.uk"
  },
  "offers": {
    "@type": "Offer",
    "price": "9250",
    "priceCurrency": "GBP",
    "category": "Tuition Fee"
  },
  "courseMode": "full-time",
  "duration": "P3Y",
  "startDate": "2024-09-01",
  "applicationDeadline": "2024-01-15"
}
```

**Article Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to Student Finance",
  "description": "Everything you need to know about funding your education",
  "author": {
    "@type": "Person",
    "name": "Education Expert"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Courses & Careers",
    "logo": {
      "@type": "ImageObject",
      "url": "https://courses-careers.com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-15",
  "image": "https://courses-careers.com/images/student-finance.jpg"
}
```

## Image Management

### Image Requirements

**Technical Specifications**:
- **Format**: WebP, AVIF, or JPEG
- **Resolution**: High-resolution source (2x minimum)
- **Optimization**: Compressed without quality loss
- **Responsive**: Multiple sizes for different devices
- **Alt Text**: Descriptive alternative text

**Image Types**:
1. **Hero Images**: 1920x1080 (16:9 ratio)
2. **Card Images**: 800x600 (4:3 ratio)
3. **Profile Images**: 400x400 (1:1 ratio)
4. **Gallery Images**: Various sizes maintained ratio
5. **Icons**: SVG format preferred

### Image Optimization

**Process**:
1. **Source Images**
   - Use high-quality originals
   - Maintain aspect ratios
   - Avoid overly compressed images

2. **Optimization**
   - Compress images appropriately
   - Generate multiple formats (WebP, AVIF)
   - Create responsive sizes
   - Add descriptive alt text

3. **Implementation**
   - Use OptimizedImage component
   - Set appropriate loading behavior
   - Include proper alt text
   - Define image dimensions

**Example**:
```astro
<OptimizedImage
  src="/images/computer-science-hero.jpg"
  alt="Students working on computers in a modern computer lab"
  width={1920}
  height={1080}
  loading="eager"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  formats={['avif', 'webp', 'jpeg']}
  quality={85}
/>
```

### Image Naming Convention

**Format**: `category-subject-type-description.ext`

**Examples**:
- `university-oxford-campus-library.jpg`
- `course-computer-science-lab.jpg`
- `student-finance-calculator.jpg`
- `career-engineering-workplace.jpg`

## Content Organization

### File Structure

```
src/content/
├── courses/
│   ├── further-education/
│   │   ├── fashion-design.md
│   │   └── ...
│   ├── undergraduate/
│   │   ├── computer-science.md
│   │   ├── engineering.md
│   │   └── ...
│   └── postgraduate/
│       ├── mba.md
│       └── ...
├── institutions/
│   ├── universities/
│   │   ├── oxford.md
│   │   ├── cambridge.md
│   │   └── ...
│   └── colleges/
│       └── ...
├── articles/
│   ├── student-advice/
│   │   ├── finance-guide.md
│   │   └── ...
│   ├── career-advice/
│   │   ├── job-search.md
│   │   └── ...
│   └── news/
│       └── ...
└── careers/
    ├── technology/
    │   ├── software-developer.md
    │   └── ...
    └── ...
```

### Content Collections

Use Astro's content collections for type-safe content management:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const coursesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(['further', 'undergraduate', 'postgraduate']),
    category: z.string(),
    duration: z.object({
      value: z.number(),
      unit: z.enum(['months', 'years'])
    }),
    requirements: z.object({
      academic: z.array(z.string()),
      english: z.string().optional(),
      other: z.array(z.string()).optional()
    }),
    institution: z.object({
      name: z.string(),
      location: z.string(),
      website: z.string().optional()
    }),
    fees: z.object({
      domestic: z.number().optional(),
      international: z.number().optional(),
      currency: z.string()
    }),
    careerProspects: z.array(z.string()),
    published: z.boolean().default(false),
    lastUpdated: z.string(),
    author: z.string()
  })
});

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    type: z.enum(['guide', 'news', 'advice', 'feature']),
    tags: z.array(z.string()),
    author: z.object({
      name: z.string(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
      email: z.string().optional()
    }),
    publishedDate: z.string(),
    lastUpdated: z.string(),
    readingTime: z.number(),
    published: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  courses: coursesCollection,
  articles: articlesCollection
};
```

## Accessibility Requirements

### Content Accessibility

**Writing Guidelines**:
- Use clear, simple language
- Avoid jargon and technical terms
- Write in active voice
- Use short sentences and paragraphs
- Include summary information

**Structure Requirements**:
- Use proper heading hierarchy (H1, H2, H3)
- Include descriptive link text
- Add alt text for all images
- Use lists for structured information
- Provide content summaries

### Content Formatting

**Headings**:
```markdown
# Page Title (H1)
## Section Title (H2)
### Subsection Title (H3)
#### Detail Title (H4)
```

**Lists**:
```markdown
## Entry Requirements
- A-levels: ABB including Mathematics
- GCSE: Grade 4 in English and Mathematics
- Personal statement required
- One reference letter

## Course Modules
1. Programming Fundamentals
2. Data Structures and Algorithms
3. Database Systems
4. Software Engineering
```

**Links**:
```markdown
<!-- Good - descriptive -->
[Apply for Computer Science BSc at University of Technology](https://example.com/apply)

<!-- Avoid - non-descriptive -->
[Click here](https://example.com/apply)
```

### Media Accessibility

**Images**:
- Provide descriptive alt text
- Include captions for complex images
- Use appropriate image formats
- Ensure adequate color contrast

**Videos**:
- Provide captions and transcripts
- Include audio descriptions
- Ensure video controls are accessible
- Provide alternative formats

## Performance Optimization

### Content Optimization

**Text Content**:
- Optimize content length
- Use semantic HTML
- Minimize inline styles
- Compress content where possible

**Images**:
- Use modern image formats
- Implement responsive images
- Add lazy loading
- Optimize image sizes

**Code Examples**:
```astro
<!-- Optimized image with lazy loading -->
<OptimizedImage
  src="/images/course-overview.jpg"
  alt="Course overview diagram showing program structure"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
  formats={['avif', 'webp', 'jpeg']}
/>

<!-- Optimized content structure -->
<article class="course-article">
  <header>
    <h1>Computer Science BSc</h1>
    <p class="lead">Comprehensive undergraduate program</p>
  </header>
  
  <section class="course-overview">
    <h2>Course Overview</h2>
    <!-- Content -->
  </section>
  
  <section class="entry-requirements">
    <h2>Entry Requirements</h2>
    <!-- Content -->
  </section>
</article>
```

### Loading Optimization

**Critical Content**:
- Prioritize above-the-fold content
- Inline critical CSS
- Optimize font loading
- Minimize render-blocking resources

**Non-Critical Content**:
- Lazy load images and videos
- Defer non-essential scripts
- Use progressive enhancement
- Implement content placeholders

## Content Migration

### Legacy Content

The site includes legacy content from the original Joomla implementation:

**Migration Process**:
1. **Content Audit**
   - Identify valuable content
   - Check for broken links
   - Verify information accuracy
   - Assess content quality

2. **Content Transformation**
   - Convert HTML to Markdown
   - Update image references
   - Fix broken links
   - Optimize for new structure

3. **Quality Assurance**
   - Test all migrated content
   - Verify SEO elements
   - Check accessibility
   - Test on multiple devices

### Migration Tools

**Automated Migration**:
```javascript
// scripts/migrate-content.js
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

async function migrateContent() {
  const htmlFiles = await glob('legacy/**/*.html');
  
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf-8');
    
    // Convert HTML to Markdown
    const markdown = await unified()
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkStringify)
      .process(html);
    
    // Extract metadata
    const metadata = extractMetadata(html);
    
    // Create new file
    const newFile = file.replace('legacy/', 'src/content/').replace('.html', '.md');
    const frontmatter = createFrontmatter(metadata);
    
    await writeFile(newFile, frontmatter + markdown.toString());
  }
}

function extractMetadata(html) {
  // Extract title, description, etc.
  return {
    title: '',
    description: '',
    category: '',
    publishedDate: '',
    lastUpdated: new Date().toISOString()
  };
}

function createFrontmatter(metadata) {
  return `---
title: "${metadata.title}"
description: "${metadata.description}"
category: "${metadata.category}"
publishedDate: "${metadata.publishedDate}"
lastUpdated: "${metadata.lastUpdated}"
published: true
---

`;
}
```

## Quality Assurance

### Content Review Checklist

**Before Publication**:
- [ ] Content is accurate and up-to-date
- [ ] All links are working
- [ ] Images are optimized and have alt text
- [ ] SEO metadata is complete
- [ ] Content follows style guide
- [ ] Accessibility requirements met
- [ ] No spelling or grammar errors
- [ ] Legal compliance verified
- [ ] Contact information is current

**Post-Publication**:
- [ ] Content displays correctly
- [ ] All functionality works
- [ ] Performance is acceptable
- [ ] SEO elements are correct
- [ ] Analytics tracking active
- [ ] Mobile display verified
- [ ] Cross-browser compatibility

### Content Validation

**Automated Checks**:
```javascript
// scripts/validate-content.js
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkLint from 'remark-lint';

async function validateContent() {
  const markdownFiles = await glob('src/content/**/*.md');
  const errors = [];
  
  for (const file of markdownFiles) {
    const content = await readFile(file, 'utf-8');
    
    // Parse frontmatter
    const { frontmatter, content: body } = parseFrontmatter(content);
    
    // Validate required fields
    if (!frontmatter.title) {
      errors.push(`${file}: Missing title`);
    }
    
    if (!frontmatter.description) {
      errors.push(`${file}: Missing description`);
    }
    
    // Validate content structure
    const result = await unified()
      .use(remarkParse)
      .use(remarkLint)
      .process(body);
    
    if (result.messages.length > 0) {
      errors.push(`${file}: ${result.messages.map(m => m.message).join(', ')}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('Content validation errors:');
    errors.forEach(error => console.error(error));
    process.exit(1);
  }
  
  console.log('All content validated successfully');
}
```

## Maintenance

### Regular Tasks

**Weekly**:
- Review and update featured content
- Check for broken links
- Monitor content performance
- Update news and announcements

**Monthly**:
- Update course information
- Review SEO performance
- Check content accuracy
- Update contact information

**Quarterly**:
- Content audit and cleanup
- Update fees and requirements
- Review content strategy
- Performance optimization

**Annually**:
- Comprehensive content review
- Update all course information
- Review and update policies
- Major content restructuring

### Content Monitoring

**Analytics Tracking**:
- Page views and engagement
- Search query performance
- User behavior patterns
- Content conversion rates

**SEO Monitoring**:
- Search ranking positions
- Organic traffic trends
- Click-through rates
- Featured snippet opportunities

**Quality Monitoring**:
- Content freshness
- Link health
- Image optimization
- Mobile performance

### Content Updates

**Process**:
1. **Identify Updates Needed**
   - Review analytics data
   - Check for outdated information
   - Monitor industry changes
   - Respond to user feedback

2. **Plan Updates**
   - Prioritize by impact
   - Schedule content updates
   - Assign responsibilities
   - Set deadlines

3. **Implement Updates**
   - Make necessary changes
   - Test thoroughly
   - Update metadata
   - Verify SEO impact

4. **Monitor Results**
   - Track performance changes
   - Measure user engagement
   - Assess SEO impact
   - Gather user feedback

---

*For more information, see the main [README.md](../README.md) or other documentation in the `/docs` folder.*