import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContact" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContact" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_contact', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Contact not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: contactData.name || contactData.Name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        status: contactData.status,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.Tags,
        createdAt: new Date().toISOString(),
        lastContact: contactData.lastContact || null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Contact created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create contact');
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: contactData.name || contactData.Name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        status: contactData.status,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.Tags,
        lastContact: contactData.lastContact || null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} contacts:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Contact updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update contact');
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} contacts:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  }
}