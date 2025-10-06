import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseInputClasses = `
    form-input w-full transition-all duration-200
    ${error && touched ? 'form-input error' : ''}
    ${success && !error ? 'border-green-300' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseInputClasses} resize-vertical min-h-[80px]`}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />
        )}

        {/* Icône pour les mots de passe */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}

        {/* Icônes de validation */}
        {(error || success) && touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Messages d'erreur ou de succès */}
      {error && touched && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {success && !error && touched && (
        <p className="text-sm text-green-600 flex items-center">
          <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {success}
        </p>
      )}
    </div>
  );
};

export default FormField;