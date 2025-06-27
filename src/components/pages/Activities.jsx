import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Header from '@/components/organisms/Header'
import ActivityForm from '@/components/organisms/ActivityForm'
import Modal from '@/components/organisms/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { activityService } from '@/services/api/activityService'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
      setFilteredActivities(activitiesData)
    } catch (err) {
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredActivities(activities)
      return
    }
    
    const filtered = activities.filter(activity => {
      const contact = contacts.find(c => c.Id === activity.contactId)
      const deal = deals.find(d => d.Id === activity.dealId)
      return (
        activity.subject?.toLowerCase().includes(query.toLowerCase()) ||
        activity.notes?.toLowerCase().includes(query.toLowerCase()) ||
        activity.type?.toLowerCase().includes(query.toLowerCase()) ||
        contact?.name?.toLowerCase().includes(query.toLowerCase()) ||
        deal?.title?.toLowerCase().includes(query.toLowerCase())
      )
    })
    setFilteredActivities(filtered)
  }
  
  const handleAddNew = () => {
    setEditingActivity(null)
    setShowForm(true)
  }
  
  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }
  
  const handleDelete = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(activityId)
        const updatedActivities = activities.filter(a => a.Id !== activityId)
        setActivities(updatedActivities)
        setFilteredActivities(updatedActivities.filter(activity =>
          filteredActivities.find(fa => fa.Id === activity.Id)
        ))
        toast.success('Activity deleted successfully!')
      } catch (err) {
        toast.error('Failed to delete activity')
      }
    }
  }
  
  const handleSubmit = async (activityData) => {
    try {
      let updatedActivity
      if (editingActivity) {
        updatedActivity = await activityService.update(editingActivity.Id, activityData)
        const updatedActivities = activities.map(a => 
          a.Id === editingActivity.Id ? updatedActivity : a
        )
        setActivities(updatedActivities)
        setFilteredActivities(updatedActivities)
      } else {
        updatedActivity = await activityService.create(activityData)
        const updatedActivities = [...activities, updatedActivity]
        setActivities(updatedActivities)
        setFilteredActivities(updatedActivities)
      }
      setShowForm(false)
      setEditingActivity(null)
    } catch (err) {
      throw err
    }
  }
  
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }
  
  const getDealTitle = (dealId) => {
    if (!dealId) return null
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
  
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Header
        title="Activities"
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        showAddButton={true}
      />
      
      {filteredActivities.length === 0 && !loading ? (
        <Empty
          title="No activities found"
          message="Keep track of your customer interactions by logging your first activity"
          actionText="Add Activity"
          onAction={handleAddNew}
          icon="Calendar"
        />
      ) : (
        <div className="glass-card rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            {sortedActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className={`p-3 rounded-full ${getActivityColor(activity.type)} shadow-sm`}>
                  <ApperIcon 
                    name={getActivityIcon(activity.type)} 
                    size={20} 
                    className="text-white" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 font-body text-lg">
                        {activity.subject}
                      </h4>
                      <p className="text-gray-600 font-body mt-1">
                        {getContactName(activity.contactId)}
                        {getDealTitle(activity.dealId) && (
                          <span className="text-gray-400"> • {getDealTitle(activity.dealId)}</span>
                        )}
                      </p>
                      
                      {activity.notes && (
                        <p className="text-gray-500 font-body mt-2 leading-relaxed">
                          {activity.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge variant="default" size="sm">
                          {activity.type}
                        </Badge>
                        <span className="text-sm text-gray-400 font-body">
                          {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Edit"
                        onClick={() => handleEdit(activity)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Trash2"
                        onClick={() => handleDelete(activity.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingActivity(null)
        }}
        title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
        size="lg"
      >
        <ActivityForm
          activity={editingActivity}
          contacts={contacts}
          deals={deals}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingActivity(null)
          }}
        />
      </Modal>
    </motion.div>
  )
}

export default Activities