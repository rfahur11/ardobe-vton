import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  Sliders, 
  Columns, 
  Eye, 
  Sparkles, 
  Activity, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';

export const VideoComparisonPlayer: React.FC = () => {
  const {
    selectedVideo,
    selectedGarment,
    jobState,
    startInference,
    viewMode,
    setViewMode,
    splitPosition,
    setSplitPosition,
    isPlaying,
    togglePlay,
    playbackSpeed,
    setPlaybackSpeed,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
  } = useTryOn();

  const sourceVideoRef = useRef<HTMLVideoElement | null>(null);
  const resultVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [showDensePoseMesh, setShowDensePoseMesh] = useState<boolean>(false);

  // Sync play/pause states
  useEffect(() => {
    if (sourceVideoRef.current) {
      if (isPlaying) {
        sourceVideoRef.current.play().catch(() => {});
      } else {
        sourceVideoRef.current.pause();
      }
    }

    if (resultVideoRef.current) {
      if (isPlaying) {
        resultVideoRef.current.play().catch(() => {});
      } else {
        resultVideoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (sourceVideoRef.current) sourceVideoRef.current.playbackRate = playbackSpeed;
    if (resultVideoRef.current) resultVideoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Handle time update from primary video
  const handleTimeUpdate = () => {
    if (sourceVideoRef.current) {
      setCurrentTime(sourceVideoRef.current.currentTime);
      if (resultVideoRef.current) {
        const drift = Math.abs(sourceVideoRef.current.currentTime - resultVideoRef.current.currentTime);
        if (drift > 0.08) {
          resultVideoRef.current.currentTime = sourceVideoRef.current.currentTime;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (sourceVideoRef.current) {
      setDuration(sourceVideoRef.current.duration || 6);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (sourceVideoRef.current) sourceVideoRef.current.currentTime = newTime;
    if (resultVideoRef.current) resultVideoRef.current.currentTime = newTime;
  };

  // Dragging slider logic
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPosition(percentage);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDraggingSlider(false);
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSlider]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  const isRendering = jobState.stage !== 'completed' && jobState.stage !== 'idle';

  return (
    <div className="player-module-card glass-panel">
      {/* Top View Mode & Action Toolbar */}
      <div className="player-toolbar">
        <div className="view-mode-tabs">
          <button
            className={`mode-btn ${viewMode === 'split_slider' ? 'mode-active' : ''}`}
            onClick={() => setViewMode('split_slider')}
            title="Interactive Split Screen Slider"
          >
            <Sliders size={15} />
            <span>Split Slider</span>
          </button>
          <button
            className={`mode-btn ${viewMode === 'side_by_side' ? 'mode-active' : ''}`}
            onClick={() => setViewMode('side_by_side')}
            title="Side-by-Side Synchronized Comparison"
          >
            <Columns size={15} />
            <span>Side-by-Side</span>
          </button>
          <button
            className={`mode-btn ${viewMode === 'result_only' ? 'mode-active' : ''}`}
            onClick={() => setViewMode('result_only')}
            title="Full Virtual Try-On Result"
          >
            <Eye size={15} />
            <span>Try-On Full</span>
          </button>
        </div>

        <div className="toolbar-right-actions">
          <button
            className={`tool-toggle-btn ${showDensePoseMesh ? 'toggle-on' : ''}`}
            onClick={() => setShowDensePoseMesh(!showDensePoseMesh)}
            title="Tampilkan layer UV DensePose Wireframe"
          >
            <Activity size={14} />
            <span>DensePose Mesh</span>
          </button>

          <button
            className="btn-trigger-vton"
            onClick={startInference}
            disabled={isRendering}
          >
            <Sparkles size={16} className={isRendering ? 'spin-icon' : ''} />
            <span>{isRendering ? 'Synthesizing...' : 'Generate Video Try-On'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div 
        ref={containerRef}
        className={`video-viewport-wrapper mode-${viewMode}`}
        onMouseDown={(e) => {
          if (viewMode === 'split_slider') {
            setIsDraggingSlider(true);
            handleMouseMove(e);
          }
        }}
      >
        {/* Render Stage 1: SPLIT SLIDER MODE */}
        {viewMode === 'split_slider' && (
          <div className="split-view-container">
            {/* Background: Synthesized Result Video */}
            <div className="split-layer layer-result">
              <video
                ref={resultVideoRef}
                src={selectedVideo.videoUrl}
                playsInline
                loop
                muted
                className="viewport-video video-styled-tryon"
              />
              <div className="viewport-badge badge-result">
                <Sparkles size={12} />
                <span>Ardobe Video Inpainting ({selectedGarment.name})</span>
              </div>
            </div>

            {/* Foreground: Original Source Video clipped to splitPosition */}
            <div 
              className="split-layer layer-source"
              style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
            >
              <video
                ref={sourceVideoRef}
                src={selectedVideo.videoUrl}
                playsInline
                loop
                muted
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="viewport-video"
              />
              <div className="viewport-badge badge-source">
                <span>Original ({selectedVideo.name})</span>
              </div>
            </div>

            {/* Garment accent thumbnail in try-on view */}
            <div 
              className="garment-accent-overlay"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="watermark-garment">
                <img src={selectedGarment.thumbnailUrl} alt="Garment sample" className="watermark-thumb" />
                <span className="watermark-text">{selectedGarment.brandOrStyle}</span>
              </div>
            </div>

            {/* Draggable Vertical Divider Handle */}
            <div 
              className="split-slider-handle"
              style={{ left: `${splitPosition}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
            >
              <div className="handle-line"></div>
              <div className="handle-knob">
                <div className="knob-arrows">◀ ▶</div>
              </div>
            </div>
          </div>
        )}

        {/* Render Stage 2: SIDE-BY-SIDE MODE */}
        {viewMode === 'side_by_side' && (
          <div className="side-by-side-container">
            <div className="side-panel-video">
              <div className="panel-badge-top">Original Input</div>
              <video
                ref={sourceVideoRef}
                src={selectedVideo.videoUrl}
                playsInline
                loop
                muted
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="viewport-video"
              />
            </div>
            <div className="side-panel-video">
              <div className="panel-badge-top panel-badge-accent">
                <Sparkles size={12} /> Ardobe AI Video Try-On
              </div>
              <video
                ref={resultVideoRef}
                src={selectedVideo.videoUrl}
                playsInline
                loop
                muted
                className="viewport-video video-styled-tryon"
              />
            </div>
          </div>
        )}

        {/* Render Stage 3: RESULT ONLY MODE */}
        {viewMode === 'result_only' && (
          <div className="result-only-container">
            <video
              ref={sourceVideoRef}
              src={selectedVideo.videoUrl}
              playsInline
              loop
              muted
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="viewport-video video-styled-tryon"
            />
            <div className="viewport-badge badge-result">
              <Sparkles size={12} />
              <span>Wearing: {selectedGarment.name}</span>
            </div>
          </div>
        )}

        {/* DensePose Mesh Overlay visualizer */}
        {showDensePoseMesh && (
          <div className="densepose-mesh-grid">
            <div className="mesh-indicator-pill">
              DensePose IUV Surface Sampling: 24 Keyframes Active
            </div>
          </div>
        )}

        {/* Render in-progress shimmer bar */}
        {isRendering && (
          <div className="rendering-in-progress-overlay">
            <div className="render-spinner-ring"></div>
            <h3 className="render-stage-headline">{jobState.stageMessage}</h3>
            <div className="render-progress-track">
              <div 
                className="render-progress-fill" 
                style={{ width: `${jobState.progressPercent}%` }}
              ></div>
            </div>
            <span className="render-percent-text">{jobState.progressPercent}% Processed</span>
          </div>
        )}
      </div>

      {/* Synchronized Playback Controls */}
      <div className="player-controls-bottom">
        <div className="controls-row-top">
          <button className="btn-play-pause" onClick={togglePlay} title={isPlaying ? 'Pause (Space)' : 'Play'}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-play" />}
          </button>

          <span className="time-display">
            {formatTime(currentTime)} <span className="time-sep">/</span> {formatTime(duration)}
          </span>

          {/* Timeline Scrubber */}
          <div className="scrubber-container">
            <input
              type="range"
              min={0}
              max={duration || 6}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              className="video-seek-slider"
            />
          </div>

          {/* Speed Selector */}
          <div className="speed-pills">
            {[0.5, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                className={`spd-btn ${playbackSpeed === spd ? 'spd-btn-active' : ''}`}
                onClick={() => setPlaybackSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Banner */}
        {jobState.metrics && (
          <div className="metrics-banner-strip">
            <div className="metric-chip">
              <Clock size={13} className="text-secondary" />
              <span>Render Time: <strong>{jobState.metrics.totalTimeSeconds}s</strong></span>
            </div>
            <div className="metric-chip">
              <Zap size={13} className="text-accent" />
              <span>Temporal Stability: <strong>{jobState.metrics.temporalFlickerScore}%</strong></span>
            </div>
            <div className="metric-chip">
              <CheckCircle size={13} className="text-emerald" />
              <span>Face Preservation: <strong>{jobState.metrics.identityPreservationScore}%</strong></span>
            </div>
            <div className="metric-chip">
              <Activity size={13} className="text-amber" />
              <span>Speed: <strong>{jobState.metrics.inferenceFps} FPS</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
