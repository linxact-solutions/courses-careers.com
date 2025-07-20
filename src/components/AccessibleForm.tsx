import React, { useState, useRef, useEffect } from 'react';
import { formAccessibility } from '../lib/accessibility';
import { useAnnouncements } from './AccessibilityAnnouncer';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
  ariaDescribedBy?: string;
  autoComplete?: string;
}

interface AccessibleFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  title: string;
  description?: string;
  submitText?: string;
  className?: string;
}

export default function AccessibleForm({ 
  fields, 
  onSubmit, 
  title, 
  description, 
  submitText = 'Submit',
  className = '' 
}: AccessibleFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { announceSuccess, announceError } = useAnnouncements();

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
  }, [fields]);

  const validateField = (field: FormField, value: string): string | null => {
    // Required field validation
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    // Email validation
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }

    // Phone validation
    if (field.type === 'tel' && value && !/^[\d\s\-\(\)]+$/.test(value)) {
      return 'Please enter a valid phone number';
    }

    // Custom validation
    if (field.validation) {
      return field.validation(value);
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }

    // Real-time validation for better UX
    if (submitAttempted) {
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        const error = validateField(field, value);
        if (error) {
          setErrors(prev => ({ ...prev, [fieldId]: error }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.id] || '');
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);

    // If there are errors, focus on first error field and announce
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = fields.find(field => newErrors[field.id]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField.id);
        element?.focus();
        announceError(`Form has ${Object.keys(newErrors).length} error${Object.keys(newErrors).length > 1 ? 's' : ''}`);
      }
      return;
    }

    // Submit form
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      announceSuccess('Form submitted successfully');
      
      // Reset form
      setFormData({});
      setErrors({});
      setSubmitAttempted(false);
    } catch (error) {
      announceError('Form submission failed. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const fieldId = field.id;
    const errorId = `${fieldId}-error`;
    const descriptionId = field.ariaDescribedBy;

    const commonProps = {
      id: fieldId,
      name: fieldId,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(fieldId, e.target.value),
      className: `
        block w-full px-3 py-2 border rounded-md shadow-sm text-sm
        ${error 
          ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `,
      placeholder: field.placeholder,
      required: field.required,
      'aria-required': field.required,
      'aria-invalid': !!error,
      'aria-describedby': [error ? errorId : '', descriptionId].filter(Boolean).join(' ') || undefined,
      autoComplete: field.autoComplete,
    };

    let input;
    switch (field.type) {
      case 'textarea':
        input = (
          <textarea
            {...commonProps}
            rows={4}
          />
        );
        break;
      case 'select':
        input = (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      default:
        input = (
          <input
            {...commonProps}
            type={field.type}
          />
        );
    }

    return (
      <div key={fieldId} className="form-control">
        <label 
          htmlFor={fieldId} 
          className={`block text-sm font-medium mb-1 ${field.required ? 'required' : ''}`}
        >
          {field.label}
        </label>
        {descriptionId && (
          <p id={descriptionId} className="text-sm text-gray-600 mb-2">
            {/* Description content would go here */}
          </p>
        )}
        {input}
        {error && (
          <p 
            id={errorId} 
            className="error-message mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`accessible-form ${className}`}
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            btn btn-primary w-full
            bg-primary-600 text-white py-2 px-4 rounded-md
            hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
          aria-describedby={isSubmitting ? 'submit-status' : undefined}
        >
          {isSubmitting ? (
            <>
              <span className="sr-only">Submitting form...</span>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            submitText
          )}
        </button>
        
        {isSubmitting && (
          <p id="submit-status" className="sr-only" aria-live="polite">
            Form is being submitted, please wait...
          </p>
        )}
      </div>
    </form>
  );
}

// Example usage component
export const ContactForm = () => {
  const fields: FormField[] = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
      autoComplete: 'name',
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      autoComplete: 'email',
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter your phone number',
      autoComplete: 'tel',
    },
    {
      id: 'subject',
      label: 'Subject',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Support' },
        { value: 'courses', label: 'Course Information' },
        { value: 'careers', label: 'Career Guidance' },
      ],
    },
    {
      id: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Enter your message here...',
    },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', data);
  };

  return (
    <AccessibleForm
      fields={fields}
      onSubmit={handleSubmit}
      title="Contact Us"
      description="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      submitText="Send Message"
    />
  );
};