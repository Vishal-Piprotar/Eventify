import React from "react";

const AnimatedTooltip = ({ items }) => {
  return (
    <div className="flex -space-x-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative group transition-transform duration-300 ease-out transform hover:scale-110"
        >
          {/* Avatar */}
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md transition-all duration-300 ease-out group-hover:shadow-xl"
          />

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 scale-95 translate-y-2 rotate-0 pointer-events-none group-hover:opacity-100 group-hover:scale-105 group-hover:translate-y-0 group-hover:rotate-3 transition-all duration-500 ease-out bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg backdrop-blur-md ring-1 ring-gray-700/50 w-auto  before:absolute before:content-[''] before:w-3 before:h-3 before:bg-gray-900 before:rotate-45 before:-bottom-1 before:left-1/2 before:-translate-x-1/2">
            {item.tooltipContent || `${item.name}`}
            {/* {item.tooltipContent || `${item.name} - ${item.designation}`} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedTooltip;
