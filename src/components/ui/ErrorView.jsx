import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry,
  title = "Oops! Something went wrong"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        
        <p className="text-slate-600 mb-6">{error}</p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            icon="RefreshCw"
            className="mx-auto"
          >
            Try Again
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default ErrorView;