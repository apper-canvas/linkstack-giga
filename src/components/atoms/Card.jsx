import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ children, className, hover = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg border border-slate-200 shadow-sm",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;