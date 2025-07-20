import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  hasConsented, 
  getPreferences, 
  savePreferences, 
  defaultPreferences,
  type CookiePreferences 
} from '../lib/cookies';

interface CookieConsentProps {
  className?: string;
}

export default function CookieConsent({ className = '' }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already consented
    if (!hasConsented()) {
      setShowBanner(true);
    } else {
      setPreferences(getPreferences());
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    savePreferences(defaultPreferences);
    setShowBanner(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200 ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 id="cookie-consent-title" className="text-lg font-semibold text-gray-900 mb-2">
                  Cookie Preferences
                </h3>
                <p id="cookie-consent-description" className="text-sm text-gray-600">
                  We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
                
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-3"
                    id="cookie-preferences-details"
                  >
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Necessary</h4>
                        <p className="text-xs text-gray-500">Essential for the website to function properly</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        aria-label="Necessary cookies (required)"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Analytics</h4>
                        <p className="text-xs text-gray-500">Help us understand how visitors interact with our website</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 cursor-pointer"
                        aria-label="Analytics cookies"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Marketing</h4>
                        <p className="text-xs text-gray-500">Used to track visitors across websites for marketing</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 cursor-pointer"
                        aria-label="Marketing cookies"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Functional</h4>
                        <p className="text-xs text-gray-500">Enable enhanced functionality like live chat</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => togglePreference('functional')}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 cursor-pointer"
                        aria-label="Functional cookies"
                      />
                    </div>
                  </motion.div>
                )}
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  aria-expanded={showDetails}
                  aria-controls="cookie-preferences-details"
                >
                  {showDetails ? 'Hide Details' : 'Manage Preferences'}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Reject All
                </button>
                
                {showDetails ? (
                  <button
                    onClick={handleAcceptSelected}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Accept Selected
                  </button>
                ) : (
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Accept All
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-500">
              <a href="/privacy-policy" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}