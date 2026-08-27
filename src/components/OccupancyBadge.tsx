import React from 'react';
import { OccupancyLevel } from '../types';

interface OccupancyBadgeProps {
  level: OccupancyLevel;
  className?: string;
}

export const OccupancyBadge: React.FC<OccupancyBadgeProps> = ({ level, className = '' }) => {
  const getMeterConfig = () => {
    switch (level) {
      case 'seats_available':
        return {
          label: 'Seats Available',
          bars: ['bg-green-500', 'bg-[#e1e2ec]', 'bg-[#e1e2ec]'],
        };
      case 'standing_only':
        return {
          label: 'Standing Only',
          bars: ['bg-amber-500', 'bg-amber-500', 'bg-[#e1e2ec]'],
        };
      case 'limited_space':
        return {
          label: 'Limited Space',
          bars: ['bg-red-500', 'bg-red-500', 'bg-red-500'],
        };
      case 'full':
        return {
          label: 'Bus Full',
          bars: ['bg-red-600', 'bg-red-600', 'bg-red-600'],
        };
      default:
        return {
          label: 'Seats Available',
          bars: ['bg-green-500', 'bg-[#e1e2ec]', 'bg-[#e1e2ec]'],
        };
    }
  };

  const config = getMeterConfig();

  return (
    <span className={`font-label-caps text-label-caps text-[#434654] flex items-center gap-1.5 ${className}`}>
      <div className="flex gap-1 items-center" aria-hidden="true">
        {config.bars.map((barColor, index) => (
          <div key={index} className={`w-4 h-1 rounded-sm ${barColor}`} />
        ))}
      </div>
      <span>{config.label}</span>
    </span>
  );
};
