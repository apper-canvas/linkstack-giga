import bookmarksData from "@/services/mockData/bookmarks.json";

let bookmarks = [...bookmarksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookmarkService = {
  async getAll() {
    await delay(300);
    return [...bookmarks];
  },

  async getById(id) {
    await delay(200);
    const bookmark = bookmarks.find(b => b.Id === parseInt(id));
    return bookmark ? { ...bookmark } : null;
  },

  async getByFolder(folderId) {
    await delay(300);
    return bookmarks.filter(b => b.folderId === parseInt(folderId));
  },

  async create(bookmarkData) {
    await delay(400);
    const newBookmark = {
      ...bookmarkData,
      Id: Math.max(...bookmarks.map(b => b.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    return { ...newBookmark };
  },

  async update(id, updateData) {
    await delay(350);
    const index = bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index === -1) return null;
    
    bookmarks[index] = {
      ...bookmarks[index],
      ...updateData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    return { ...bookmarks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index === -1) return false;
    
    const deletedBookmark = bookmarks[index];
    bookmarks.splice(index, 1);
    return deletedBookmark;
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.description.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  async getByTag(tag) {
    await delay(200);
    return bookmarks.filter(bookmark =>
      bookmark.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  },

  async getAllTags() {
    await delay(150);
    const allTags = bookmarks.flatMap(bookmark => bookmark.tags);
    return [...new Set(allTags)].sort();
  }
};