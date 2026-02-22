import * as Yup from 'yup';

/**
* Builds a Yup validation schema from field configurations
* @param {Array} fields - Array of field configuration objects
* @returns {Yup.ObjectSchema} - Yup validation schema
*/

/**
 * Extract all fields from drawerConfigs.tabs into one flat array
 * @param {Object} drawerConfigs - The drawerConfigs object
 * @returns {Array} - Flattened field array
 */
export const extractDrawerFields = (drawerConfigs) => {
  if (!drawerConfigs?.tabs) return [];
  return drawerConfigs.tabs.flatMap(tab => tab.items || []);
};

export const buildValidationSchema = (fields) => {
  const shape = fields.reduce((acc, field) => {
    const key = field._key || field.fieldName || field.name;
    const label = field.label || key;
    let validator;

    // Determine validator based on field type
    switch (field.type) {
      case 'email':
        validator = Yup.string().email(`${label} is invalid`);
        break;

      case 'number':
        validator = Yup.number().typeError(`${label} must be a number`);
        break;

      // case 'objectDate':
      // case 'date':
      //   validator = Yup
      //     .mixed()
      //     .nullable()
      //     .test('is-valid-date', `${label} is required`, function (value) {
      //       // If field is not required and value is null/undefined, it's valid
      //       if (!field.required && !value) return true;

      //       // If field is required or has a value, check structure
      //       if (!value) return false;

      //       // Check if it has the expected structure with iso property
      //       if (value && value.iso) return true;

      //       return false;
      //     });
      //   break;

      case 'objectDate':
      case 'date':
        validator = Yup
          .string() // it's now a string (ISO) instead of an object
          .nullable()
          .test('is-valid-date', `${label} is required`, function (value) {
            const { path, createError } = this;

            // If field is not required and value is null/undefined, it's valid
            if (!field.isRequired && !value) return true;

            // If field is required or has a value, check if it's a valid ISO date
            if (!value) {
              return createError({ path, message: `${label} is required` });
            }

            // Check if the value is a valid ISO date
            const isValidDate = !isNaN(Date.parse(value));
            if (!isValidDate) {
              return createError({ path, message: `${label} must be a valid date` });
            }

            return true;
          });
        break;

      case 'time':
        validator = Yup.date().nullable().typeError(`${label} must be a valid time`);
        break;

      case 'url':
        validator = Yup.string().url(`${label} must be a valid URL`);
        break;

      case 'autocomplete':
      case 'select':
        validator = Yup.mixed().nullable().typeError(`${label} must be selected`);
        break;

      case 'phone':
        validator = Yup.string().matches(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
          `${label} must be a valid phone number`
        );
        break;

      case 'boolean':
      case 'checkbox':
        validator = Yup.boolean();
        break;

      case 'array':
        validator = Yup.array();
        break;

      default:
        validator = Yup.string();
    }

    // Apply required validation
    if (field.isRequired) {
      if (field.type === 'autocomplete' || field.type === 'select') {
        validator = validator.required(`${label} is required`);
      } else if (field.type === 'objectDate' || field.type === 'date' || field.type === 'time') {
        validator = validator.required(`${label} is required`);
      } else if (field.type === 'boolean' || field.type === 'checkbox') {
        validator = validator.oneOf([true], `${label} must be accepted`);
      } else {
        validator = validator.required(`${label} is required`);
      }
    }

    // Apply min/max validations
    if (field.type === 'number') {
      if (field.min !== undefined) {
        validator = validator.min(field.min, `${label} must be at least ${field.min}`);
      }
      if (field.max !== undefined) {
        validator = validator.max(field.max, `${label} must be at most ${field.max}`);
      }
    }

    // Apply string length validations
    if (field.type === 'string' || !field.type || field.type === 'text' || field.type === 'email') {
      if (field.minLength !== undefined) {
        validator = validator.min(field.minLength, `${label} must be at least ${field.minLength} characters`);
      }
      if (field.maxLength !== undefined) {
        validator = validator.max(field.maxLength, `${label} must be at most ${field.maxLength} characters`);
      }
    }

    // Apply custom validation
    if (field.validation && typeof field.validation === 'function') {
      validator = validator.test('custom', `${label} is invalid`, field.validation);
    }

    // Apply custom pattern (regex)
    if (field.pattern && field.type === 'string') {
      validator = validator.matches(
        new RegExp(field.pattern),
        field.patternMessage || `${label} format is invalid`
      );
    }

    acc[key] = validator;
    return acc;
  }, {});

  return Yup.object().shape(shape);
};

/**
* Generates initial values for Formik from field configurations
* @param {Array} fields - Array of field configuration objects
* @returns {Object} - Initial values object
*/
export const generateInitialValues = (fields) => {
  return fields.reduce((acc, field) => {
    const key = field._key || field.fieldName || field.name;

    // Handle date/time fields
    if (field.type === 'objectDate' || field.type === 'time' || field.type === 'date') {
      acc[key] = field.defaultValue || null;
    }
    // Handle boolean fields
    else if (field.type === 'boolean' || field.type === 'checkbox') {
      acc[key] = field.defaultValue ?? false;
    }
    // Handle array fields
    else if (field.type === 'array') {
      acc[key] = field.defaultValue ?? [];
    }
    // Handle number fields
    else if (field.type === 'number') {
      acc[key] = field.defaultValue ?? '';
    }
    // Default to empty string
    else {
      acc[key] = field.defaultValue ?? '';
    }

    return acc;
  }, {});
};

/**
* Process fields to ensure they have required keys
* @param {Array} fields - Array of field configuration objects
* @returns {Array} - Processed fields with _key property
*/
export const processFields = (fields) => {
  return fields.map((f, idx) => ({
    ...f,
    _key: f.fieldName || f.name || `field_${idx}`
  }));
};


