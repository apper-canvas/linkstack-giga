import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-12 text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <ApperIcon name="BookmarkX" size={48} className="text-primary-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-slate-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to your bookmarks.
          </p>
          
          <div className="space-y-3">
            <Link to="/">
              <Button icon="Home" className="w-full">
                Go to All Bookmarks
              </Button>
            </Link>
            
            <Link to="/tags">
              <Button variant="secondary" icon="Tag" className="w-full">
                Browse by Tags
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Need help? Try searching for your bookmarks or check your folders.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;