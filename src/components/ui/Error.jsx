import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, title = "Oops!" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 font-body leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-gradient-hover transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={18} />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Error