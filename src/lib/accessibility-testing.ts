// Accessibility testing utilities for development and QA

export interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  element: Element;
  fix?: string;
}

export class AccessibilityTester {
  private issues: AccessibilityIssue[] = [];

  // Test color contrast
  private testColorContrast(element: Element): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const style = window.getComputedStyle(element);
    const backgroundColor = style.backgroundColor;
    const color = style.color;
    
    // Skip if no background or text color
    if (!backgroundColor || !color || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return issues;
    }

    // This is a simplified test - in reality you'd use a proper color contrast library
    const isTextElement = element.tagName.toLowerCase() === 'p' || 
                         element.tagName.toLowerCase() === 'span' ||
                         element.tagName.toLowerCase() === 'div' ||
                         element.tagName.toLowerCase() === 'a';

    if (isTextElement) {
      // Check if text appears to have sufficient contrast (simplified)
      const textContent = element.textContent?.trim();
      if (textContent && textContent.length > 0) {
        issues.push({
          severity: 'info',
          rule: 'color-contrast',
          message: 'Color contrast should be tested with a proper tool',
          element,
          fix: 'Use a color contrast analyzer to ensure 4.5:1 ratio for normal text, 3:1 for large text'
        });
      }
    }

    return issues;
  }

  // Test focus indicators
  private testFocusIndicators(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const outlineStyle = style.outline;
      const outlineWidth = style.outlineWidth;

      // Check for focus indicators (this is simplified)
      if (outlineStyle === 'none' || outlineWidth === '0px') {
        // Look for alternative focus indicators
        const hasFocusVisible = element.classList.contains('focus-visible') ||
                               element.classList.contains('focus:ring') ||
                               element.classList.contains('focus:outline');

        if (!hasFocusVisible) {
          issues.push({
            severity: 'error',
            rule: 'focus-indicator',
            message: 'Interactive element lacks visible focus indicator',
            element,
            fix: 'Add :focus-visible styles or use focus:ring classes'
          });
        }
      }
    });

    return issues;
  }

  // Test heading hierarchy
  private testHeadingHierarchy(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    let hasH1 = false;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        if (hasH1) {
          issues.push({
            severity: 'error',
            rule: 'heading-hierarchy',
            message: 'Multiple h1 elements found',
            element: heading,
            fix: 'Use only one h1 per page'
          });
        }
        hasH1 = true;
        currentLevel = 1;
      } else {
        if (level > currentLevel + 1) {
          issues.push({
            severity: 'error',
            rule: 'heading-hierarchy',
            message: `Heading level ${level} follows level ${currentLevel}`,
            element: heading,
            fix: 'Don\'t skip heading levels'
          });
        }
        currentLevel = level;
      }
    });

    if (!hasH1) {
      issues.push({
        severity: 'error',
        rule: 'heading-hierarchy',
        message: 'No h1 element found',
        element: document.body,
        fix: 'Add exactly one h1 element per page'
      });
    }

    return issues;
  }

  // Test alt text
  private testAltText(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');

      if (alt === null) {
        issues.push({
          severity: 'error',
          rule: 'alt-text',
          message: 'Image missing alt attribute',
          element: img,
          fix: 'Add alt="" for decorative images or descriptive alt text for informative images'
        });
      } else if (alt && src) {
        // Check for poor alt text
        const poorAltPatterns = [
          /^image/i,
          /^picture/i,
          /^photo/i,
          /^graphic/i,
          /\.jpg$/i,
          /\.png$/i,
          /\.gif$/i,
          /\.svg$/i
        ];

        if (poorAltPatterns.some(pattern => pattern.test(alt))) {
          issues.push({
            severity: 'warning',
            rule: 'alt-text',
            message: 'Alt text may not be descriptive enough',
            element: img,
            fix: 'Use descriptive alt text that conveys the image content and purpose'
          });
        }
      }
    });

    return issues;
  }

  // Test form labels
  private testFormLabels(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const type = input.getAttribute('type');

      // Skip hidden inputs
      if (type === 'hidden') return;

      // Check for labels
      let hasLabel = false;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        hasLabel = !!label;
      }

      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          severity: 'error',
          rule: 'form-labels',
          message: 'Form control lacks accessible label',
          element: input,
          fix: 'Add a <label> element, aria-label, or aria-labelledby attribute'
        });
      }
    });

    return issues;
  }

  // Test ARIA attributes
  private testAriaAttributes(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elementsWithAria = document.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');

    elementsWithAria.forEach(element => {
      const expanded = element.getAttribute('aria-expanded');
      const selected = element.getAttribute('aria-selected');
      const checked = element.getAttribute('aria-checked');

      // Check for invalid boolean values
      if (expanded && !['true', 'false'].includes(expanded)) {
        issues.push({
          severity: 'error',
          rule: 'aria-attributes',
          message: 'aria-expanded must be "true" or "false"',
          element,
          fix: 'Set aria-expanded to "true" or "false"'
        });
      }

      if (selected && !['true', 'false'].includes(selected)) {
        issues.push({
          severity: 'error',
          rule: 'aria-attributes',
          message: 'aria-selected must be "true" or "false"',
          element,
          fix: 'Set aria-selected to "true" or "false"'
        });
      }

      if (checked && !['true', 'false', 'mixed'].includes(checked)) {
        issues.push({
          severity: 'error',
          rule: 'aria-attributes',
          message: 'aria-checked must be "true", "false", or "mixed"',
          element,
          fix: 'Set aria-checked to "true", "false", or "mixed"'
        });
      }
    });

    return issues;
  }

  // Test keyboard navigation
  private testKeyboardNavigation(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');

    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push({
          severity: 'warning',
          rule: 'keyboard-navigation',
          message: 'Positive tabindex creates unpredictable tab order',
          element,
          fix: 'Use tabindex="0" or remove tabindex and rely on source order'
        });
      }

      // Check for missing href on links
      if (element.tagName.toLowerCase() === 'a' && !element.getAttribute('href')) {
        issues.push({
          severity: 'error',
          rule: 'keyboard-navigation',
          message: 'Link without href is not keyboard accessible',
          element,
          fix: 'Add href attribute or use a button element instead'
        });
      }
    });

    return issues;
  }

  // Test semantic HTML
  private testSemanticHTML(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    // Check for main landmark
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      issues.push({
        severity: 'error',
        rule: 'semantic-html',
        message: 'Page lacks main landmark',
        element: document.body,
        fix: 'Add a <main> element or role="main" to contain the main content'
      });
    } else if (mainElements.length > 1) {
      issues.push({
        severity: 'error',
        rule: 'semantic-html',
        message: 'Multiple main landmarks found',
        element: document.body,
        fix: 'Use only one main landmark per page'
      });
    }

    // Check for navigation landmarks
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    if (navElements.length === 0) {
      issues.push({
        severity: 'warning',
        rule: 'semantic-html',
        message: 'Page lacks navigation landmark',
        element: document.body,
        fix: 'Add <nav> elements or role="navigation" to navigation areas'
      });
    }

    return issues;
  }

  // Run all tests
  public runTests(): AccessibilityIssue[] {
    this.issues = [];

    // Run all test methods
    this.issues.push(...this.testHeadingHierarchy());
    this.issues.push(...this.testAltText());
    this.issues.push(...this.testFormLabels());
    this.issues.push(...this.testAriaAttributes());
    this.issues.push(...this.testKeyboardNavigation());
    this.issues.push(...this.testSemanticHTML());
    this.issues.push(...this.testFocusIndicators());

    // Test color contrast for all elements (simplified)
    document.querySelectorAll('*').forEach(element => {
      this.issues.push(...this.testColorContrast(element));
    });

    return this.issues;
  }

  // Generate report
  public generateReport(): string {
    const issues = this.runTests();
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    const info = issues.filter(i => i.severity === 'info');

    let report = `Accessibility Test Report\n`;
    report += `========================\n\n`;
    report += `Total Issues: ${issues.length}\n`;
    report += `Errors: ${errors.length}\n`;
    report += `Warnings: ${warnings.length}\n`;
    report += `Info: ${info.length}\n\n`;

    if (errors.length > 0) {
      report += `ERRORS:\n`;
      errors.forEach((issue, index) => {
        report += `${index + 1}. ${issue.rule}: ${issue.message}\n`;
        if (issue.fix) {
          report += `   Fix: ${issue.fix}\n`;
        }
        report += `   Element: ${issue.element.tagName.toLowerCase()}${issue.element.id ? '#' + issue.element.id : ''}\n\n`;
      });
    }

    if (warnings.length > 0) {
      report += `WARNINGS:\n`;
      warnings.forEach((issue, index) => {
        report += `${index + 1}. ${issue.rule}: ${issue.message}\n`;
        if (issue.fix) {
          report += `   Fix: ${issue.fix}\n`;
        }
        report += `   Element: ${issue.element.tagName.toLowerCase()}${issue.element.id ? '#' + issue.element.id : ''}\n\n`;
      });
    }

    return report;
  }

  // Console-friendly output
  public logReport(): void {
    const issues = this.runTests();
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    console.group('🔍 Accessibility Test Report');
    console.log(`Total Issues: ${issues.length}`);
    console.log(`%cErrors: ${errors.length}`, 'color: red; font-weight: bold');
    console.log(`%cWarnings: ${warnings.length}`, 'color: orange; font-weight: bold');

    if (errors.length > 0) {
      console.group('❌ Errors');
      errors.forEach(issue => {
        console.error(`${issue.rule}: ${issue.message}`, issue.element);
        if (issue.fix) {
          console.log(`💡 Fix: ${issue.fix}`);
        }
      });
      console.groupEnd();
    }

    if (warnings.length > 0) {
      console.group('⚠️ Warnings');
      warnings.forEach(issue => {
        console.warn(`${issue.rule}: ${issue.message}`, issue.element);
        if (issue.fix) {
          console.log(`💡 Fix: ${issue.fix}`);
        }
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

// Utility functions for manual testing
export class AccessibilityTestUtils {
  // Test keyboard navigation manually
  static testKeyboardNavigation(): void {
    console.log('🎹 Testing keyboard navigation...');
    console.log('Press Tab to navigate forward, Shift+Tab to navigate backward');
    console.log('Press Enter or Space to activate buttons and links');
    console.log('Press Escape to close dialogs and menus');
    console.log('Use arrow keys in menus and lists');
    
    // Highlight focusable elements
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      (element as HTMLElement).setAttribute('data-focus-index', (index + 1).toString());
      (element as HTMLElement).style.position = 'relative';
      (element as HTMLElement).style.outline = '2px dashed #3b82f6';
    });
    
    console.log(`Found ${focusableElements.length} focusable elements`);
  }

  // Test screen reader announcements
  static testScreenReaderAnnouncements(): void {
    console.log('🔊 Testing screen reader announcements...');
    
    // Test live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    console.log(`Found ${liveRegions.length} live regions`);
    
    liveRegions.forEach((region, index) => {
      const liveType = region.getAttribute('aria-live');
      console.log(`Live region ${index + 1}: ${liveType}`, region);
    });
    
    // Test labels and descriptions
    const labeledElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    console.log(`Found ${labeledElements.length} elements with ARIA labels or descriptions`);
    
    labeledElements.forEach((element, index) => {
      const label = element.getAttribute('aria-label');
      const labelledBy = element.getAttribute('aria-labelledby');
      const describedBy = element.getAttribute('aria-describedby');
      
      console.log(`Element ${index + 1}:`, {
        element,
        label,
        labelledBy,
        describedBy
      });
    });
  }

  // Test color contrast
  static testColorContrast(): void {
    console.log('🎨 Testing color contrast...');
    console.log('Use a color contrast analyzer tool for accurate results');
    console.log('Required ratios: 4.5:1 for normal text, 3:1 for large text');
    
    // Highlight text elements for manual testing
    const textElements = document.querySelectorAll('p, span, div, a, h1, h2, h3, h4, h5, h6, li, td, th');
    
    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      const fontSize = style.fontSize;
      
      if (element.textContent?.trim()) {
        console.log(`Text element:`, {
          element,
          color,
          backgroundColor,
          fontSize,
          text: element.textContent.trim().substring(0, 50) + '...'
        });
      }
    });
  }
}

// Export main tester instance
export const accessibilityTester = new AccessibilityTester();

// Development helper - run tests in console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testAccessibility = () => accessibilityTester.logReport();
  (window as any).testKeyboard = () => AccessibilityTestUtils.testKeyboardNavigation();
  (window as any).testScreenReader = () => AccessibilityTestUtils.testScreenReaderAnnouncements();
  (window as any).testColorContrast = () => AccessibilityTestUtils.testColorContrast();
}