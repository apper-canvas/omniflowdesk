import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const ContactForm = ({ contact, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    tags: []
  })
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        status: contact.status || 'Active',
        tags: contact.tags || []
      })
    }
  }, [contact])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const contactData = {
        ...formData,
        Id: contact?.Id,
        createdAt: contact?.createdAt || new Date().toISOString(),
        lastContact: contact?.lastContact
      }
      
      await onSubmit(contactData)
      toast.success(contact ? 'Contact updated successfully!' : 'Contact created successfully!')
    } catch (error) {
      toast.error('Failed to save contact')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          icon="User"
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          icon="Mail"
        />
        
        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          icon="Phone"
        />
        
        <Input
          label="Company"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          icon="Building"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 glass-card"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Prospect">Prospect</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
          Tags
        </label>
        <div className="flex space-x-2 mb-3">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            icon="Tag"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            variant="outline"
            size="md"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4 pt-6">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {contact ? 'Update Contact' : 'Create Contact'}
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

export default ContactForm