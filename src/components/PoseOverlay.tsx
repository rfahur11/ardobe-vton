import React from 'react';

interface PoseOverlayProps {
  isAligned: boolean;
  statusText?: string;
}

export const PoseOverlay: React.FC<PoseOverlayProps> = ({ 
  isAligned = true,
  statusText = 'Pose in Frame: Optimal Draping Range'
}) => {
  return (
    <div className="pose-overlay-container">
      {/* 3D Human Silhouette Guide Wireframe */}
      <svg className="pose-silhouette-svg" viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head circle & oval */}
        <circle cx="200" cy="110" r="48" stroke={isAligned ? 'rgba(6, 182, 212, 0.7)' : 'rgba(236, 72, 153, 0.7)'} strokeWidth="2" strokeDasharray="6 4" />
        
        {/* Shoulder & Torso Lines */}
        <path 
          d="M120 180 Q200 170 280 180 L295 340 Q200 355 105 340 Z" 
          stroke={isAligned ? 'rgba(99, 102, 241, 0.7)' : 'rgba(236, 72, 153, 0.7)'} 
          strokeWidth="2" 
          strokeDasharray="8 6"
        />

        {/* Arms and Sleeves Guides */}
        <path d="M120 180 L70 320 L50 420" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M280 180 L330 320 L350 420" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* DensePose Keypoint Tracking Dots */}
        <circle cx="200" cy="110" r="4" fill="#06b6d4" />
        <circle cx="150" cy="175" r="4" fill="#6366f1" />
        <circle cx="250" cy="175" r="4" fill="#6366f1" />
        <circle cx="200" cy="240" r="4" fill="#a855f7" />
        <circle cx="200" cy="340" r="4" fill="#ec4899" />
      </svg>

      {/* Frame Status Pill */}
      <div className={`pose-status-tag ${isAligned ? 'status-ok' : 'status-warning'}`}>
        <span className="dot-radar"></span>
        <span>{statusText}</span>
      </div>
    </div>
  );
};
