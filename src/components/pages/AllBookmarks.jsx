import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import BookmarkGrid from "@/components/organisms/BookmarkGrid";
import BookmarkForm from "@/components/molecules/BookmarkForm";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { bookmarkService } from "@/services/api/bookmarkService";
import { folderService } from "@/services/api/folderService";

const AllBookmarks = () => {
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
  
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery]);

  const loadBookmarks = async () => {
    try {
      setError("");
      const data = await bookmarkService.getAll();
      setBookmarks(data);
    } catch (err) {
      setError("Failed to load bookmarks. Please try again.");
      console.error("Error loading bookmarks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookmarks = () => {
    if (!searchQuery.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(query) ||
      bookmark.description.toLowerCase().includes(query) ||
      bookmark.url.toLowerCase().includes(query) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredBookmarks(filtered);
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      setIsSubmitting(true);
      
      if (editingBookmark) {
        const updatedBookmark = await bookmarkService.update(editingBookmark.Id, bookmarkData);
        setBookmarks(prev => 
          prev.map(b => b.Id === editingBookmark.Id ? updatedBookmark : b)
        );
        toast.success("Bookmark updated successfully!");
      } else {
        const newBookmark = await bookmarkService.create(bookmarkData);
        setBookmarks(prev => [newBookmark, ...prev]);
        toast.success("Bookmark added successfully!");
      }

      // Update folder bookmark count
      await folderService.updateBookmarkCount(bookmarkData.folderId);
      
      setShowForm(false);
      setEditingBookmark(null);
    } catch (err) {
      toast.error("Failed to save bookmark. Please try again.");
      console.error("Error saving bookmark:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleDeleteBookmark = async (bookmark) => {
    try {
      await bookmarkService.delete(bookmark.Id);
      setBookmarks(prev => prev.filter(b => b.Id !== bookmark.Id));
      
      // Update folder bookmark count
      await folderService.updateBookmarkCount(bookmark.folderId);
      
      toast.success("Bookmark deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete bookmark. Please try again.");
      console.error("Error deleting bookmark:", err);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/tags?search=${encodeURIComponent(tag)}`);
  };

  const handleAddClick = () => {
    setEditingBookmark(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBookmark(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header
          title="All Bookmarks"
          onMenuClick={onMenuClick}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="All Bookmarks"
          onMenuClick={onMenuClick}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-6">
          <ErrorView error={error} onRetry={loadBookmarks} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="All Bookmarks"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
        onMenuClick={onMenuClick}
      />

      <div className="p-6">
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              <BookmarkForm
                bookmark={editingBookmark}
                onSave={handleSaveBookmark}
                onCancel={handleCancelForm}
                isLoading={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {filteredBookmarks.length === 0 ? (
            <Empty
              title={searchQuery ? "No bookmarks found" : "No bookmarks yet"}
              description={
                searchQuery
                  ? `No bookmarks match "${searchQuery}". Try a different search term.`
                  : "Start building your collection by adding your first bookmark."
              }
              actionLabel="Add Bookmark"
              onAction={handleAddClick}
            />
          ) : (
            <motion.div
              key="bookmarks-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-slate-600">
                  {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              
              <BookmarkGrid
                bookmarks={filteredBookmarks}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
                onTagClick={handleTagClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllBookmarks;