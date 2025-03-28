'use client';

import React from 'react';

/**
 * HandDrawnFilter component
 * 
 * This component defines SVG filters that can be used to create
 * hand-drawn effects for various elements in the UI.
 */
export default function HandDrawnFilter() {
  return (
    <div className="absolute invisible" aria-hidden="true">
      <svg width="0" height="0">
        <defs>
          {/* Pencil filter - for a sketch-like pencil effect */}
          <filter id="pencil-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          
          {/* Marker filter - for a hand-drawn marker effect */}
          <filter id="marker-filter" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
          </filter>
          
          {/* Highlighter filter - for a highlighting effect */}
          <filter id="highlighter-filter">
            <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
            <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
            <feFlood floodColor="#FFFF00" floodOpacity="0.3" result="highlightColor" />
            <feComposite in="highlightColor" in2="blurred" operator="in" result="highlightedText" />
            <feComposite in="SourceGraphic" in2="highlightedText" operator="over" />
          </filter>
          
          {/* Paper texture filter - for a paper texture effect */}
          <filter id="paper-texture-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0" in="noise" result="coloredNoise" />
            <feComposite operator="arithmetic" k1="0" k2="0.05" k3="0" k4="0" in="SourceGraphic" in2="coloredNoise" result="textured" />
          </filter>
          
          {/* Eraser filter - for an erased effect */}
          <filter id="eraser-filter">
            <feTurbulence type="turbulence" baseFrequency="0.1" numOctaves="2" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.8 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
} 