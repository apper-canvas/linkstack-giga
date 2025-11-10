import React from "react";
import { motion } from "framer-motion";
import BookmarkCard from "@/components/molecules/BookmarkCard";

const BookmarkGrid = ({ 
  bookmarks, 
  onEdit, 
  onDelete, 
  onTagClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bookmarks.map((bookmark, index) => (
        <motion.div
          key={bookmark.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <BookmarkCard
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            onTagClick={onTagClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BookmarkGrid;