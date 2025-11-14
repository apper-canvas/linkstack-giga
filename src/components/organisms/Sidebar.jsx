import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { setDefaultFolderId } from "@/store/userSlice";
import { cn } from "@/utils/cn";
import { getFolders, setDefaultFolder } from "@/services/api/folderService";
import ApperIcon from "@/components/ApperIcon";
import FolderList from "@/components/molecules/FolderList";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Sidebar = ({ isOpen, onClose }) => {
  // Redux integration
  const dispatch = useDispatch();

// State for managing folder operations
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [folders, setFolders] = useState([]);
  const [defaultFolderId, setDefaultFolderId] = useState(null);
  const [isSettingDefault, setIsSettingDefault] = useState(null);

  // State for showing add folder form
  const [showAddFolder, setShowAddFolder] = useState(false);

const loadFolders = async () => {
    setIsFetching(true);
    setError(null);
    try {
const response = await getFolders();
      const folderData = Array.isArray(response) ? response : [];
      setFolders(folderData);
      
      // Set first folder as default if no default folder exists
      const defaultFolder = folderData.find(folder => folder.is_default_c);
      if (defaultFolder) {
        dispatch(setDefaultFolderId(defaultFolder.Id));
        setDefaultFolderId(defaultFolder.Id);
      } else if (folderData.length > 0) {
        dispatch(setDefaultFolderId(folderData[0].Id));
        setDefaultFolderId(folderData[0].Id);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
      setError(err.message);
      toast.error('Failed to load folders');
    } finally {
      setIsFetching(false);
    }
  };


  useEffect(() => {
    loadFolders();
  }, [dispatch]);
  const handleSetDefault = async (folderId) => {
    setIsSettingDefault(folderId);
    try {
await setDefaultFolder(folderId);
      const updatedFolders = folders.map(f => ({
        ...f,
        isDefault: f.Id === folderId
      }));
      setFolders(updatedFolders);
      setDefaultFolderId(folderId);
      dispatch(setDefaultFolderId(folderId));
      toast.success("Default folder updated successfully");
    } catch (error) {
      console.error("Failed to set default folder:", error);
      toast.error("Failed to set default folder");
    } finally {
      setIsSettingDefault(null);
    }
  };

  const navigationItems = [
    {
      to: "/",
      icon: "Bookmark",
      label: "All Bookmarks",
      end: true
    },
    {
      to: "/favorites",
      icon: "Star",
      label: "Favorites"
    },
    {
      to: "/tags",
      icon: "Tag",
      label: "Tags View"
    }
  ];

return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <SidebarContent 
          folders={folders}
          navigationItems={navigationItems}
          isLoading={isFetching}
          onRefreshFolders={loadFolders}
          currentFolderId={null}
          onSetDefault={handleSetDefault}
          defaultFolderId={defaultFolderId}
          isSettingDefault={isSettingDefault}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent 
          folders={folders}
          navigationItems={navigationItems}
          isLoading={isFetching}
          onRefreshFolders={loadFolders}
          currentFolderId={null}
          onSetDefault={handleSetDefault}
          defaultFolderId={defaultFolderId}
          isSettingDefault={isSettingDefault}
          onClose={onClose}
          isMobile={true}
        />
      </div>
    </>
  );
};


const SidebarContent = ({ folders, navigationItems, isLoading, onRefreshFolders, currentFolderId, onSetDefault, defaultFolderId, isSettingDefault, onClose, isMobile = false }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="Bookmark" size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Linkstack</span>
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            icon="X"
            onClick={onClose}
            className="lg:hidden"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <ApperIcon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Folders Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Folders
            </h3>
            <Button
              variant="ghost"
              size="icon"
              icon="RefreshCw"
              onClick={onRefreshFolders}
              className={cn(
                "w-6 h-6 text-slate-400 hover:text-slate-600",
                isLoading && "animate-spin"
              )}
            />
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
                  <div className="w-6 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div onClick={onClose}>
<FolderList 
                folders={folders}
                currentFolderId={currentFolderId}
                onSetDefault={onSetDefault}
                defaultFolderId={defaultFolderId}
                isSettingDefault={isSettingDefault}
              />
            </div>
          )}
        </div>
      </nav>
{/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          <p>Total: {Array.isArray(folders) ? folders.reduce((acc, folder) => acc + (folder.bookmark_count_c || 0), 0) : 0} bookmarks</p>
          <p className="mt-1">Across {Array.isArray(folders) ? folders.length : 0} folders</p>
        </div>
      </div>
</div>
  );
};

export default Sidebar;