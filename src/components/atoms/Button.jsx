import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:bg-gradient-hover shadow-lg hover:shadow-xl focus:ring-primary-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-gray-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg hover:shadow-xl focus:ring-accent-500",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24
  }
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={iconSize[size]} className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
        </>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button