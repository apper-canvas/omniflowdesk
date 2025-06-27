import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const ActivityForm = ({ activity, contacts, deals, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'Call',
    contactId: '',
    dealId: '',
    subject: '',
    notes: '',
    date: new Date().toISOString().slice(0, 16)
  })
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || 'Call',
        contactId: activity.contactId?.toString() || '',
        dealId: activity.dealId?.toString() || '',
        subject: activity.subject || '',
        notes: activity.notes || '',
        date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
      })
    }
  }, [activity])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const activityData = {
        ...formData,
        Id: activity?.Id,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        date: new Date(formData.date).toISOString()
      }
      
      await onSubmit(activityData)
      toast.success(activity ? 'Activity updated successfully!' : 'Activity created successfully!')
    } catch (error) {
      toast.error('Failed to save activity')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
            Activity Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card"
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Note">Note</option>
          </select>
        </div>
        
        <Input
          label="Date & Time"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
          icon="Calendar"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
            Contact
          </label>
          <select
            value={formData.contactId}
            onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
            required
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card"
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
            Deal (Optional)
          </label>
          <select
            value={formData.dealId}
            onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card"
          >
            <option value="">Select a deal...</option>
            {deals.map(deal => (
              <option key={deal.Id} value={deal.Id}>
                {deal.title} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.value)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Input
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
        required
        icon="FileText"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card resize-none"
          placeholder="Add your notes here..."
        />
      </div>
      
      <div className="flex space-x-4 pt-6">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {activity ? 'Update Activity' : 'Create Activity'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}

export default ActivityForm