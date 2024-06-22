import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        platform_online:
          "border-transparent bg-blue-800 text-primary-foreground hover:bg-blue-600",
        platform_physical:
          "border-transparent bg-green-700 text-primary-foreground hover:bg-green-600",
        platform_hybrid:
          "border-transparent bg-yellow-600 text-primary-foreground hover:bg-yellow-500",
        accepted: "border-transparent bg-blue-800 text-primary-foreground",
        rejected: "border-transparent bg-red-700 text-primary-foreground",
        pending: "border-transparent bg-orange-600 text-primary-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
