import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FolderList = ({ folders, currentFolderId }) => {
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
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: folder.color }}
              />
              <span className="font-medium truncate">{folder.name}</span>
            </div>
            <div className="flex items-center space-x-2">
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