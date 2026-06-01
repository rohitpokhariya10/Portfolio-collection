import React from "react";

export const Button = ({ className = "", size = "default", children, ...props }) => {
    //Button ka default style
  const baseClasses =
    "relative overflow-hidden rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/20";
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
//Final classes banana
//runtime me size acces in object--> sizeClasses[size]
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
