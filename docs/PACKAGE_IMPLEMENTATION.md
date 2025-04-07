# Package Implementation Guide

This document provides examples and guidelines for using the newly added packages in the Yemen Property Rental Platform.

## Table of Contents

- [Testing Tools](#testing-tools)
  - [Testing Library](#testing-library)
  - [Cypress](#cypress)
- [Form Validation with Zod](#form-validation-with-zod)
- [Error Handling](#error-handling)
  - [Error Boundary](#error-boundary)
  - [Axios Interceptor](#axios-interceptor)
- [Performance Monitoring](#performance-monitoring)
  - [Web Vitals](#web-vitals)
  - [Bundle Analyzer](#bundle-analyzer)
- [Security Enhancements](#security-enhancements)
  - [Content Security Policy](#content-security-policy)
  - [Input Sanitization](#input-sanitization)
- [Animations with Framer Motion](#animations-with-framer-motion)
- [Internationalization with react-i18next](#internationalization)

## Testing Tools

### Testing Library

Use React Testing Library to test React components in isolation. Here's how to test one of your components:

```tsx
// Example: Testing the EmptyState component
import { render, screen } from '@testing-library/react';
import EmptyState from '@/app/components/EmptyState';

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState />);
    
    // Check if default title and subtitle are rendered
    expect(screen.getByText('لا يوجد تطابق تام')).toBeInTheDocument();
    expect(screen.getByText('حاول تغيير أو إزالة بعض المرشحات الخاصة بك')).toBeInTheDocument();
  });
  
  it('renders with custom title and subtitle', () => {
    render(<EmptyState title="عنوان مخصص" subtitle="نص فرعي مخصص" />);
    
    expect(screen.getByText('عنوان مخصص')).toBeInTheDocument();
    expect(screen.getByText('نص فرعي مخصص')).toBeInTheDocument();
  });
  
  it('shows reset button when requested', () => {
    render(<EmptyState showReset />);
    
    expect(screen.getByText('إزالة جميع المرشحات')).toBeInTheDocument();
  });
});
```

### Cypress

Cypress is already configured for end-to-end testing. You can run the tests using:

```bash
npm run test:e2e
```

Example test files are located in the `cypress/e2e` directory. To add data-testid attributes to your components for better testing, update your components like:

```tsx
// Example: Adding data-testid to the Navbar component
<div data-testid="user-menu" onClick={toggleOpen}>
  {/* User menu content */}
</div>
```

## Form Validation with Zod

Zod provides type-safe schema validation. Use it with your forms:

```tsx
// Example: Using Zod with RegisterModal
import { registerSchema } from '@/app/libs/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const RegisterModal = () => {
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });
  
  // Rest of your component code
};
```

## Error Handling

### Error Boundary

The `ErrorBoundary` component is set up to catch runtime errors. Wrap critical components:

```tsx
// Example: Using ErrorBoundary in a specific page
import ErrorBoundary from '@/app/components/ErrorBoundary';

export default function ListingPage() {
  return (
    <ErrorBoundary>
      <ListingClient listing={listing} reservations={reservations} />
    </ErrorBoundary>
  );
}
```

### Axios Interceptor

For API calls, replace direct axios usage with our custom interceptor:

```tsx
// Before
import axios from 'axios';

const onSubmit = async (data) => {
  try {
    await axios.post('/api/register', data);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// After
import api from '@/app/api/interceptor';

const onSubmit = async (data) => {
  try {
    await api.post('/register', data);
    // Only handle success case - errors are managed globally
  } catch (error) {
    // Optional specific error handling if needed
  }
};
```

## Performance Monitoring

### Web Vitals

Web Vitals are automatically collected. To view the metrics in development:

1. Open browser console
2. Look for "Web Vitals: [metric name]" logs

To send these metrics to a real analytics service, edit `app/libs/webVitals.ts` and uncomment the analytics code.

### Bundle Analyzer

To analyze your bundle size:

```bash
npm run analyze
```

This will generate visual bundle reports in the `.next/analyze` folder.

## Security Enhancements

### Content Security Policy

Content Security Policy is configured in `next.config.js`. To modify it, update the headers section.

### Input Sanitization

Use DOMPurify for any user-generated HTML content:

```tsx
import DOMPurify from 'dompurify';

// When displaying user-generated content that might contain HTML
const sanitizedHTML = DOMPurify.sanitize(userGeneratedContent);

return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
```

## Animations with Framer Motion

Add animations to your components:

```tsx
import { motion } from 'framer-motion';

// Example: Animated listing card
const ListingCard = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card content */}
    </motion.div>
  );
};
```

## Internationalization

Add internationalization with react-i18next:

```tsx
// Configure in a provider file
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// Initialize i18n
i18n.init({
  resources: {
    ar: {
      translation: {
        // Arabic translations
        welcomeMessage: 'مرحبًا بك في منصة تأجير العقارات',
        // More translations...
      }
    },
    en: {
      translation: {
        // English translations
        welcomeMessage: 'Welcome to the Property Rental Platform',
        // More translations...
      }
    }
  },
  lng: 'ar', // Default language
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

// Usage in components
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('welcomeMessage')}</h1>;
};
``` 