import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { focusManager, keyboardNavigator } from '../lib/accessibility';
import { useAnnouncements } from './AccessibilityAnnouncer';

interface NavigationItem {
  href: string;
  label: string;
  current?: boolean;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export default function MobileNavigation({ items, className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { announce } = useAnnouncements();

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = focusManager.getFocusableElements(menuRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const focusableElements = focusManager.getFocusableElements(menuRef.current!);
      
      const newIndex = keyboardNavigator.handleMenuNavigation(
        event,
        focusableElements,
        focusedIndex,
        {
          orientation: 'vertical',
          loop: true,
          onEscape: () => {
            setIsOpen(false);
            buttonRef.current?.focus();
            announce('Navigation menu closed');
          }
        }
      );

      setFocusedIndex(newIndex);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, announce]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        announce('Navigation menu closed');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, announce]);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      announce('Navigation menu opened');
      focusManager.saveFocus();
    } else {
      announce('Navigation menu closed');
      focusManager.restoreFocus();
    }
  };

  const handleItemClick = (item: NavigationItem) => {
    setIsOpen(false);
    announce(`Navigating to ${item.label}`);
  };

  return (
    <div className={`mobile-navigation ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-haspopup="true"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">
                    Navigation
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Close navigation menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <nav className="p-4" aria-label="Mobile navigation">
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => handleItemClick(item)}
                        className={`
                          block px-3 py-2 rounded-md text-base font-medium transition-colors
                          ${item.current 
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }
                          focus:outline-none focus:ring-2 focus:ring-primary-500
                        `}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for using mobile navigation
export const useMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};