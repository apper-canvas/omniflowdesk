import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import DealPipeline from '@/components/organisms/DealPipeline'
import DealForm from '@/components/organisms/DealForm'
import Modal from '@/components/organisms/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [viewingDeal, setViewingDeal] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
      setFilteredDeals(dealsData)
    } catch (err) {
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDeals(deals)
      return
    }
    
const filtered = deals.filter(deal => {
      const contact = contacts.find(c => c.Id === deal.contactId)
      const title = deal.title || deal.Name || ''
      const contactName = contact ? (contact.Name || contact.name || '') : ''
      const company = contact ? (contact.company || '') : ''
      
      return (
        title.toLowerCase().includes(query.toLowerCase()) ||
        contactName.toLowerCase().includes(query.toLowerCase()) ||
        company.toLowerCase().includes(query.toLowerCase())
      )
    })
    setFilteredDeals(filtered)
  }
  
  const handleAddNew = () => {
    setEditingDeal(null)
    setShowForm(true)
  }
  
  const handleDealClick = (deal) => {
    setViewingDeal(deal)
  }
  
  const handleDealUpdate = async (dealId, updatedData) => {
    try {
      const updatedDeal = await dealService.update(dealId, updatedData)
      const updatedDeals = deals.map(d => 
        d.Id === dealId ? updatedDeal : d
      )
      setDeals(updatedDeals)
      setFilteredDeals(updatedDeals)
      toast.success('Deal updated successfully!')
    } catch (err) {
      toast.error('Failed to update deal')
    }
  }
  
  const handleSubmit = async (dealData) => {
    try {
      let updatedDeal
      if (editingDeal) {
        updatedDeal = await dealService.update(editingDeal.Id, dealData)
        const updatedDeals = deals.map(d => 
          d.Id === editingDeal.Id ? updatedDeal : d
        )
        setDeals(updatedDeals)
        setFilteredDeals(updatedDeals)
      } else {
        updatedDeal = await dealService.create(dealData)
        const updatedDeals = [...deals, updatedDeal]
        setDeals(updatedDeals)
        setFilteredDeals(updatedDeals)
      }
      setShowForm(false)
      setEditingDeal(null)
    } catch (err) {
      throw err
    }
  }
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Header
        title="Deals"
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        showAddButton={true}
      />
      
      {filteredDeals.length === 0 && !loading ? (
        <Empty
          title="No deals found"
          message="Start tracking your sales opportunities by creating your first deal"
          actionText="Add Deal"
          onAction={handleAddNew}
          icon="Target"
        />
      ) : (
        <DealPipeline
          deals={filteredDeals}
          contacts={contacts}
          onDealUpdate={handleDealUpdate}
          onDealClick={handleDealClick}
        />
      )}
      
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingDeal(null)
        }}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
        size="lg"
      >
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingDeal(null)
          }}
        />
      </Modal>
      
      <Modal
        isOpen={!!viewingDeal}
        onClose={() => setViewingDeal(null)}
        title="Deal Details"
        size="lg"
      >
        {viewingDeal && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">
                  {viewingDeal.title}
                </h3>
<p className="text-gray-600 font-body">
                  {contacts.find(c => c.Id === viewingDeal.contactId)?.Name || contacts.find(c => c.Id === viewingDeal.contactId)?.name} - {' '}
                  {contacts.find(c => c.Id === viewingDeal.contactId)?.company}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600 font-display">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(viewingDeal.value)}
                </p>
                <p className="text-sm text-gray-500">{viewingDeal.probability}% probability</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Deal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Stage:</span> {viewingDeal.stage}</p>
                  <p><span className="font-medium">Expected Close:</span> {' '}
                    {viewingDeal.expectedClose 
                      ? new Date(viewingDeal.expectedClose).toLocaleDateString()
                      : 'Not set'
                    }
                  </p>
                  <p><span className="font-medium">Created:</span> {' '}
                    {new Date(viewingDeal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditingDeal(viewingDeal)
                    setViewingDeal(null)
                    setShowForm(true)
                  }}
                  className="bg-gradient-primary text-white px-6 py-2 rounded-xl hover:bg-gradient-hover transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Edit Deal
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Deals