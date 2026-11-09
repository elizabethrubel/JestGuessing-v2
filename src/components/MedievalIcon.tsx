import React from 'react';

export type MedievalGlyphName =
  | 'castle'       // Medieval keep with crenelations for Home
  | 'sword'        // Medieval broadsword for Get Jesting / Start
  | 'shield'       // Heraldic heater shield for Got it! / Solved
  | 'scroll'       // Royal proclamation scroll for Theme / Commonality
  | 'help'         // Wax seal question medallion for Rules
  | 'close'        // Saltire cross for Missed / Remove
  | 'check'        // Heraldic checkmark
  | 'refresh'      // Twin runic arrows for Shuffle / Reroll
  | 'star'         // 8-pointed illuminated star / astrolabe
  | 'crown'        // 3-point royal crown
  | 'arrow-right'  // Broadhead arrow right
  | 'arrow-left'   // Broadhead arrow left
  | 'drag'         // 6-dot medieval stud grip
  | 'feather'      // Scribe quill
  | 'ring'         // Armillary ring
  | 'crossed-swords' // Crossed tournament arming swords
  | 'fleur'        // Heraldic Fleur-de-lis
  | 'chalice'      // Medieval golden goblet / chalice
  | 'wax-seal'     // Heraldic stamped seal
  // Backwards compatibility aliases
  | 'fortress'
  | 'crest'
  | 'cross'
  | 'rosette'
  | 'seal'
  | 'diamond'
  | 'court';

interface MedievalIconProps {
  name: MedievalGlyphName;
  className?: string;
  size?: number | string;
  title?: string;
}

