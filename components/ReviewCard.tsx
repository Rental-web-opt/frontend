"use client";

import { Star, CheckCircle2 } from "lucide-react";
import { Card } from "@/modules/card";
import { Badge } from "@/modules/badge";
import Image from "next/image";

interface ReviewCardProps {
  name: string;
  initials: string;
  avatar: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  verified: boolean;
}

export function ReviewCard({ 
  name, 
  initials, 
  avatar, 
  rating, 
  date, 
  service, 
  comment, 
  verified 
}: ReviewCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-[#3B82F6]">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#3B82F6]">
            <Image
              src={avatar || '/assets/default-avatar.jpeg'}
              alt={name || "User Avatar"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Show initials fallback
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-[#3B82F6] flex items-center justify-center text-white font-semibold">
                      ${initials}
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                {verified && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <span>{service}</span>
                <span>•</span>
                <span>{date}</span>
              </div>
            </div>
            
            {/* Star Rating */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= rating 
                      ? "fill-[#F97316] text-[#F97316]" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <p className="text-gray-700 leading-relaxed">{comment}</p>
        </div>
      </div>
    </Card>
  );
}