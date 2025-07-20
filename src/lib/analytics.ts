// Analytics utilities with randomized tracking IDs
import { getPreferences, type CookiePreferences } from './cookies';

// Randomize tracking IDs for privacy
function randomizeTrackingId(baseId: string): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseId}-${random}`;
}

export interface AnalyticsConfig {
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

class Analytics {
  private config: AnalyticsConfig;
  private initialized = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = config;
  }

  initialize(): void {
    if (this.initialized) return;
    
    const preferences = getPreferences();
    
    // Initialize based on consent
    if (preferences.analytics) {
      this.initializeAnalytics();
    }
    
    if (preferences.marketing) {
      this.initializeMarketing();
    }
    
    if (preferences.functional) {
      this.initializeFunctional();
    }
    
    this.initialized = true;
    
    // Listen for preference changes
    window.addEventListener('cookiePreferencesChanged', ((event: CustomEvent<CookiePreferences>) => {
      this.handlePreferencesChange(event.detail);
    }) as EventListener);
  }

  private initializeAnalytics(): void {
    // Google Analytics 4
    if (this.config.ga4) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4.measurementId}`;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]): void {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', this.config.ga4.measurementId, {
        anonymize_ip: true,
        client_id: randomizeTrackingId('ga'),
        cookie_flags: 'SameSite=Strict;Secure',
      });
    }
    
    // Matomo
    if (this.config.matomo) {
      const _paq = window._paq = window._paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      _paq.push(['setTrackerUrl', `${this.config.matomo.url}matomo.php`]);
      _paq.push(['setSiteId', this.config.matomo.siteId]);
      _paq.push(['setUserId', randomizeTrackingId('mtm')]);
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `${this.config.matomo.url}matomo.js`;
      document.head.appendChild(script);
    }
  }

  private initializeMarketing(): void {
    // HubSpot
    if (this.config.hubspot) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//js.hs-scripts.com/${this.config.hubspot.portalId}.js`;
      script.id = 'hs-script-loader';
      document.head.appendChild(script);
    }

    // Optimizely
    if (this.config.optimizely) {
      const script = document.createElement('script');
      script.src = `https://cdn.optimizely.com/js/${this.config.optimizely.projectId}.js`;
      document.head.appendChild(script);
    }
  }

  private initializeFunctional(): void {
    // Intercom
    if (this.config.intercom) {
      window.intercomSettings = {
        app_id: this.config.intercom.appId,
        user_id: randomizeTrackingId('icm'),
      };
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://widget.intercom.io/widget/${this.config.intercom.appId}`;
      document.head.appendChild(script);
    }
  }

  private handlePreferencesChange(preferences: CookiePreferences): void {
    // Reload page to apply new preferences
    // This ensures all scripts are properly loaded/unloaded
    window.location.reload();
  }

  // Track custom events
  trackEvent(category: string, action: string, label?: string, value?: number): void {
    const preferences = getPreferences();
    if (!preferences.analytics) return;
    
    // Google Analytics
    if (this.config.ga4 && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
    
    // Matomo
    if (this.config.matomo && window._paq) {
      window._paq.push(['trackEvent', category, action, label, value]);
    }
  }

  // Track page views
  trackPageView(path?: string, title?: string): void {
    const preferences = getPreferences();
    if (!preferences.analytics) return;
    
    // Google Analytics
    if (this.config.ga4 && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path || window.location.pathname,
        page_title: title || document.title,
      });
    }
    
    // Matomo
    if (this.config.matomo && window._paq) {
      if (path) window._paq.push(['setCustomUrl', path]);
      if (title) window._paq.push(['setDocumentTitle', title]);
      window._paq.push(['trackPageView']);
    }
  }
}

// Global instance
let analyticsInstance: Analytics | null = null;

export function initializeAnalytics(config: AnalyticsConfig): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config);
    if (typeof window !== 'undefined') {
      analyticsInstance.initialize();
    }
  }
  return analyticsInstance;
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}

// Type declarations for global objects
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    _paq: any[];
    intercomSettings: any;
  }
}