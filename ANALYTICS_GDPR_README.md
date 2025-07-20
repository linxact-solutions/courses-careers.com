# Analytics and GDPR Implementation Guide

## Overview

This implementation provides a comprehensive GDPR-compliant analytics and third-party integration system for courses-careers.com. All integrations respect user consent and include randomized tracking IDs for enhanced privacy.

## Features

### 🍪 Cookie Management
- GDPR-compliant cookie consent banner
- Granular cookie controls (Necessary, Analytics, Marketing, Functional)
- Cookie preferences persist across sessions
- Easy preference management for users

### 📊 Analytics Integration
- **Google Analytics 4** with anonymized IP and randomized client IDs
- **Matomo** self-hosted analytics with privacy-focused configuration
- Analytics only load after explicit user consent
- Automatic page view tracking for SPA navigation

### 🔗 Third-Party Integrations
- **HubSpot** CRM integration for marketing automation
- **Intercom** live chat widget for customer support
- **Optimizely** A/B testing and experimentation
- All integrations disabled by default until consent is granted

### 🛡️ Privacy Features
- Randomized tracking IDs for all analytics providers
- Automatic cookie cleanup on consent withdrawal
- Clear privacy policy explaining data usage
- Terms of service with GDPR compliance

## File Structure

```
src/
├── components/
│   ├── Analytics.astro          # Analytics integration component
│   ├── CookieConsent.tsx        # React cookie consent component
│   └── CookieManager.astro      # Enhanced cookie manager
├── layouts/
│   ├── BaseLayout.astro         # Base layout with analytics
│   └── Layout.astro             # Updated main layout
├── lib/
│   ├── analytics.ts             # Analytics utilities and initialization
│   └── cookies.ts               # Cookie management utilities
└── pages/
    ├── privacy-policy.astro     # Comprehensive privacy policy
    └── terms-of-service.astro   # Terms of service page
```

## Configuration

### Analytics Configuration

The analytics configuration is centralized in the `Layout.astro` file:

```typescript
<Analytics 
    ga4={{ measurementId: "G-XXXXXXXXXX" }}
    matomo={{ url: "https://analytics.courses-careers.com/", siteId: "1" }}
    hubspot={{ portalId: "XXXXXXXX" }}
    intercom={{ appId: "xxxxxxxx" }}
    optimizely={{ projectId: "XXXXXXXXX" }}
/>
```

### Environment Variables

Create a `.env` file with your actual tracking IDs:

```env
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_MATOMO_URL=https://analytics.courses-careers.com/
PUBLIC_MATOMO_SITE_ID=1
PUBLIC_HUBSPOT_PORTAL_ID=XXXXXXXX
PUBLIC_INTERCOM_APP_ID=xxxxxxxx
PUBLIC_OPTIMIZELY_PROJECT_ID=XXXXXXXXX
```

## Cookie Categories

### Necessary Cookies
- **Always enabled** - cannot be disabled
- Essential for website functionality
- Session management, security, accessibility

### Analytics Cookies
- Google Analytics 4 tracking
- Matomo analytics tracking
- User behavior analysis
- Performance monitoring

### Marketing Cookies
- HubSpot CRM tracking
- Optimizely A/B testing
- Advertising and remarketing
- Conversion tracking

### Functional Cookies
- Intercom live chat
- User preferences
- Enhanced user experience features

## Privacy Features

### Randomized Tracking IDs
All analytics providers use randomized tracking IDs to enhance privacy:

```typescript
function randomizeTrackingId(baseId: string): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseId}-${random}`;
}
```

### Data Minimization
- Only collect data necessary for functionality
- Anonymize IP addresses
- Automatic data deletion after 26 months
- No persistent user identification without consent

### Cookie Cleanup
When users withdraw consent, the system automatically:
- Deletes all tracking cookies
- Clears localStorage data
- Removes tracking scripts
- Reloads the page to ensure clean state

## Usage

### Basic Implementation

The analytics system is automatically initialized in the layout:

```typescript
// Initialize analytics with user preferences
document.addEventListener('DOMContentLoaded', async () => {
  const { initializeAnalytics } = await import('../lib/analytics');
  initializeAnalytics(config);
});
```

### Custom Event Tracking

Track custom events throughout your application:

```typescript
import { getAnalytics } from '../lib/analytics';

