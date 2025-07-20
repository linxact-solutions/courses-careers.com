// Accessibility utilities for WCAG 2.2 AA compliance

export interface FocusableElement extends HTMLElement {
  focus(options?: FocusOptions): void;
}

// Focus management utilities
export class FocusManager {
  private previousFocus: Element | null = null;
  private focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
    'audio[controls]',
    'video[controls]',
    'details > summary',
  ].join(', ');

  getFocusableElements(container: Element = document.body): FocusableElement[] {
    const elements = Array.from(container.querySelectorAll(this.focusableSelectors));
    return elements.filter(element => 
      this.isVisible(element) && !this.isInert(element)
    ) as FocusableElement[];
  }

  private isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  private isInert(element: Element): boolean {
    return element.hasAttribute('inert') || 
           element.closest('[inert]') !== null;
  }

  trapFocus(container: Element): () => void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey as EventListener);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey as EventListener);
    };
  }

  saveFocus(): void {
    this.previousFocus = document.activeElement;
  }

  restoreFocus(): void {
    if (this.previousFocus && this.previousFocus instanceof HTMLElement) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
  }
}

// Keyboard navigation utilities
export class KeyboardNavigator {
  static readonly KEYS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    HOME: 'Home',
    END: 'End',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
  } as const;

  static handleMenuNavigation(
    event: KeyboardEvent,
    items: FocusableElement[],
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical';
      loop?: boolean;
      onSelect?: (index: number) => void;
      onEscape?: () => void;
    } = {}
  ): number {
    const { orientation = 'vertical', loop = true, onSelect, onEscape } = options;
    
    let nextIndex = currentIndex;

    switch (event.key) {
      case this.KEYS.ARROW_UP:
      case this.KEYS.ARROW_LEFT:
        if (orientation === 'vertical' && event.key === this.KEYS.ARROW_UP ||
            orientation === 'horizontal' && event.key === this.KEYS.ARROW_LEFT) {
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : 
                     loop ? items.length - 1 : currentIndex;
        }
        break;
      
      case this.KEYS.ARROW_DOWN:
      case this.KEYS.ARROW_RIGHT:
        if (orientation === 'vertical' && event.key === this.KEYS.ARROW_DOWN ||
            orientation === 'horizontal' && event.key === this.KEYS.ARROW_RIGHT) {
          event.preventDefault();
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 
                     loop ? 0 : currentIndex;
        }
        break;

      case this.KEYS.HOME:
        event.preventDefault();
        nextIndex = 0;
        break;

      case this.KEYS.END:
        event.preventDefault();
        nextIndex = items.length - 1;
        break;

      case this.KEYS.ENTER:
      case this.KEYS.SPACE:
        event.preventDefault();
        onSelect?.(currentIndex);
        break;

      case this.KEYS.ESCAPE:
        event.preventDefault();
        onEscape?.();
        break;
    }

    if (nextIndex !== currentIndex && items[nextIndex]) {
      items[nextIndex].focus();
    }

    return nextIndex;
  }
}

// Color contrast utilities
export class ColorContrast {
  private static rgbToLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const lum1 = this.rgbToLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.rgbToLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  static meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA', isLargeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    
    if (level === 'AA') {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    } else {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
  }
}

// Screen reader utilities
export class ScreenReaderUtils {
  static setAriaLabel(element: Element, label: string): void {
    element.setAttribute('aria-label', label);
  }

  static setAriaLabelledBy(element: Element, labelId: string): void {
    element.setAttribute('aria-labelledby', labelId);
  }

  static setAriaDescribedBy(element: Element, descriptionId: string): void {
    element.setAttribute('aria-describedby', descriptionId);
  }

  static setAriaExpanded(element: Element, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  static setAriaSelected(element: Element, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  static setAriaChecked(element: Element, checked: boolean | 'mixed'): void {
    element.setAttribute('aria-checked', checked.toString());
  }

  static setAriaHidden(element: Element, hidden: boolean): void {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  static setRole(element: Element, role: string): void {
    element.setAttribute('role', role);
  }

  static announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Reduced motion utilities
export class MotionUtils {
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static respectReducedMotion(normalAnimation: () => void, reducedAnimation?: () => void): void {
    if (this.prefersReducedMotion()) {
      reducedAnimation?.();
    } else {
      normalAnimation();
    }
  }
}

// Form accessibility utilities
export class FormAccessibility {
  static associateLabel(input: HTMLInputElement, label: HTMLLabelElement): void {
    const id = input.id || `input-${Date.now()}`;
    input.id = id;
    label.setAttribute('for', id);
  }

  static setRequired(input: HTMLInputElement, required: boolean): void {
    input.required = required;
    input.setAttribute('aria-required', required.toString());
  }

  static setInvalid(input: HTMLInputElement, invalid: boolean, errorMessage?: string): void {
    input.setAttribute('aria-invalid', invalid.toString());
    
    if (invalid && errorMessage) {
      const errorId = `${input.id}-error`;
      let errorElement = document.getElementById(errorId);
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        input.parentNode?.appendChild(errorElement);
      }
      
      errorElement.textContent = errorMessage;
      input.setAttribute('aria-describedby', errorId);
    } else {
      const errorId = `${input.id}-error`;
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.remove();
        input.removeAttribute('aria-describedby');
      }
    }
  }

  static createFieldset(legend: string, fields: HTMLElement[]): HTMLFieldSetElement {
    const fieldset = document.createElement('fieldset');
    const legendElement = document.createElement('legend');
    legendElement.textContent = legend;
    fieldset.appendChild(legendElement);
    
    fields.forEach(field => fieldset.appendChild(field));
    
    return fieldset;
  }
}

// Heading hierarchy utilities
export class HeadingHierarchy {
  static validateHeadingOrder(container: Element = document.body): boolean {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let currentLevel = 0;
    let hasH1 = false;
    
    for (const heading of headings) {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        if (hasH1) {
          console.warn('Multiple h1 elements found. Each page should have only one h1.');
        }
        hasH1 = true;
        currentLevel = 1;
      } else {
        if (level > currentLevel + 1) {
          console.warn(`Heading level ${level} found after level ${currentLevel}. Heading levels should not skip.`);
          return false;
        }
        currentLevel = level;
      }
    }
    
    if (!hasH1) {
      console.warn('No h1 element found. Each page should have exactly one h1.');
      return false;
    }
    
    return true;
  }

  static generateHeadingOutline(container: Element = document.body): Array<{level: number; text: string; element: Element}> {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return headings.map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent?.trim() || '',
      element: heading
    }));
  }
}

// Create instances for easy access
export const focusManager = new FocusManager();
export const keyboardNavigator = KeyboardNavigator;
export const colorContrast = ColorContrast;
export const screenReaderUtils = ScreenReaderUtils;
export const motionUtils = MotionUtils;
export const formAccessibility = FormAccessibility;
export const headingHierarchy = HeadingHierarchy;

// Export default utilities object
export default {
  focusManager,
  keyboardNavigator,
  colorContrast,
  screenReaderUtils,
  motionUtils,
  formAccessibility,
  headingHierarchy,
};