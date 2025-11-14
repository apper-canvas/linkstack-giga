import { toast } from 'react-toastify';
import React from 'react';
import { getApperClient } from '@/services/apperClient';

/**
 * Get all folders for the current user
 * @returns {Promise<Array>} Array of folder objects
 */
export const getFolders = async () => {
  try {
    const apperClient = getApperClient();
    
const response = await apperClient.fetchRecords('folder_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'is_default_c' } },
        { field: { Name: 'bookmark_count_c' } },
        { field: { Name: 'color_c' } },
        { field: { Name: 'color_c' } }
      ],
      orderBy: [{ fieldName: 'Id', sorttype: 'ASC' }]
    });

    if (!response.success) {
      console.error('Error fetching folders:', response.message);
      toast.error(response.message || 'Failed to load folders');
      return [];
    }
return response || [];
  } catch (error) {
    console.error('Error fetching folders:', error?.response?.data?.message || error);
    toast.error('Failed to load folders');
    return [];
  }
};

/**
 * Set a folder as default
 * @param {number} folderId - The folder ID to set as default
 * @returns {Promise<boolean>} Success status
 */
export const setDefaultFolder = async (folderId) => {
  try {
    if (!folderId) {
      toast.error('Invalid folder ID');
      return false;
    }

    const apperClient = getApperClient();

    // First, unset all other folders' default flag
    const allFolders = await getFolders();
    if (allFolders.length > 0) {
      const defaultFolders = allFolders.filter(f => f.is_default_c === true && f.Id !== folderId);
      
      if (defaultFolders.length > 0) {
        await apperClient.updateRecord('folder_c', {
          records: defaultFolders.map(f => ({
            Id: f.Id,
            is_default_c: false
          }))
        });
      }
    }

    // Set the selected folder as default
    const response = await apperClient.updateRecord('folder_c', {
      records: [
        {
          Id: folderId,
          is_default_c: true
        }
      ]
    });

    if (!response.success) {
      console.error('Error setting default folder:', response.message);
      toast.error(response.message || 'Failed to set default folder');
      return false;
    }

    toast.success('Default folder updated');
    return true;
  } catch (error) {
    console.error('Error setting default folder:', error?.response?.data?.message || error);
    toast.error('Failed to set default folder');
    return false;
  }
};

/**
 * Create a new folder
 * @param {Object} folderData - Folder data (name_c, description_c, etc.)
 * @returns {Promise<Object|null>} Created folder object or null on error
 */
export const createFolder = async (folderData) => {
  try {
    if (!folderData.name_c) {
      toast.error('Folder name is required');
      return null;
    }

    const apperClient = getApperClient();

    const response = await apperClient.createRecord('folder_c', {
      records: [
        {
          name_c: folderData.name_c,
          description_c: folderData.description_c || '',
          is_default_c: false
        }
      ]
    });

    if (!response.success) {
      console.error('Error creating folder:', response.message);
      toast.error(response.message || 'Failed to create folder');
      return null;
    }

    if (response.results && response.results[0]) {
      const createdFolder = response.results[0].data;
      toast.success('Folder created successfully');
      return createdFolder;
    }

    return null;
  } catch (error) {
    console.error('Error creating folder:', error?.response?.data?.message || error);
    toast.error('Failed to create folder');
    return null;
  }
};

/**
 * Update folder details
 * @param {number} folderId - The folder ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} Success status
 */
export const updateFolder = async (folderId, updates) => {
  try {
    if (!folderId) {
      toast.error('Invalid folder ID');
      return false;
    }

    const apperClient = getApperClient();

    const response = await apperClient.updateRecord('folder_c', {
      records: [
        {
          Id: folderId,
          ...updates
        }
      ]
    });

    if (!response.success) {
      console.error('Error updating folder:', response.message);
      toast.error(response.message || 'Failed to update folder');
      return false;
    }

    toast.success('Folder updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating folder:', error?.response?.data?.message || error);
    toast.error('Failed to update folder');
    return false;
  }
};

/**
 * Delete a folder
 * @param {number} folderId - The folder ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFolder = async (folderId) => {
  try {
    if (!folderId) {
      toast.error('Invalid folder ID');
      return false;
    }

    const apperClient = getApperClient();

    const response = await apperClient.deleteRecord('folder_c', {
      RecordIds: [folderId]
    });

    if (!response.success) {
      console.error('Error deleting folder:', response.message);
      toast.error(response.message || 'Failed to delete folder');
      return false;
    }

    toast.success('Folder deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting folder:', error?.response?.data?.message || error);
    toast.error('Failed to delete folder');
    return false;
  }
};

export const folderService = {
  getFolders,
  setDefaultFolder,
  createFolder,
  updateFolder,
  deleteFolder
};