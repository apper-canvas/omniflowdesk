import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ActivityFeed = ({ activities, contacts, deals }) => {
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }
  
  const getDealTitle = (dealId) => {
    const deal = deals.find(d => d.Id === dealId)
    return deal ? deal.title : 'Unknown Deal'
  }
  
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'call': return 'Phone'
      case 'email': return 'Mail'
      case 'meeting': return 'Calendar'
      case 'note': return 'FileText'
      default: return 'Activity'
    }
  }
  
  const getActivityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'call': return 'bg-blue-500'
      case 'email': return 'bg-green-500'
      case 'meeting': return 'bg-purple-500'
      case 'note': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }
  
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">
        Recent Activities
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sortedActivities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-4 p-4 bg-white rounded-xl hover:shadow-sm transition-all duration-200"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)} shadow-sm`}>
                <ApperIcon 
                  name={getActivityIcon(activity.type)} 
                  size={16} 
                  className="text-white" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 font-body">
                    {activity.subject}
                  </h4>
                  <Badge variant="default" size="sm">
                    {activity.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 font-body mt-1">
                  {getContactName(activity.contactId)}
                  {activity.dealId && (
                    <span className="text-gray-400"> • {getDealTitle(activity.dealId)}</span>
                  )}
                </p>
                
                {activity.notes && (
                  <p className="text-sm text-gray-500 font-body mt-2 line-clamp-2">
                    {activity.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400 font-body">
                    {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                  </span>
                  <span className="text-xs text-gray-400 font-body">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ActivityFeed