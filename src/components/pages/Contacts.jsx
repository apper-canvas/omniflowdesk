import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import ContactTable from '@/components/organisms/ContactTable'
import ContactForm from '@/components/organisms/ContactForm'
import Modal from '@/components/organisms/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { contactService } from '@/services/api/contactService'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [viewingContact, setViewingContact] = useState(null)
  
  const loadContacts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadContacts()
  }, [])
  
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredContacts(contacts)
      return
    }
    
    const filtered = contacts.filter(contact =>
      contact.name?.toLowerCase().includes(query.toLowerCase()) ||
      contact.email?.toLowerCase().includes(query.toLowerCase()) ||
      contact.company?.toLowerCase().includes(query.toLowerCase()) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredContacts(filtered)
  }
  
  const handleAddNew = () => {
    setEditingContact(null)
    setShowForm(true)
  }
  
  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }
  
  const handleView = (contact) => {
    setViewingContact(contact)
  }
  
  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(contactId)
        const updatedContacts = contacts.filter(c => c.Id !== contactId)
        setContacts(updatedContacts)
        setFilteredContacts(updatedContacts.filter(contact =>
          filteredContacts.find(fc => fc.Id === contact.Id)
        ))
        toast.success('Contact deleted successfully!')
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }
  
  const handleSubmit = async (contactData) => {
    try {
      let updatedContact
      if (editingContact) {
        updatedContact = await contactService.update(editingContact.Id, contactData)
        const updatedContacts = contacts.map(c => 
          c.Id === editingContact.Id ? updatedContact : c
        )
        setContacts(updatedContacts)
        setFilteredContacts(updatedContacts)
      } else {
        updatedContact = await contactService.create(contactData)
        const updatedContacts = [...contacts, updatedContact]
        setContacts(updatedContacts)
        setFilteredContacts(updatedContacts)
      }
      setShowForm(false)
      setEditingContact(null)
    } catch (err) {
      throw err
    }
  }
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadContacts} />
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Header
        title="Contacts"
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        showAddButton={true}
      />
      
      {filteredContacts.length === 0 && !loading ? (
        <Empty
          title="No contacts found"
          message="Start building your network by adding your first contact"
          actionText="Add Contact"
          onAction={handleAddNew}
          icon="Users"
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
      
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingContact(null)
        }}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingContact(null)
          }}
        />
      </Modal>
      
      <Modal
        isOpen={!!viewingContact}
        onClose={() => setViewingContact(null)}
        title="Contact Details"
        size="lg"
      >
        {viewingContact && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {viewingContact.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">
                  {viewingContact.name}
                </h3>
                <p className="text-gray-600 font-body">{viewingContact.company}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {viewingContact.email}</p>
                  <p><span className="font-medium">Phone:</span> {viewingContact.phone}</p>
                  <p><span className="font-medium">Status:</span> {viewingContact.status}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingContact.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Contacts