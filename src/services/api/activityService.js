import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_Activity', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Activity not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: activityData.subject || activityData.Name,
        subject: activityData.subject,
        type: activityData.type,
        date: activityData.date,
        notes: activityData.notes || '',
        contactId: parseInt(activityData.contactId),
        dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
        Tags: Array.isArray(activityData.tags) ? activityData.tags.join(',') : activityData.Tags || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} activities:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Activity created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create activity');
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: activityData.subject || activityData.Name,
        subject: activityData.subject,
        type: activityData.type,
        date: activityData.date,
        notes: activityData.notes || '',
        contactId: parseInt(activityData.contactId),
        dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
        Tags: Array.isArray(activityData.tags) ? activityData.tags.join(',') : activityData.Tags || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} activities:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Activity updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update activity');
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} activities:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error);
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
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
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact ID:", error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "dealId",
            Operator: "EqualTo",
            Values: [parseInt(dealId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal ID:", error);
      return [];
    }
  }
}