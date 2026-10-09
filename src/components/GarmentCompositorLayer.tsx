import React from 'react';
import type { GarmentItem } from '../types';

interface GarmentCompositorLayerProps {
  garment: GarmentItem;
  offsetY?: number; // percentage from top (e.g. 28 - 36%)
  scale?: number; // scale multiplier (0.8 - 1.4)
  opacity?: number; // 0 - 100
  isGenerating?: boolean;
}

export const GarmentCompositorLayer: React.FC<GarmentCompositorLayerProps> = ({
  garment,
  offsetY = 31,
  scale = 1.05,
  opacity = 96,
  isGenerating = false,
}) => {
  const isFullbody = garment.category === 'dresses_abaya' || garment.torsoFit === 'fullbody';

  return (
    <div
      className={`vton-dynamic-compositor-layer ${isGenerating ? 'compositor-generating' : ''}`}
      style={{
        top: `${offsetY}%`,
        transform: `translateX(-50%) scale(${scale})`,
        opacity: opacity / 100,
      }}
    >
      {/* 3D Anatomical Cloth Mesh Bounding Frame */}
      <div className={`cloth-torso-mask ${isFullbody ? 'mask-fullbody' : 'mask-torso'}`}>
        {/* Actual Chosen Uniform / Garment Texture */}
        <img
          src={garment.hdGarmentUrl || garment.thumbnailUrl}
          alt={garment.name}
          className="cloth-garment-image"
        />

        {/* Realistic Ambient Occlusion & Fabric Crease Overlay */}
        <div className="cloth-crease-shadows"></div>
        <div className="cloth-edge-highlights"></div>

        {/* Anatomical Neckline Cutout to expose subject's face & neck */}
        <div className={`neckline-hollow hollow-${garment.neckShape || 'crew_neck'}`}></div>

        {/* Subtle cloth boundary hem */}
        <div className="cloth-hem-border"></div>
      </div>

      {/* Floating Garment Label Pill */}
      <div className="compositor-floating-tag">
        <span className="dot-radar"></span>
        <span className="garment-tag-text">{garment.name}</span>
      </div>
    </div>
  );
};
