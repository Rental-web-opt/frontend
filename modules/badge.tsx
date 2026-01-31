import { cn } from "@/utils";

interface BadgeProps {
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "default" && "bg-gray-100 text-gray-900",
      variant === "outline" && "border border-gray-300 text-gray-700",
      className
    )}>
      {children}
    </span>
  );
}