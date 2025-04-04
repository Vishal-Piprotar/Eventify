import React from 'react';

const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        
        {/* Details Section Skeleton */}
        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
          {/* Date & Time Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          
          {/* Location Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          
          {/* Capacity Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="mt-4 h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;