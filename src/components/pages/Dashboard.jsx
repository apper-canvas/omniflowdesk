import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import QuickStats from '@/components/molecules/QuickStats'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { activityService } from '@/services/api/activityService'

const Dashboard = () => {
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  const stats = [
    {
      label: 'Total Contacts',
      value: contacts.length.toLocaleString(),
      icon: 'Users',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: 12
    },
    {
      label: 'Active Deals',
      value: deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length.toLocaleString(),
      icon: 'Target',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: 8
    },
    {
      label: 'Pipeline Value',
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(deals.reduce((sum, deal) => sum + deal.value, 0)),
      icon: 'DollarSign',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: 15
    },
    {
      label: 'Activities Today',
      value: activities.filter(a => {
        const today = new Date()
        const activityDate = new Date(a.date)
        return activityDate.toDateString() === today.toDateString()
      }).length.toLocaleString(),
      icon: 'Calendar',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: -3
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Header title="Dashboard" />
      
      <QuickStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed 
            activities={activities.slice(0, 10)} 
            contacts={contacts}
            deals={deals}
          />
        </div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
              Deal Stages
            </h3>
            <div className="space-y-3">
              {['Lead', 'Qualified', 'Proposal', 'Won', 'Lost'].map((stage) => {
                const stageDeals = deals.filter(d => d.stage === stage)
                const percentage = deals.length > 0 ? (stageDeals.length / deals.length) * 100 : 0
                
                return (
                  <div key={stage} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{stage}</span>
                      <span className="text-gray-500">{stageDeals.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
              Recent Contacts
            </h3>
            <div className="space-y-3">
{contacts.slice(0, 5).map((contact) => (
                <div key={contact.Id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(contact.Name || contact.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
<p className="text-sm font-medium text-gray-900 truncate">
                      {contact.Name || contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard