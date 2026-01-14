import { Card } from "@/modules/card";

interface StatsCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  gradient?: boolean;
}

export function StatsCard({ value, label, icon, gradient = false }: StatsCardProps) {
  return (
    <Card className={`
      p-6 text-center relative overflow-hidden
      ${gradient 
        ? 'bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white' 
        : 'bg-white border-2 border-[#3B82F6]/20'
      }
    `}>
      {/* Icon */}
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      
      {/* Value */}
      <div className={`
        text-3xl font-bold mb-1
        ${gradient ? 'text-white' : 'text-[#1E3A8A]'}
      `}>
        {value}
      </div>
      
      {/* Label */}
      <div className={`
        text-sm font-medium
        ${gradient ? 'text-white/90' : 'text-gray-600'}
      `}>
        {label}
      </div>
    </Card>
  );
}