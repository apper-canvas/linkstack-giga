import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const folderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('folder_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "bookmark_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching folders:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const folders = (response.data || []).map(folder => ({
        Id: folder.Id,
        name: folder.name_c || 'Untitled Folder',
        color: folder.color_c || '#3b82f6',
        bookmarkCount: folder.bookmark_count_c || 0,
        createdAt: folder.CreatedOn
      }));

      return folders;
    } catch (error) {
      console.error("Error fetching folders:", error?.response?.data?.message || error);
      toast.error("Failed to load folders");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById('folder_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "bookmark_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching folder:", response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Transform database response to match UI expectations
      const folder = {
        Id: response.data.Id,
        name: response.data.name_c || 'Untitled Folder',
        color: response.data.color_c || '#3b82f6',
        bookmarkCount: response.data.bookmark_count_c || 0,
        createdAt: response.data.CreatedOn
      };

      return folder;
    } catch (error) {
      console.error("Error fetching folder:", error?.response?.data?.message || error);
      toast.error("Failed to load folder");
      return null;
    }
  },

  async create(folderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('folder_c', {
        records: [{
          name_c: folderData.name || 'Untitled Folder',
          color_c: folderData.color || '#3b82f6',
          bookmark_count_c: 0
        }]
      });

      if (!response.success) {
        console.error("Error creating folder:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} folders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdFolder = successful[0].data;
          toast.success("Folder created successfully");
          
          // Transform response to match UI expectations
          return {
            Id: createdFolder.Id,
            name: createdFolder.name_c || 'Untitled Folder',
            color: createdFolder.color_c || '#3b82f6',
            bookmarkCount: createdFolder.bookmark_count_c || 0,
            createdAt: createdFolder.CreatedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating folder:", error?.response?.data?.message || error);
      toast.error("Failed to create folder");
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.updateRecord('folder_c', {
        records: [{
          Id: parseInt(id),
          name_c: updateData.name,
          color_c: updateData.color,
          bookmark_count_c: updateData.bookmarkCount
        }]
      });

      if (!response.success) {
        console.error("Error updating folder:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} folders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedFolder = successful[0].data;
          toast.success("Folder updated successfully");
          
          // Transform response to match UI expectations
          return {
            Id: updatedFolder.Id,
            name: updatedFolder.name_c || 'Untitled Folder',
            color: updatedFolder.color_c || '#3b82f6',
            bookmarkCount: updatedFolder.bookmark_count_c || 0,
            createdAt: updatedFolder.CreatedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating folder:", error?.response?.data?.message || error);
      toast.error("Failed to update folder");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const response = await apperClient.deleteRecord('folder_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting folder:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} folders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Folder deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting folder:", error?.response?.data?.message || error);
      toast.error("Failed to delete folder");
      return false;
    }
  },

  async updateBookmarkCount(folderId) {
    try {
      // Get current bookmark count for this folder
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const bookmarkResponse = await apperClient.fetchRecords('bookmark_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "folder_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(folderId)]
        }]
      });

      if (!bookmarkResponse.success) {
        console.error("Error fetching bookmarks for count:", bookmarkResponse.message);
        return null;
      }

      const bookmarkCount = bookmarkResponse.data ? bookmarkResponse.data.length : 0;

      // Update the folder's bookmark count
      const updateResponse = await apperClient.updateRecord('folder_c', {
        records: [{
          Id: parseInt(folderId),
          bookmark_count_c: bookmarkCount
        }]
      });

      if (!updateResponse.success) {
        console.error("Error updating folder bookmark count:", updateResponse.message);
        return null;
      }

      // Return the updated folder
      return await this.getById(folderId);
    } catch (error) {
      console.error("Error updating bookmark count:", error?.response?.data?.message || error);
      return null;
    }
  }
};