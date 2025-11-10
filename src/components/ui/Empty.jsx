import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No bookmarks yet",
  description = "Start building your collection by adding your first bookmark.",
  actionLabel = "Add Bookmark",
  onAction,
  icon = "Bookmark"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        
        <p className="text-slate-600 mb-6">{description}</p>
        
        {onAction && (
          <Button 
            onClick={onAction} 
            icon="Plus"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;