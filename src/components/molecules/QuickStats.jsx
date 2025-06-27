import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
              <ApperIcon name={stat.icon} size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 font-body">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 font-display">
                {stat.value}
              </p>
              {stat.change && (
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.change > 0 ? 'text-accent-600' : 'text-red-600'
                }`}>
                  <ApperIcon 
                    name={stat.change > 0 ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                  />
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default QuickStats