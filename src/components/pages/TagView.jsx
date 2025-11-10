import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import BookmarkGrid from "@/components/organisms/BookmarkGrid";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { bookmarkService } from "@/services/api/bookmarkService";
import { folderService } from "@/services/api/folderService";

const TagView = () => {
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTags();
    const searchTag = searchParams.get("search");
    if (searchTag) {
      setSelectedTag(searchTag);
      setSearchQuery(searchTag);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedTag) {
      loadBookmarksByTag(selectedTag);
    } else {
      setBookmarks([]);
      setFilteredBookmarks([]);
    }
  }, [selectedTag]);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery]);

  const loadTags = async () => {
    try {
      setError("");
      const tagsData = await bookmarkService.getAllTags();
      setTags(tagsData);
    } catch (err) {
      setError("Failed to load tags. Please try again.");
      console.error("Error loading tags:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookmarksByTag = async (tag) => {
    try {
      const bookmarksData = await bookmarkService.getByTag(tag);
      setBookmarks(bookmarksData);
    } catch (err) {
      toast.error("Failed to load bookmarks for this tag.");
      console.error("Error loading bookmarks by tag:", err);
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

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setSearchParams({ search: tag });
  };

  const handleClearTag = () => {
    setSelectedTag("");
    setSearchParams({});
    setSearchQuery("");
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

  const handleEditBookmark = (bookmark) => {
    navigate(`/?edit=${bookmark.Id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Tags"
          onMenuClick={onMenuClick}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-6">
          <Loading count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Tags"
          onMenuClick={onMenuClick}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-6">
          <ErrorView error={error} onRetry={loadTags} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Tags"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuClick={onMenuClick}
        showAddButton={false}
      />

      <div className="p-6 space-y-8">
        {/* Selected Tag */}
        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <Badge variant="primary" className="text-base px-3 py-2">
                #{selectedTag}
              </Badge>
              <span className="text-slate-600">
                {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={handleClearTag}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear Filter
            </button>
          </motion.div>
        )}

        {/* All Tags */}
        {!selectedTag && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              All Tags ({tags.length})
            </h2>
            
            {tags.length === 0 ? (
              <Empty
                title="No tags found"
                description="Tags will appear here as you add them to your bookmarks."
                icon="Tag"
                actionLabel="Add Bookmark"
                onAction={() => navigate("/")}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Badge
                      variant="default"
                      className="text-sm px-3 py-2 cursor-pointer hover:bg-primary-100 hover:text-primary-800 transition-colors duration-200"
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks for Selected Tag */}
        {selectedTag && (
          <AnimatePresence mode="wait">
            {filteredBookmarks.length === 0 ? (
              <Empty
                title={`No bookmarks found for #${selectedTag}`}
                description={
                  searchQuery && searchQuery !== selectedTag
                    ? `No bookmarks with tag "${selectedTag}" match "${searchQuery}".`
                    : `No bookmarks are tagged with "${selectedTag}".`
                }
                icon="Tag"
                actionLabel="Browse All Bookmarks"
                onAction={() => navigate("/")}
              />
            ) : (
              <motion.div
                key="tag-bookmarks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookmarkGrid
                  bookmarks={filteredBookmarks}
                  onEdit={handleEditBookmark}
                  onDelete={handleDeleteBookmark}
                  onTagClick={handleTagClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TagView;