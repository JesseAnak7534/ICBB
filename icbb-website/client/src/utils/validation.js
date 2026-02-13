// Form validation utilities

export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  number: (value) => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },

  positiveNumber: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Please enter a positive number';
    }
    return null;
  }
};

// Validate a single field with multiple validators
export const validateField = (value, validatorFns) => {
  for (const validator of validatorFns) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const error = validateField(formData[field], rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export default validators;
