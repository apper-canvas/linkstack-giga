import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const bookmarkService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('bookmark_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "url_c"}},
{"field": {"Name": "favicon_c"}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching bookmarks:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const bookmarks = (response.data || []).map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || 'Untitled Bookmark',
        description: bookmark.description_c || '',
        url: bookmark.url_c || '',
favicon: bookmark.favicon_c || '',
        folderId: bookmark.folder_id_c?.Id || (typeof bookmark.folder_id_c === 'number' ? bookmark.folder_id_c : 1),
        isFavorite: bookmark.is_favorite_c || false,
        createdAt: bookmark.CreatedOn,
        modifiedAt: bookmark.ModifiedOn,
        tags: bookmark.tags_c ? bookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
      }));

      return bookmarks;
    } catch (error) {
      console.error("Error fetching bookmarks:", error?.response?.data?.message || error);
      toast.error("Failed to load bookmarks");
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

      const response = await apperClient.getRecordById('bookmark_c', parseInt(id), {
fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "folder_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching bookmark:", response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Transform database response to match UI expectations
      const bookmark = {
        Id: response.data.Id,
        title: response.data.title_c || 'Untitled Bookmark',
        description: response.data.description_c || '',
        url: response.data.url_c || '',
favicon: response.data.favicon_c || '',
isFavorite: Boolean(response.data.is_favorite_c),
        folderId: response.data.folder_id_c?.Id || (typeof response.data.folder_id_c === 'number' ? response.data.folder_id_c : 1),
        tags: response.data.tags_c ? response.data.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        createdAt: response.data.CreatedOn,
        updatedAt: response.data.ModifiedOn
      };

      return bookmark;
    } catch (error) {
      console.error("Error fetching bookmark:", error?.response?.data?.message || error);
      toast.error("Failed to load bookmark");
      return null;
    }
  },

  async getByFolder(folderId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('bookmark_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "url_c"}},
{"field": {"Name": "favicon_c"}},
          {"field": {"Name": "folder_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "folder_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(folderId)]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching bookmarks by folder:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const bookmarks = (response.data || []).map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || 'Untitled Bookmark',
        description: bookmark.description_c || '',
        url: bookmark.url_c || '',
favicon: bookmark.favicon_c || '',
isFavorite: Boolean(bookmark.is_favorite_c),
        folderId: bookmark.folder_id_c?.Id || (typeof bookmark.folder_id_c === 'number' ? bookmark.folder_id_c : 1),
        tags: bookmark.tags_c ? bookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        createdAt: bookmark.CreatedOn,
        updatedAt: bookmark.ModifiedOn
      }));

      return bookmarks;
    } catch (error) {
      console.error("Error fetching bookmarks by folder:", error?.response?.data?.message || error);
      toast.error("Failed to load folder bookmarks");
      return [];
    }
  },

  async create(bookmarkData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('bookmark_c', {
        records: [{
          title_c: bookmarkData.title || 'Untitled Bookmark',
          description_c: bookmarkData.description || '',
          url_c: bookmarkData.url || '',
          favicon_c: bookmarkData.favicon || '',
folder_id_c: bookmarkData.folderId ? parseInt(bookmarkData.folderId) : 1,
          is_favorite_c: Boolean(bookmarkData.isFavorite),
          tags_c: Array.isArray(bookmarkData.tags) ? bookmarkData.tags.join(',') : (bookmarkData.tags || '')
        }]
      });

      if (!response.success) {
        console.error("Error creating bookmark:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bookmarks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdBookmark = successful[0].data;
          toast.success("Bookmark created successfully");
          
          // Transform response to match UI expectations
          return {
            Id: createdBookmark.Id,
            title: createdBookmark.title_c || 'Untitled Bookmark',
            description: createdBookmark.description_c || '',
            url: createdBookmark.url_c || '',
favicon: createdBookmark.favicon_c || '',
            folderId: createdBookmark.folder_id_c?.Id || (typeof createdBookmark.folder_id_c === 'number' ? createdBookmark.folder_id_c : 1),
            isFavorite: createdBookmark.is_favorite_c || false,
            tags: createdBookmark.tags_c ? createdBookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
            createdAt: createdBookmark.CreatedOn,
            updatedAt: createdBookmark.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating bookmark:", error?.response?.data?.message || error);
      toast.error("Failed to create bookmark");
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

      const response = await apperClient.updateRecord('bookmark_c', {
        records: [{
          Id: parseInt(id),
          title_c: updateData.title,
          description_c: updateData.description,
          url_c: updateData.url,
favicon_c: updateData.favicon || '',
          folder_id_c: updateData.folderId ? parseInt(updateData.folderId) : 1,
          is_favorite_c: updateData.isFavorite,
          tags_c: Array.isArray(updateData.tags) ? updateData.tags.join(',') : (updateData.tags || '')
        }]
      });

      if (!response.success) {
        console.error("Error updating bookmark:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bookmarks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedBookmark = successful[0].data;
          toast.success("Bookmark updated successfully");
          
          // Transform response to match UI expectations
          return {
            Id: updatedBookmark.Id,
            title: updatedBookmark.title_c || 'Untitled Bookmark',
            description: updatedBookmark.description_c || '',
            url: updatedBookmark.url_c || '',
favicon: updatedBookmark.favicon_c || '',
            folderId: updatedBookmark.folder_id_c?.Id || (typeof updatedBookmark.folder_id_c === 'number' ? updatedBookmark.folder_id_c : 1),
            isFavorite: updatedBookmark.is_favorite_c || false,
            tags: updatedBookmark.tags_c ? updatedBookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
            createdAt: updatedBookmark.CreatedOn,
            updatedAt: updatedBookmark.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating bookmark:", error?.response?.data?.message || error);
      toast.error("Failed to update bookmark");
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

      const response = await apperClient.deleteRecord('bookmark_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting bookmark:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bookmarks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Bookmark deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting bookmark:", error?.response?.data?.message || error);
      toast.error("Failed to delete bookmark");
      return false;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const searchTerm = query.toLowerCase();

      const response = await apperClient.fetchRecords('bookmark_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
{"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "is_favorite_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {"fieldName": "title_c", "operator": "Contains", "values": [searchTerm]},
              {"fieldName": "description_c", "operator": "Contains", "values": [searchTerm]},
              {"fieldName": "url_c", "operator": "Contains", "values": [searchTerm]},
              {"fieldName": "tags_c", "operator": "Contains", "values": [searchTerm]}
            ],
            "operator": "OR"
          }]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error searching bookmarks:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const bookmarks = (response.data || []).map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || 'Untitled Bookmark',
        description: bookmark.description_c || '',
        url: bookmark.url_c || '',
favicon: bookmark.favicon_c || '',
        folderId: bookmark.folder_id_c?.Id || (typeof bookmark.folder_id_c === 'number' ? bookmark.folder_id_c : 1),
tags: bookmark.tags_c ? bookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        isFavorite: bookmark.is_favorite_c || false,
        createdAt: bookmark.CreatedOn,
        updatedAt: bookmark.ModifiedOn
      }));

      return bookmarks;
    } catch (error) {
      console.error("Error searching bookmarks:", error?.response?.data?.message || error);
      toast.error("Failed to search bookmarks");
      return [];
    }
  },

  async getByTag(tag) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('bookmark_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
{"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "is_favorite_c"}}
        ],
        where: [{
          "FieldName": "tags_c",
          "Operator": "Contains",
          "Values": [tag]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching bookmarks by tag:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform and filter database response to match UI expectations
      const bookmarks = (response.data || [])
        .map(bookmark => ({
          Id: bookmark.Id,
          title: bookmark.title_c || 'Untitled Bookmark',
          description: bookmark.description_c || '',
          url: bookmark.url_c || '',
          favicon: bookmark.favicon_c || '',
folderId: bookmark.folder_id_c?.Id || (typeof bookmark.folder_id_c === 'number' ? bookmark.folder_id_c : 1),
          tags: bookmark.tags_c ? bookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
createdAt: bookmark.CreatedOn,
          isFavorite: bookmark.is_favorite_c || false,
          updatedAt: bookmark.ModifiedOn
        }))
        .filter(bookmark => 
          bookmark.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );

      return bookmarks;
    } catch (error) {
      console.error("Error fetching bookmarks by tag:", error?.response?.data?.message || error);
      toast.error("Failed to load bookmarks by tag");
      return [];
    }
},

  async toggleFavorite(bookmarkId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        toast.error("Unable to update favorite status");
        return null;
      }

      // First get current bookmark data
      const currentBookmark = await this.getById(bookmarkId);
      if (!currentBookmark) {
        toast.error("Bookmark not found");
        return null;
      }

      const newFavoriteStatus = !currentBookmark.isFavorite;
      
      // Update the bookmark with new favorite status
      const params = {
        records: [
          {
Id: parseInt(bookmarkId),
            is_favorite_c: Boolean(newFavoriteStatus)
          }
        ]
      };

      const response = await apperClient.updateRecord('bookmark_c', params);

      if (!response.success) {
        console.error("Error toggling favorite:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update favorite status:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success(newFavoriteStatus ? "Added to favorites" : "Removed from favorites");
          return {
            ...currentBookmark,
            isFavorite: newFavoriteStatus
          };
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark favorite:", error?.response?.data?.message || error);
      toast.error("Failed to update favorite status");
      return null;
    }
  },

  async getAllTags() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('bookmark_c', {
        fields: [{"field": {"Name": "tags_c"}}]
      });

      if (!response.success) {
        console.error("Error fetching tags:", response.message);
        toast.error(response.message);
        return [];
      }

      // Extract and flatten all tags
      const allTags = (response.data || [])
        .filter(bookmark => bookmark.tags_c)
        .flatMap(bookmark => 
          bookmark.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        );

      // Return unique sorted tags
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error("Error fetching tags:", error?.response?.data?.message || error);
      toast.error("Failed to load tags");
      return [];
    }
  }
};