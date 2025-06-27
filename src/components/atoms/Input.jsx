import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-body">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl border-2 px-4 py-3 font-body text-sm transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            glass-card
          `}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 font-body flex items-center space-x-1">
          <ApperIcon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input