const analytics = getAnalytics();
if (analytics) {
  analytics.trackEvent('Course', 'View', 'Computer Science', 1);
}
```

### Page View Tracking

Page views are automatically tracked, but you can manually track them:

```typescript
const analytics = getAnalytics();
if (analytics) {
  analytics.trackPageView('/custom-path', 'Custom Page Title');
}
```

## GDPR Compliance

### User Rights
The implementation supports all GDPR user rights:

- **Right to Access**: Users can view their data through privacy policy
- **Right to Rectification**: Contact forms allow data correction
- **Right to Erasure**: Cookie consent can be withdrawn
- **Right to Restrict Processing**: Granular cookie controls
- **Right to Data Portability**: Analytics data export available
- **Right to Object**: Users can opt out of all non-essential cookies

### Legal Basis
- **Legitimate Interest**: Analytics for website improvement
- **Consent**: Marketing and functional cookies
- **Contract**: Necessary cookies for service provision

### Data Processing
- Clear explanation of data processing in privacy policy
- Explicit consent for all non-essential cookies
- Easy withdrawal of consent
- Regular review and cleanup of stored data

## Accessibility

### Keyboard Navigation
- Full keyboard navigation support
- Focus management in cookie banner
- ARIA labels and roles
- Screen reader compatibility

### User Experience
- Clear, non-technical language
- Progressive disclosure of cookie details
- Mobile-responsive design
- High contrast support

## Security

### Secure Cookies
All cookies are set with security flags:
- `SameSite=Strict`
- `Secure` flag for HTTPS
- `HttpOnly` where appropriate

### Script Loading
- Async script loading to prevent blocking
- CSP-compatible implementation
- No inline scripts in HTML

## Monitoring

### Consent Tracking
The system tracks consent actions for analytics:

```typescript
// Track when users accept/reject cookies
analytics.trackEvent('Cookie Consent', 'accept_all');
analytics.trackEvent('Cookie Consent', 'reject_all');
```

### Performance Monitoring
- Lazy loading of analytics scripts
- Conditional loading based on consent
- Minimal impact on page load times

## Maintenance

### Regular Updates
- Review and update privacy policy quarterly
- Update cookie descriptions when new services are added
- Test consent flow regularly across devices
- Monitor for new privacy regulations

### Analytics Review
- Monthly review of analytics data
- Quarterly assessment of data retention
- Annual privacy impact assessment
- Regular security audits

## Testing

### Cookie Consent Testing
1. Clear all cookies and localStorage
2. Visit the site and verify cookie banner appears
3. Test each consent option (Accept All, Reject All, Manage Preferences)
4. Verify appropriate scripts load/don't load
5. Test preference persistence across sessions

### Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test with various privacy settings
- Verify accessibility with screen readers

## Troubleshooting

### Common Issues

#### Cookie Banner Not Showing
- Check if consent is already stored
- Clear localStorage and cookies
- Verify import paths in layout

#### Analytics Not Loading
- Check user consent status
- Verify tracking IDs are correct
- Check browser console for errors

#### Scripts Loading Without Consent
- Verify conditional loading logic
- Check cookie preference storage
- Review script initialization order

### Debug Mode
Enable debug logging by adding to localStorage:

```javascript
localStorage.setItem('debug-analytics', 'true');
```

## Compliance Checklist

- [ ] Cookie banner displays before any tracking
- [ ] Clear explanation of cookie categories
- [ ] Easy consent withdrawal mechanism
- [ ] Privacy policy updated with analytics details
- [ ] Terms of service include cookie usage
- [ ] Analytics configured with privacy settings
- [ ] Regular data retention review process
- [ ] User rights contact information provided
- [ ] Accessibility testing completed
- [ ] Cross-browser testing completed

## Support

For questions or issues with the analytics implementation:
- Technical: technical@courses-careers.com
- Privacy: privacy@courses-careers.com
- Legal: legal@courses-careers.com

---

*This implementation ensures full GDPR compliance while providing valuable analytics insights and enhanced user experience through third-party integrations.*