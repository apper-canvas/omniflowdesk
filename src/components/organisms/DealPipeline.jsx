import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const DealPipeline = ({ deals, contacts, onDealUpdate, onDealClick }) => {
  const [draggedDeal, setDraggedDeal] = useState(null)
  
  const stages = [
    { id: 'Lead', name: 'Lead', color: 'bg-blue-500' },
    { id: 'Qualified', name: 'Qualified', color: 'bg-yellow-500' },
    { id: 'Proposal', name: 'Proposal', color: 'bg-purple-500' },
    { id: 'Won', name: 'Won', color: 'bg-green-500' },
    { id: 'Lost', name: 'Lost', color: 'bg-red-500' }
  ]
  
  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }
  
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }
  
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onDealUpdate(draggedDeal.Id, { ...draggedDeal, stage: targetStage })
    }
    setDraggedDeal(null)
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id)
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
        
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 h-fit min-h-[500px] shadow-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-semibold text-gray-900 font-display">
                  {stage.name}
                </h3>
                <Badge variant="default" size="sm">
                  {stageDeals.length}
                </Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-body">Total Value</p>
              <p className="text-lg font-bold text-gray-900 font-display">
                {formatCurrency(stageValue)}
              </p>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {stageDeals.map((deal) => (
                  <motion.div
                    key={deal.Id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileDrag={{ scale: 1.05, rotate: 2 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onClick={() => onDealClick(deal)}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-primary-200"
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 font-body text-sm">
                          {deal.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-body">
                          {getContactName(deal.contactId)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600 font-display">
                          {formatCurrency(deal.value)}
                        </span>
                        <span className="text-xs text-gray-500 font-body">
                          {deal.probability}%
                        </span>
                      </div>
                      
                      {deal.expectedClose && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <ApperIcon name="Calendar" size={12} />
                          <span>{format(new Date(deal.expectedClose), 'MMM dd')}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default DealPipeline