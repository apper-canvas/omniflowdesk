import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const DealForm = ({ deal, contacts, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    contactId: '',
    probability: '50',
    expectedClose: ''
  })
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value?.toString() || '',
        stage: deal.stage || 'Lead',
        contactId: deal.contactId?.toString() || '',
        probability: deal.probability?.toString() || '50',
        expectedClose: deal.expectedClose ? deal.expectedClose.split('T')[0] : ''
      })
    }
  }, [deal])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const dealData = {
        ...formData,
        Id: deal?.Id,
        value: parseFloat(formData.value) || 0,
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability),
        expectedClose: formData.expectedClose ? new Date(formData.expectedClose).toISOString() : null,
        createdAt: deal?.createdAt || new Date().toISOString()
      }
      
      await onSubmit(dealData)
      toast.success(deal ? 'Deal updated successfully!' : 'Deal created successfully!')
    } catch (error) {
      toast.error('Failed to save deal')
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
      <Input
        label="Deal Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        icon="Target"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Deal Value ($)"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
          required
          icon="DollarSign"
        />
        
        <Input
          label="Probability (%)"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
          required
          icon="Percent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
            Stage
          </label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card"
          >
            <option value="Lead">Lead</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        
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
      </div>
      
      <Input
        label="Expected Close Date"
        type="date"
        value={formData.expectedClose}
        onChange={(e) => setFormData(prev => ({ ...prev, expectedClose: e.target.value }))}
        icon="Calendar"
      />
      
      <div className="flex space-x-4 pt-6">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {deal ? 'Update Deal' : 'Create Deal'}
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

export default DealForm