import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = ({ count = 8 }) => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="p-5 h-64">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-4/6 animate-pulse" />
              </div>

              <div className="flex space-x-2 mb-4">
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-12 bg-slate-200 rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;