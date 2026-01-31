import { cn } from "@/utils";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
  onClick?: () => void;
}

export function Button({ 
  children, 
  className, 
  variant = "default", 
  size = "default",
  onClick 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2",
        variant === "default" && "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
        variant === "outline" && "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        size === "default" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
    >
      {children}
    </button>
  );
}