import React, { useState } from 'react';
import { TryOnProvider } from './context/TryOnContext';
import { Header } from './components/Header';
import { VideoComparisonPlayer } from './components/VideoComparisonPlayer';
import { WardrobePicker } from './components/WardrobePicker';
import { CaptureStudio } from './components/CaptureStudio';
import { ModelArchitectureDrawer } from './components/ModelArchitectureDrawer';

const StudioContent: React.FC = () => {
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  return (
    <div className="app-wrapper">
      <Header onOpenArchitecture={() => setIsArchitectureOpen(true)} />

      <main className="app-main-layout">
        {/* Left Column: Center Video Comparison Studio */}
        <section className="left-viewport-column">
          <VideoComparisonPlayer />
        </section>

        {/* Right Column: Wardrobe Selector & Media Capture Studio */}
        <section className="right-studio-column">
          <WardrobePicker />
          <CaptureStudio />
        </section>
      </main>

      {/* Deep Architecture & Contract Drawer */}
      <ModelArchitectureDrawer
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TryOnProvider>
      <StudioContent />
    </TryOnProvider>
  );
}
