import React from 'react';

const MarkContainer: React.FC = React.memo(function MarkContainer () {
  return (
    <svg width="100%" height="100%" id="mask-container">
      <defs>
        <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
          <linearGradient id="linearGradient" gradientUnits="objectBoundingBox" x2="0" y2="1">
            <stop stopColor="white" stopOpacity="0" offset="0%" />
            <stop stopColor="white" stopOpacity="1" offset="20%" />
            <stop stopColor="white" stopOpacity="1" offset="40%" />
            <stop stopColor="white" stopOpacity="1" offset="60%" />
            <stop stopColor="white" stopOpacity="1" offset="80%" />
            <stop stopColor="white" stopOpacity="0" offset="100%" />
          </linearGradient>
          <rect width="100%" height="100%" fill="url(#linearGradient)" />
        </mask>
      </defs>
    </svg>
  )
})

export default MarkContainer