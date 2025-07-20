import React, { useEffect, useRef, useState } from 'react';

export interface AnnouncementMessage {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
}

interface AccessibilityAnnouncerProps {
  className?: string;
}

// Global queue for announcements
let announcementQueue: AnnouncementMessage[] = [];
let subscribers: Set<(messages: AnnouncementMessage[]) => void> = new Set();

// Global function to announce messages
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement: AnnouncementMessage = {
    id: `announcement-${Date.now()}-${Math.random()}`,
    message,
    priority,
    timestamp: Date.now(),
  };
  
  announcementQueue.push(announcement);
  
  // Notify all subscribers
  subscribers.forEach(callback => callback([...announcementQueue]));
  
  // Clean up old announcements after 5 seconds
  setTimeout(() => {
    announcementQueue = announcementQueue.filter(a => a.id !== announcement.id);
    subscribers.forEach(callback => callback([...announcementQueue]));
  }, 5000);
};

// Enhanced announce function with different types
export const announceSuccess = (message: string) => announce(`Success: ${message}`, 'polite');
export const announceError = (message: string) => announce(`Error: ${message}`, 'assertive');
export const announceWarning = (message: string) => announce(`Warning: ${message}`, 'assertive');
export const announceInfo = (message: string) => announce(`Info: ${message}`, 'polite');
export const announceNavigation = (message: string) => announce(`Navigation: ${message}`, 'polite');

export default function AccessibilityAnnouncer({ className = '' }: AccessibilityAnnouncerProps) {
  const [messages, setMessages] = useState<AnnouncementMessage[]>([]);
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to global announcement queue
    const handleMessages = (newMessages: AnnouncementMessage[]) => {
      setMessages(newMessages);
    };

    subscribers.add(handleMessages);

    // Initialize with current queue
    handleMessages([...announcementQueue]);

    return () => {
      subscribers.delete(handleMessages);
    };
  }, []);

  // Separate messages by priority
  const politeMessages = messages.filter(msg => msg.priority === 'polite');
  const assertiveMessages = messages.filter(msg => msg.priority === 'assertive');

  return (
    <div className={`accessibility-announcer ${className}`}>
      {/* Polite announcements - don't interrupt user */}
      <div
        ref={politeRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {politeMessages.map(msg => (
          <div key={msg.id}>{msg.message}</div>
        ))}
      </div>

      {/* Assertive announcements - interrupt user immediately */}
      <div
        ref={assertiveRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      >
        {assertiveMessages.map(msg => (
          <div key={msg.id}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
}

// Hook for using announcements in React components
export const useAnnouncements = () => {
  return {
    announce,
    announceSuccess,
    announceError,
    announceWarning,
    announceInfo,
    announceNavigation,
  };
};

// Utility for announcing route changes
export const announceRouteChange = (pageName: string) => {
  announceNavigation(`Navigated to ${pageName}`);
};

// Utility for announcing form changes
export const announceFormChange = (fieldName: string, value: string) => {
  announce(`${fieldName} changed to ${value}`, 'polite');
};

// Utility for announcing loading states
export const announceLoading = (message: string = 'Loading...') => {
  announce(message, 'polite');
};

export const announceLoadingComplete = (message: string = 'Content loaded') => {
  announce(message, 'polite');
};