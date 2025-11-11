import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BookmarkCard = ({ 
  bookmark, 
  onEdit, 
onDelete,
  onToggleFavorite,
  onTagClick,
  className 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleOpenLink = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  const getFaviconUrl = (url) => {
    if (imageError || !bookmark.favicon) {
      return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`;
    }
    return bookmark.favicon;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card hover className="p-5 h-full group">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                {!imageLoaded && (
                  <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                )}
                <img
                  src={getFaviconUrl(bookmark.url)}
                  alt=""
                  className={cn(
                    "w-8 h-8 rounded transition-opacity duration-200",
                    !imageLoaded && "opacity-0 absolute inset-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                  {bookmark.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {new URL(bookmark.url).hostname}
                </p>
              </div>
            </div>
            
            {/* Action buttons - hidden until hover */}
<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1 ml-2">
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(bookmark.Id)}
                className="p-1 text-slate-400 hover:text-amber-500 transition-colors duration-200 rounded"
                title={bookmark.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <ApperIcon 
                  name={bookmark.isFavorite ? "Star" : "Star"} 
                  size={16} 
                  className={bookmark.isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-400"} 
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                icon="ExternalLink"
                onClick={handleOpenLink}
                className="w-7 h-7 text-slate-400 hover:text-primary-600"
              />
              <Button
                variant="ghost"
                size="icon"
                icon="Edit2"
                onClick={() => onEdit?.(bookmark)}
                className="w-7 h-7 text-slate-400 hover:text-amber-600"
              />
              <Button
                variant="ghost"
                size="icon"
                icon="Trash2"
                onClick={() => onDelete?.(bookmark)}
                className="w-7 h-7 text-slate-400 hover:text-red-600"
              />
            </div>
          </div>

          {/* Description */}
          {bookmark.description && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              {truncateText(bookmark.description, 120)}
            </p>
          )}

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {bookmark.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer hover:bg-primary-100 hover:text-primary-800 transition-colors duration-200"
                  onClick={() => onTagClick?.(tag)}
                >
                  #{tag}
                </Badge>
              ))}
              {bookmark.tags.length > 3 && (
                <Badge variant="default" className="text-slate-500">
                  +{bookmark.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer with timestamp */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon="ExternalLink"
              onClick={handleOpenLink}
              className="text-primary-600 hover:text-primary-700 px-2 py-1 h-auto"
            >
              Open
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookmarkCard;