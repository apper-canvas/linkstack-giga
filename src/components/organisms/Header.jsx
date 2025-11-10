import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onAddClick, 
  onMenuClick,
  showSearch = true,
  showAddButton = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-slate-200 px-4 py-4 lg:px-6"
    >
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden text-slate-600"
          />
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        {/* Center section - Search */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search your bookmarks..."
              className="w-full"
            />
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {showAddButton && (
            <Button
              onClick={onAddClick}
              icon="Plus"
              className="shadow-sm"
            >
              <span className="hidden sm:inline">Add Bookmark</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search your bookmarks..."
          />
        </div>
      )}
    </motion.div>
  );
};

export default Header;