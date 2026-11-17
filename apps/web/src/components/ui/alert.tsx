import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const alertVariants = cva("relative w-full rounded-lg border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7", {
  variants: {
    variant: {
      default: "bg-card text-foreground",
      destructive: "border-destructive/50 text-destructive [&>svg]:text-destructive",
      success: "border-success/50 text-success [&>svg]:text-success",
      warning: "border-warning/50 text-foreground [&>svg]:text-warning",
    },
  },
  defaultVariants: { variant: "default" },
});

export const Alert = ({ className, variant, ...props }: HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) => (
  <div role={variant === "destructive" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props} />
);
export const AlertTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={cn("mb-1 font-medium leading-none", className)} {...props} />
);
export const AlertDescription = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);
