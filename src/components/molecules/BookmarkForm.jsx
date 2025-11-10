import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { folderService } from "@/services/api/folderService";

const BookmarkForm = ({ 
  bookmark, 
  onSave, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    folderId: 1,
    tags: "",
  });
  
  const [folders, setFolders] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (bookmark) {
      setFormData({
        url: bookmark.url || "",
        title: bookmark.title || "",
        description: bookmark.description || "",
        folderId: bookmark.folderId || 1,
        tags: bookmark.tags ? bookmark.tags.join(", ") : "",
      });
    }
  }, [bookmark]);

  const loadFolders = async () => {
    try {
      const foldersData = await folderService.getAll();
      setFolders(foldersData);
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookmarkData = {
      url: formData.url.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      folderId: parseInt(formData.folderId),
      tags: formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      favicon: `https://www.google.com/s2/favicons?sz=64&domain=${new URL(formData.url).hostname}`,
    };

    onSave(bookmarkData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAutoFetchTitle = async () => {
    if (!formData.url) return;
    
    try {
      new URL(formData.url);
      // In a real app, you would fetch the page title here
      // For now, we'll generate a simple title from the domain
      const domain = new URL(formData.url).hostname.replace("www.", "");
      const title = domain.charAt(0).toUpperCase() + domain.slice(1);
      handleChange("title", title);
    } catch (error) {
      // Invalid URL, do nothing
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {bookmark ? "Edit Bookmark" : "Add New Bookmark"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            icon="X"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                label="URL"
                type="url"
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                onBlur={handleAutoFetchTitle}
                placeholder="https://example.com"
                error={errors.url}
                icon="Link"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                size="md"
                icon="Download"
                onClick={handleAutoFetchTitle}
                className="h-10"
                disabled={!formData.url}
              >
                Fetch
              </Button>
            </div>
          </div>

          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Bookmark title"
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus-ring focus:border-primary-500 transition-colors duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Folder
            </label>
            <select
              value={formData.folderId}
              onChange={(e) => handleChange("folderId", e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus-ring focus:border-primary-500 transition-colors duration-200"
              disabled={isLoadingFolders}
            >
              {folders.map((folder) => (
                <option key={folder.Id} value={folder.Id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="tag1, tag2, tag3"
            icon="Tag"
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              icon={isLoading ? "Loader2" : "Save"}
              className={isLoading ? "animate-spin" : ""}
            >
              {isLoading ? "Saving..." : "Save Bookmark"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default BookmarkForm;