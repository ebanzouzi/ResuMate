import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "sm",
  icon = null,
  className = "",
}) {
  // Mapping des variantes DaisyUI
  const variants = {
    primary: "btn-primary text-primary-content shadow-md shadow-primary/10",
    secondary: "btn-secondary text-secondary-content",
    outline:
      "btn-outline border-base-300 hover:bg-base-200 hover:text-base-content",
    error: "btn-error btn-ghost text-error hover:bg-error/10",
  };

  const sizes = {
    xs: "btn-xs rounded",
    sm: "btn-sm rounded-lg",
    md: "btn-md rounded-xl",
  };

  return (
    <button
      onClick={onClick}
      className={`btn ${variants[variant]} ${sizes[size]} font-bold gap-2 normal-case transition-all active:scale-[0.98] ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
