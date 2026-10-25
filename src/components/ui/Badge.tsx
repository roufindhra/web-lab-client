import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "available" | "borrowed" | "maintenance";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "available",
  className,
  ...props
}) => {
  const variants = {
    available: "bg-emerald-100 text-emerald-800 border-emerald-300",
    borrowed: "bg-amber-100 text-amber-800 border-amber-300",
    maintenance: "bg-rose-100 text-rose-800 border-rose-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
