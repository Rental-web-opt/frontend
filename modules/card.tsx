import { cn } from "@/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}