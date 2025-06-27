import activitiesData from '@/services/mockData/activities.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Create a copy to prevent mutations
let activities = [...activitiesData]

export const activityService = {
  async getAll() {
    await delay(280)
    return [...activities]
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(activity => activity.Id === parseInt(id))
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(400)
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id)) + 1
    }
    activities.push(newActivity)
    return { ...newActivity }
  },

  async update(id, activityData) {
    await delay(350)
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    activities[index] = updatedActivity
    return { ...updatedActivity }
  },

  async delete(id) {
    await delay(250)
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    activities.splice(index, 1)
    return true
  },

  async getByContactId(contactId) {
    await delay(200)
    return activities.filter(activity => activity.contactId === parseInt(contactId))
  },

  async getByDealId(dealId) {
    await delay(200)
    return activities.filter(activity => activity.dealId === parseInt(dealId))
  }
}