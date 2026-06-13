import { MapPin, ArrowUpRightFromSquare, Heart } from "lucide-react";
import SecondaryButton from "@/components/ui/button/SecondaryButton";

export default function ListingDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="hover:text-gray-600 cursor-pointer">Rally</span>
          <span>:</span>
          <span className="hover:text-gray-600 cursor-pointer">Cars</span>
          <span>:</span>
          <span className="text-gray-600">Modified</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            Ford Escort Mk1 Rally Prepared 1973
          </h1>
          <div className="shrink-0 md:w-56 flex items-center justify-between gap-2">
            <span className="text-sm text-gray-400">345 views</span>
            <span className="text-sm text-gray-500 border border-gray-200 rounded-full px-3 py-1 whitespace-nowrap">
              Posted 16 days ago
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Main image — always 16/9 */}
          <div className="flex-1 aspect-16/10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            main image
          </div>

          {/* Thumbnails — column on desktop, row on mobile */}
          <div className="flex flex-row md:flex-col gap-3 md:w-56 h-24 md:h-auto">
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              image 2
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              image 3
            </div>
            <div className="flex-1 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-300 transition-colors">
              <span>All photos</span>
              <span>···</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Price */}
          <span className="font-semibold text-white rounded-full px-4 py-1.5 bg-brand-gradient">
            £125,000
          </span>

          {/* Location */}
          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={14} />
            Huddersfield, Leeds
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Share */}
          <SecondaryButton>
            <ArrowUpRightFromSquare size={14} className="icon-brand" />
            <span className="text-brand-gradient">Share</span>
          </SecondaryButton>

          {/* Watch */}
          <SecondaryButton>
            <Heart size={14} className="icon-brand" />
            <span className="text-brand-gradient">Save ad</span>
          </SecondaryButton>

          {/* Saved */}
          <span className="text-sm text-gray-500 border border-gray-200 rounded-full px-3 py-1.5">
            3 others saved
          </span>
        </div>
      </div>
    </div>
  );
}
