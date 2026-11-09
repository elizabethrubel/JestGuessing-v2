import React from 'react';

interface ShepherdStarProps {
  size?: number | string;
  className?: string;
  variant?: 'default' | 'tilted' | 'asymmetric';
  title?: string;
}

/**
 * Exact 7-pointed sharp woodblock star motif from the German Shepherd Jester illustration.
 * Slender needle-like rays with a compact inner core and subtle hand-carved asymmetry.
 */
export const ShepherdStar: React.FC<ShepherdStarProps> = ({
  size = 24,
  className = 'text-[#b9bfff]',
  variant = 'default',
  title,
}) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 24;

  // Hand-crafted 7-pointed woodblock star polygons matching the German Shepherd illustration
  const pointsMap = {
    default:
      '50,3 56.5,36.5 87,20 64.5,46.5 96,61 61,60.5 71.5,93 50,66.5 28.5,93 39,60.5 4,61 35.5,46.5 13,20 43.5,36.5',
    tilted:
      '53,4 58,36 89,23 65,48 94,65 60,62 68,94 48,67 24,90 38,59 5,56 36,44 16,17 44,36',
    asymmetric:
      '48,2 56,35 88,18 65,45 97,58 61,60 74,92 49,66 26,94 38,60 3,62 35,46 11,22 43,36',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={pixelSize}
      height={pixelSize}
      className={`inline-block select-none shrink-0 pointer-events-none ${className}`}
      title={title}
      aria-hidden={!title}
    >
      <polygon fill="currentColor" points={pointsMap[variant]} />
    </svg>
  );
};

interface ShepherdStarConstellationProps {
  className?: string;
}

/**
 * Decorative floating constellation of 7-pointed Shepherd stars
 * used to frame screens (such as the Character Viewing Screen) where full illustrations are omitted.
 */
export const ShepherdStarConstellation: React.FC<ShepherdStarConstellationProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none select-none aria-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Top-Left Cluster */}
      <ShepherdStar
        size={34}
        variant="default"
        className="text-[#b9bfff]/85 absolute top-14 sm:top-20 left-4 sm:left-10 -rotate-6 drop-shadow-[0_2px_10px_rgba(185,191,255,0.25)]"
      />
      <ShepherdStar
        size={19}
        variant="tilted"
        className="text-[#b9bfff]/60 absolute top-24 sm:top-32 left-12 sm:left-24 rotate-12"
      />

      {/* Top-Right Cluster */}
      <ShepherdStar
        size={30}
        variant="asymmetric"
        className="text-[#b9bfff]/80 absolute top-16 sm:top-22 right-5 sm:right-12 rotate-6 drop-shadow-[0_2px_10px_rgba(185,191,255,0.25)]"
      />
      <ShepherdStar
        size={17}
        variant="default"
        className="text-[#b9bfff]/55 absolute top-28 sm:top-36 right-12 sm:right-24 -rotate-12"
      />

      {/* Bottom-Left Star */}
      <ShepherdStar
        size={24}
        variant="tilted"
        className="text-[#b9bfff]/65 absolute bottom-24 sm:bottom-28 left-6 sm:left-16 rotate-3"
      />

      {/* Bottom-Right Star */}
      <ShepherdStar
        size={26}
        variant="default"
        className="text-[#b9bfff]/70 absolute bottom-22 sm:bottom-28 right-6 sm:right-16 -rotate-6"
      />
    </div>
  );
};
