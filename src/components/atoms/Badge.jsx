import { motion } from 'framer-motion'

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white',
    success: 'bg-gradient-to-r from-accent-500 to-green-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    error: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  )
}

export default Badge