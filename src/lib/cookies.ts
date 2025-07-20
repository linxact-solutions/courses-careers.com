// Cookie management utilities
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export const defaultPreferences: CookiePreferences = {
  necessary: true, // Always enabled
  analytics: false,
  marketing: false,
  functional: false,
};

export function setCookie(name: string, value: string, days: number = 365): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function savePreferences(preferences: CookiePreferences): void {
  setCookie(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  setCookie(COOKIE_CONSENT_KEY, 'true');
  
  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent('cookiePreferencesChanged', { 
    detail: preferences 
  }));
}

export function getPreferences(): CookiePreferences {
  const saved = getCookie(COOKIE_PREFERENCES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
}

export function hasConsented(): boolean {
  return getCookie(COOKIE_CONSENT_KEY) === 'true';
}

export function revokeConsent(): void {
  deleteCookie(COOKIE_CONSENT_KEY);
  deleteCookie(COOKIE_PREFERENCES_KEY);
  
  // Clear all analytics and third-party cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Delete cookies that look like analytics/tracking cookies
    if (name.startsWith('_ga') || 
        name.startsWith('_gid') || 
        name.startsWith('_mtm') ||
        name.startsWith('intercom') ||
        name.startsWith('hubspot')) {
      deleteCookie(name);
    }
  });
  
  // Reload page to remove all tracking scripts
  window.location.reload();
}