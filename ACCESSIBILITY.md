# Accessibility Implementation Guide

This document outlines the WCAG 2.2 AA accessibility compliance implementation for the Courses & Careers website.

## Overview

The website has been designed and developed to meet Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards, ensuring it is accessible to users with disabilities and provides an inclusive experience for all visitors.

## Components and Files

### Core Accessibility Components

1. **SkipLink.astro** (`/src/components/SkipLink.astro`)
   - Provides skip navigation functionality
   - Allows keyboard users to bypass navigation and jump to main content
   - Includes proper focus management and reduced motion support

2. **AccessibilityAnnouncer.tsx** (`/src/components/AccessibilityAnnouncer.tsx`)
   - Manages live region announcements for screen readers
   - Provides utilities for different types of announcements (success, error, navigation, etc.)
   - Supports both polite and assertive announcement priorities

3. **Accessibility Utilities** (`/src/lib/accessibility.ts`)
   - Comprehensive set of accessibility utilities
   - Focus management, keyboard navigation, color contrast checking
   - Form accessibility, heading hierarchy validation
   - Screen reader utilities and motion preferences

4. **Accessibility Styles** (`/src/styles/accessibility.css`)
   - CSS styles specifically for accessibility features
   - Focus indicators, reduced motion support, high contrast mode
   - Screen reader utilities, accessible form controls
   - Print styles and forced colors mode support

### Enhanced Components

5. **AccessibleForm.tsx** (`/src/components/AccessibleForm.tsx`)
   - Fully accessible form component with proper labels and validation
   - ARIA attributes, error handling, and keyboard navigation
   - Real-time validation and screen reader announcements

6. **MobileNavigation.tsx** (`/src/components/MobileNavigation.tsx`)
   - Accessible mobile navigation with keyboard support
   - Focus management and ARIA attributes
   - Proper dialog implementation

7. **Accessibility Testing** (`/src/lib/accessibility-testing.ts`)
   - Development tools for testing accessibility compliance
   - Automated checks for common accessibility issues
   - Console utilities for manual testing

### Updated Components

8. **BaseLayout.astro** - Enhanced with:
   - Skip link integration
   - Accessibility CSS inclusion
   - Proper navigation landmarks
   - ARIA labels and semantic HTML

9. **CourseCard.astro** - Improved with:
   - Descriptive ARIA labels
   - Proper focus indicators
   - Reduced motion support
   - Screen reader friendly content

10. **CookieConsent.tsx** - Enhanced with:
    - Dialog role and ARIA attributes
    - Keyboard navigation support
    - Proper focus management
    - Accessible form controls

## WCAG 2.2 AA Compliance Features

### 1. Perceivable

- **Alt text**: All images have descriptive alt text
- **Color contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Responsive design**: Works on all screen sizes and orientations
- **Text scaling**: Supports up to 200% zoom without loss of functionality

### 2. Operable

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Focus indicators**: Visible focus indicators on all interactive elements
- **No seizures**: No content that flashes more than 3 times per second
- **Skip links**: Allow users to bypass navigation
- **Timeouts**: No automatic timeouts without user control

### 3. Understandable

- **Clear language**: Simple, clear language throughout
- **Consistent navigation**: Navigation is consistent across pages
- **Form labels**: All form inputs have proper labels
- **Error messages**: Clear, helpful error messages
- **Instructions**: Clear instructions for complex interactions

### 4. Robust

- **Semantic HTML**: Proper use of HTML5 semantic elements
- **ARIA attributes**: Proper use of ARIA labels, roles, and properties
- **Valid markup**: HTML validates according to specifications
- **Assistive technology**: Compatible with screen readers and other AT

## Implementation Details

### Focus Management

```typescript
import { focusManager } from '../lib/accessibility';

// Trap focus in modal
const cleanup = focusManager.trapFocus(modalElement);

// Save and restore focus
focusManager.saveFocus();
focusManager.restoreFocus();
```

### Keyboard Navigation

```typescript
import { keyboardNavigator } from '../lib/accessibility';

// Handle menu navigation
keyboardNavigator.handleMenuNavigation(event, menuItems, currentIndex, {
  orientation: 'vertical',
  loop: true,
  onEscape: closeMenu
});
```

### Screen Reader Announcements

```typescript
import { useAnnouncements } from '../components/AccessibilityAnnouncer';

const { announceSuccess, announceError, announceNavigation } = useAnnouncements();

// Announce success
announceSuccess('Form submitted successfully');

// Announce navigation
announceNavigation('Navigated to courses page');
```

### Color Contrast Testing

```typescript
import { colorContrast } from '../lib/accessibility';

// Check contrast ratio
const ratio = colorContrast.getContrastRatio('#000000', '#FFFFFF');
const meetsAA = colorContrast.meetsWCAG('#000000', '#FFFFFF', 'AA');
```

## Testing

### Automated Testing

```bash
# Run accessibility tests in development
npm run dev

# In browser console:
testAccessibility()  # Run full accessibility audit
testKeyboard()      # Test keyboard navigation
testScreenReader()  # Test screen reader features
testColorContrast() # Test color contrast
```

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Ensure visible focus indicators
   - Test Enter/Space activation
   - Test Escape key behavior

2. **Screen Reader Testing**
   - Test with NVDA, JAWS, or VoiceOver
   - Verify proper announcements
   - Check heading navigation
   - Test landmark navigation

3. **Color Contrast**
   - Use WebAIM Contrast Checker
   - Test in high contrast mode
   - Verify text remains readable at 200% zoom

4. **Mobile Testing**
   - Test touch targets (minimum 44px)
   - Verify responsive behavior
   - Test with mobile screen readers

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Assistive Technology Support

- JAWS (Windows)
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- Dragon NaturallySpeaking
- Switch navigation devices
- Voice control software

## Accessibility Statement

The website includes a comprehensive accessibility statement at `/accessibility-statement` that details:
- Our commitment to accessibility
- Compliance standards
- Available features
- Contact information for feedback
- Known limitations and ongoing improvements

## Development Guidelines

### New Components

When creating new components:

1. Use semantic HTML elements
2. Include proper ARIA attributes
3. Ensure keyboard navigation
4. Test with screen readers
5. Verify color contrast
6. Support reduced motion
7. Include focus indicators

### Testing Checklist

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] ARIA attributes are correct
- [ ] Screen reader announcements work
- [ ] Color contrast meets AA standards
- [ ] Works at 200% zoom
- [ ] Supports reduced motion
- [ ] Form labels are associated
- [ ] Error messages are clear
- [ ] Heading hierarchy is logical

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM](https://webaim.org/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Maintenance

Regular accessibility maintenance includes:

1. **Monthly audits** using automated tools
2. **Quarterly manual testing** with screen readers
3. **Annual training** for development team
4. **Continuous monitoring** of user feedback
5. **Regular updates** to accessibility statement

## Contact

For accessibility feedback or questions:
- Email: accessibility@courses-careers.com
- Phone: +1 (555) 123-4567

We aim to respond to accessibility feedback within 2 business days.