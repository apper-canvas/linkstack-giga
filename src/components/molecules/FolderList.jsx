import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FolderList = ({ folders, currentFolderId, onSetDefault, defaultFolderId, isSettingDefault }) => {
  return (
    <div className="space-y-1">
      {folders.map((folder, index) => (
        <motion.div
          key={folder.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
<NavLink
            to={`/folder/${folder.Id}`}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )
            }
          >
            <div className="flex items-center space-x-2">
              <span>{folder.name}</span>
              {folder.isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Default
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSetDefault?.(folder.Id);
                }}
                disabled={isSettingDefault === folder.Id}
                className={cn(
                  "p-1 rounded transition-all duration-200",
                  folder.isDefault
                    ? "text-amber-500 hover:bg-amber-50"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
                  isSettingDefault === folder.Id && "opacity-50 cursor-not-allowed"
                )}
                title={folder.isDefault ? "This is the default folder" : "Set as default"}
              >
                {isSettingDefault === folder.Id ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className={cn("w-4 h-4", folder.isDefault ? "fill-current" : "")} viewBox="0 0 24 24" fill={folder.isDefault ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 20.16 24.02 12 18.35 3.84 24.02 6.23 16.01 0 10.35 8.91 10.26 12 2" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {folder.bookmarkCount}
              </span>
              <ApperIcon
                name="ChevronRight"
                size={14}
                className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200"
              />
            </div>
          </NavLink>
        </motion.div>
      ))}
    </div>
  );
};

export default FolderList;