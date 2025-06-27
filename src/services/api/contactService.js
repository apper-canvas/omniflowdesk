import contactsData from '@/services/mockData/contacts.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Create a copy to prevent mutations
let contacts = [...contactsData]

export const contactService = {
  async getAll() {
    await delay(300)
    return [...contacts]
  },

  async getById(id) {
    await delay(200)
    const contact = contacts.find(contact => contact.Id === parseInt(id))
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  },

  async create(contactData) {
    await delay(400)
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastContact: null
    }
    contacts.push(newContact)
    return { ...newContact }
  },

  async update(id, contactData) {
    await delay(350)
    const index = contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id)
    }
    contacts[index] = updatedContact
    return { ...updatedContact }
  },

  async delete(id) {
    await delay(250)
    const index = contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    contacts.splice(index, 1)
    return true
  }
}