export const MedievalIcon: React.FC<MedievalIconProps> = ({
  name,
  className = '',
  size = 20,
  title,
}) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 20;

  const renderIconContent = () => {
    switch (name) {
      case 'castle':
      case 'fortress':
        // Stately medieval Norman keep with 3 crenels, portcullis arch, and arrow slits
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M3 4h4v3h2V4h6v3h2V4h4v6h-1v11H4V10H3V4zm3 8h2.5v3H6v-3zm9.5 0H18v3h-2.5v-3zM10 14h4a2 2 0 0 1 2 2v5h-8v-5a2 2 0 0 1 2-2z"
          />
        );

      case 'sword':
        // Heroic medieval arming sword: tapered double-edged blade, crossguard, grip, pommel
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 1.5l1.8 3.5V13.5h3.2c.6 0 1 .4 1 1s-.4 1-1 1H13v3.5l1.2 1.2v1.8h-4.4v-1.8l1.2-1.2V15.5H7c-.6 0-1-.4-1-1s.4-1 1-1h3.2V5L12 1.5zm-1 3.8v7.2h2V5.3l-1-2-1 2z"
          />
        );

      case 'crossed-swords':
        // Two tournament broadswords crossed cleanly at 45 degrees
        return (
          <g fill="currentColor">
            {/* Sword from top-left to bottom-right */}
            <path d="M4.5 2.5l2-1 9 9 2.5-.5 1 1-1.5 1.5 2 2v2h-2l-2-2-1.5 1.5-1-1 .5-2.5-9-9z" opacity="0.95" />
            {/* Sword from top-right to bottom-left */}
            <path d="M19.5 2.5l-2-1-9 9-2.5-.5-1 1 1.5 1.5-2 2v2h2l2-2 1.5-1.5 1 1-.5-2.5 9-9z" opacity="0.95" />
            {/* Center crossing boss */}
            <circle cx="12" cy="11.5" r="1.5" />
          </g>
        );

      case 'wax-seal':
      case 'seal':
        // Smooth 8-lobed heraldic wax seal with inner ring and signet fleur
        return (
          <g fill="currentColor" fillRule="evenodd">
            {/* 8-lobed scalloped wax edge */}
            <path d="M12 2c1.8 0 3.2.9 4.2 1.5 1.3-.4 2.8-.2 3.8.8s1.2 2.5.8 3.8c.6 1 1.5 2.4 1.5 4.2s-.9 3.2-1.5 4.2c.4 1.3.2 2.8-.8 3.8s-2.5 1.2-3.8.8c-1 .6-2.4 1.5-4.2 1.5s-3.2-.9-4.2-1.5c-1.3.4-2.8.2-3.8-.8s-1.2-2.5-.8-3.8c-.6-1-1.5-2.4-1.5-4.2s.9-3.2 1.5-4.2c-.4-1.3-.2-2.8.8-3.8s2.5-1.2 3.8-.8C8.8 2.9 10.2 2 12 2z" />
            {/* Inner ring */}
            <circle cx="12" cy="12.3" r="5.5" fill="#0e1626" />
            {/* Inner signet cross */}
            <path d="M12 9v6.6M8.7 12.3h6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="12.3" r="1.2" fill="currentColor" />
          </g>
        );

      case 'help':
      case 'ring':
        // Clean heraldic uncial question medallion
        return (
          <g fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6z"
            />
            <path
              d="M10.2 8.8c0-1.2 1-2 2-2 1.2 0 2.1.8 2.1 1.9 0 1-.6 1.6-1.3 2-.6.4-.9.9-.9 1.7v.5h-1.6v-.5c0-1.1.5-1.7 1.3-2.2.5-.3.9-.7.9-1.4 0-.5-.4-.9-.9-.9-.5 0-.9.3-.9.9H10.2zm1 6.5h1.8v1.8h-1.8v-1.8z"
            />
          </g>
        );

      case 'shield':
      case 'crest':
        // Classic heraldic heater shield with cross emblem
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M4 3h16v8.5c0 4.8-3.6 8.9-8 10.5-4.4-1.6-8-5.7-8-10.5V3zm2.5 2.5v6c0 3.5 2.5 6.7 5.5 8 3-1.3 5.5-4.5 5.5-8v-6h-11zm4.5 2h2v3h3v2h-3v4h-2v-4h-3v-2h3v-3z"
          />
        );

      case 'scroll':
        // Royal proclamation parchment scroll
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M5 3.5h12a3 3 0 0 1 3 3v11.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.2a2.8 2.8 0 0 1 1-2.2v2.5a1.2 1.2 0 0 0 1.2 1.2h10.6a1.2 1.2 0 0 0 1.2-1.2V5.5H6.2a1.2 1.2 0 0 0-1.2 1.2V18a1.2 1.2 0 0 0 1.2 1.2H17a1.2 1.2 0 0 0 1.2-1.2V9.5H6V7.5h12v-1a1.5 1.5 0 0 0-1.5-1.5H5v-1.5zM8.5 12h7v1.5h-7V12zm0 3h5v1.5h-5V15z"
          />
        );

      case 'refresh':
      case 'rosette':
        // Twin circular medieval recycling arrows
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.9 6.8h-2.1a5.9 5.9 0 1 1-1.6-3.8l-2.7 2.7H21V4.2l-3.35 2.15z"
          />
        );

      case 'star':
      case 'diamond':
        // 8-pointed illuminated medieval star
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 2l2.3 5.3 5.7.9-4.2 4 1.1 5.8L12 15.2 7.1 18l1.1-5.8-4.2-4 5.7-.9L12 2z"
          />
        );

      case 'crown':
      case 'court':
        // 3-point royal crown
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M3 6l4.5 4.5L12 3l4.5 7.5L21 6v13H3V6zm2 11h14v-7.2l-3.2 2.2L12 6.6l-3.8 5.4L5 9.8V17zm2-2h2v1H7v-1zm4 0h2v1h-2v-1zm4 0h2v1h-2v-1z"
          />
        );

      case 'fleur':
        // Royal heraldic Fleur-de-lis
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 2.5c.8 2 2 4 4.2 5-1.7 1-3 2.5-3.2 5h2.5c2.2-1.8 4.5-.8 5.5 1-1.3 1.8-3.5 1.8-5.8.8-.5 2.2-1.6 3.8-2.7 4.5h-2c-1.1-.7-2.2-2.3-2.7-4.5-2.3 1-4.5 1-5.8-.8 1-1.8 3.3-2.8 5.5-1H9c-.2-2.5-1.5-4-3.2-5 2.2-1 3.4-3 4.2-5h2zm-2 14.5h4v1.5h-4V17zm-1 2.8h6v1.8h-6v-1.8z"
          />
        );

      case 'chalice':
        // Medieval grail / ceremonial goblet
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M5 3.5h14v6.5a7 7 0 0 1-6 6.9V19h3v2H8v-2h3v-2.1A7 7 0 0 1 5 10V3.5zm2 2v4.5a5 5 0 0 0 10 0V5.5H7z"
          />
        );

      case 'close':
      case 'cross':
        // Medieval saltire iron cross
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M5.5 4L4 5.5 10.5 12 4 18.5 5.5 20l6.5-6.5 6.5 6.5 1.5-1.5-6.5-6.5L20 5.5 18.5 4 12 10.5 5.5 4z"
          />
        );

      case 'check':
        // Heraldic quill checkmark
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M20.3 5.3l-11 11-5-5L2.9 12.7l6.4 6.4 12.4-12.4-1.4-1.4z"
          />
        );

      case 'arrow-right':
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12.5 5.5l5.5 5.5a1.4 1.4 0 0 1 0 2l-5.5 5.5-1.4-1.4 3.6-3.6H4v-2h10.7l-3.6-3.6 1.4-1.4z"
          />
        );

      case 'arrow-left':
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M11.5 18.5L6 13a1.4 1.4 0 0 1 0-2l5.5-5.5 1.4 1.4-3.6 3.6H20v2H9.3l3.6 3.6-1.4 1.4z"
          />
        );

      case 'drag':
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M9 6h2v2H9V6zm4 0h2v2h-2V6zm-4 5h2v2H9v-2zm4 0h2v2h-2v-2zm-4 5h2v2H9v-2zm4 0h2v2h-2v-2z"
          />
        );

      case 'feather':
      default:
        return (
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M21 3c-5 0-10 3-13 7-2 2.7-2.8 6.1-3 9l-1 2 2-1c2.9-.2 6.3-1 9-3 4-3 7-8 7-13v-1zm-3 3c-.8 2.2-2.5 4.5-4.5 6.2l-2.7-2.7C12.5 7.5 15 6.2 18 6zm-7 7.5l2.5 2.5c-1.8 1.4-3.8 2.3-5.5 2.8.5-1.7 1.4-3.7 3-5.3z"
          />
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={pixelSize}
      height={pixelSize}
      className={`inline-block select-none shrink-0 ${className}`}
      title={title}
      aria-hidden={!title}
    >
      {renderIconContent()}
    </svg>
  );
};
