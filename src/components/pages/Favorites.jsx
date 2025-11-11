import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import BookmarkGrid from "@/components/organisms/BookmarkGrid";
import BookmarkForm from "@/components/molecules/BookmarkForm";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { bookmarkService } from "@/services/api/bookmarkService";
import { toast } from "react-toastify";

const Favorites = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  useEffect(() => {
    loadFavoriteBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedTag]);

  const loadFavoriteBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all bookmarks and filter favorites on frontend
      const allBookmarks = await bookmarkService.getAll();
      const favoriteBookmarks = allBookmarks.filter(bookmark => bookmark.isFavorite);
      
      setBookmarks(favoriteBookmarks);
    } catch (error) {
      console.error("Error loading favorite bookmarks:", error);
      setError("Failed to load favorite bookmarks");
      toast.error("Failed to load favorite bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        bookmark =>
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(bookmark =>
        bookmark.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    setFilteredBookmarks(filtered);
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setIsFormOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }

    try {
      const success = await bookmarkService.delete(bookmarkId);
      if (success) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.Id !== bookmarkId));
        toast.success("Bookmark deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("Failed to delete bookmark");
    }
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      let result;
      if (editingBookmark) {
        result = await bookmarkService.update(editingBookmark.Id, bookmarkData);
        if (result) {
          setBookmarks(prev =>
            prev.map(bookmark =>
              bookmark.Id === editingBookmark.Id ? result : bookmark
            )
          );
          toast.success("Bookmark updated successfully");
        }
      } else {
        result = await bookmarkService.create(bookmarkData);
        if (result) {
          // Only add to favorites view if the new bookmark is favorited
          if (result.isFavorite) {
            setBookmarks(prev => [result, ...prev]);
          }
          toast.success("Bookmark created successfully");
        }
      }

      if (result) {
        setIsFormOpen(false);
        setEditingBookmark(null);
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      toast.error("Failed to save bookmark");
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
  };

  const handleToggleFavorite = async (bookmarkId) => {
    try {
      // Optimistic update
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.Id === bookmarkId 
          ? { ...bookmark, isFavorite: !bookmark.isFavorite }
          : bookmark
      ));

      const result = await bookmarkService.toggleFavorite(bookmarkId);
      
      if (result) {
        // If bookmark is no longer favorited, remove from favorites view
        if (!result.isFavorite) {
          setBookmarks(prev => prev.filter(bookmark => bookmark.Id !== bookmarkId));
        }
      } else {
        // Rollback on failure
        setBookmarks(prev => prev.map(bookmark => 
          bookmark.Id === bookmarkId 
            ? { ...bookmark, isFavorite: !bookmark.isFavorite }
            : bookmark
        ));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Rollback on failure
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.Id === bookmarkId 
          ? { ...bookmark, isFavorite: !bookmark.isFavorite }
          : bookmark
      ));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadFavoriteBookmarks} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header
          title="Favorite Bookmarks"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddBookmark={handleAddBookmark}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredBookmarks.length === 0 ? (
            searchQuery || selectedTag ? (
              <Empty
                icon="Search"
                message="No favorite bookmarks match your filters"
                description="Try adjusting your search terms or removing filters"
              />
            ) : (
              <Empty
                icon="Star"
                message="No favorite bookmarks yet"
                description="Start marking bookmarks as favorites by clicking the star icon"
              />
            )
          ) : (
            <BookmarkGrid
              bookmarks={filteredBookmarks}
              onEdit={handleEditBookmark}
              onDelete={handleDeleteBookmark}
              onTagClick={handleTagClick}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </motion.div>

        {isFormOpen && (
          <BookmarkForm
            bookmark={editingBookmark}
            onSave={handleSaveBookmark}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingBookmark(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;