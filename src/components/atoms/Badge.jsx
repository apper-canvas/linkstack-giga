import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    secondary: "bg-slate-600 text-white hover:bg-slate-700",
    success: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 cursor-default",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;