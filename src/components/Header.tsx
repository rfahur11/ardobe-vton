import React from 'react';
import { Sparkles, Cpu, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture }) => {
  return (
    <header className="app-header glass-panel">
      <div className="header-brand">
        <div className="brand-logo-glow">
          <div className="brand-icon">
            <Sparkles size={22} className="text-accent" />
          </div>
        </div>
        <div className="brand-titles">
          <div className="brand-row">
            <h1 className="brand-name">Ardobe<span className="brand-highlight">AI</span></h1>
            <span className="badge-pill beta-pill">Video VTON Studio v1.0</span>
          </div>
          <p className="brand-tagline">Real-Time Motion Wardrobe & Temporal Video Try-On</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="gpu-status-pill">
          <div className="status-dot pulse-emerald"></div>
          <Cpu size={14} className="text-secondary" />
          <span className="gpu-label">TensorRT Video-UNet</span>
          <span className="gpu-speed">36 FPS</span>
        </div>

        <button 
          className="btn-header-action" 
          onClick={onOpenArchitecture}
          title="Lihat Arsitektur ML & Data Contract"
        >
          <Layers size={16} />
          <span>ML Architecture</span>
        </button>
      </div>
    </header>
  );
};
