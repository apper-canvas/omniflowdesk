import dealsData from '@/services/mockData/deals.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Create a copy to prevent mutations
let deals = [...dealsData]

export const dealService = {
  async getAll() {
    await delay(350)
    return [...deals]
  },

  async getById(id) {
    await delay(200)
    const deal = deals.find(deal => deal.Id === parseInt(id))
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  },

  async create(dealData) {
    await delay(450)
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    deals.push(newDeal)
    return { ...newDeal }
  },

  async update(id, dealData) {
    await delay(400)
    const index = deals.findIndex(deal => deal.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id)
    }
    deals[index] = updatedDeal
    return { ...updatedDeal }
  },

  async delete(id) {
    await delay(300)
    const index = deals.findIndex(deal => deal.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    deals.splice(index, 1)
    return true
  },

  async getByContactId(contactId) {
    await delay(250)
    return deals.filter(deal => deal.contactId === parseInt(contactId))
  }
}