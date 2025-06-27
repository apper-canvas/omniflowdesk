import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "contactId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to load deals");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "contactId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('deal', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Deal not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: dealData.title || dealData.Name,
        title: dealData.title,
        value: parseFloat(dealData.value) || 0,
        stage: dealData.stage,
        probability: parseInt(dealData.probability) || 0,
        expectedClose: dealData.expectedClose,
        contactId: parseInt(dealData.contactId),
        createdAt: new Date().toISOString(),
        Tags: Array.isArray(dealData.tags) ? dealData.tags.join(',') : dealData.Tags || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} deals:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Deal created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create deal');
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: dealData.title || dealData.Name,
        title: dealData.title,
        value: parseFloat(dealData.value) || 0,
        stage: dealData.stage,
        probability: parseInt(dealData.probability) || 0,
        expectedClose: dealData.expectedClose,
        contactId: parseInt(dealData.contactId),
        Tags: Array.isArray(dealData.tags) ? dealData.tags.join(',') : dealData.Tags || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} deals:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Deal updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update deal');
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} deals:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error);
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "contactId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "contactId",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact ID:", error);
      return [];
    }
  }
}