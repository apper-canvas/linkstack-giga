import foldersData from "@/services/mockData/folders.json";
import { bookmarkService } from "./bookmarkService";

let folders = [...foldersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateBookmarkCount = async (folderId) => {
  const bookmarks = await bookmarkService.getByFolder(folderId);
  const folderIndex = folders.findIndex(f => f.Id === parseInt(folderId));
  if (folderIndex !== -1) {
    folders[folderIndex].bookmarkCount = bookmarks.length;
  }
};

export const folderService = {
  async getAll() {
    await delay(200);
    // Update bookmark counts for all folders
    for (const folder of folders) {
      await updateBookmarkCount(folder.Id);
    }
    return [...folders];
  },

  async getById(id) {
    await delay(150);
    const folder = folders.find(f => f.Id === parseInt(id));
    if (folder) {
      await updateBookmarkCount(id);
    }
    return folder ? { ...folder } : null;
  },

  async create(folderData) {
    await delay(300);
    const newFolder = {
      ...folderData,
      Id: Math.max(...folders.map(f => f.Id), 0) + 1,
      bookmarkCount: 0,
      createdAt: new Date().toISOString(),
    };
    folders.push(newFolder);
    return { ...newFolder };
  },

  async update(id, updateData) {
    await delay(250);
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) return null;
    
    folders[index] = {
      ...folders[index],
      ...updateData,
      Id: parseInt(id),
    };
    return { ...folders[index] };
  },

  async delete(id) {
    await delay(200);
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) return false;
    
    const deletedFolder = folders[index];
    folders.splice(index, 1);
    return deletedFolder;
  },

  async updateBookmarkCount(folderId) {
    await updateBookmarkCount(folderId);
    const folder = folders.find(f => f.Id === parseInt(folderId));
    return folder ? { ...folder } : null;
  }
};