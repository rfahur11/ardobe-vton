import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { 
  GarmentItem, 
  VideoSourceData, 
  TryOnJobState, 
  VideoViewMode, 
  InferenceStage, 
  InferenceMetrics 
} from '../types';
import { PRESET_GARMENTS, PRESET_VIDEOS } from '../data/mockData';

interface TryOnContextType {
  selectedGarment: GarmentItem;
  setSelectedGarment: (garment: GarmentItem) => void;
  allGarments: GarmentItem[];
  addCustomGarment: (garment: GarmentItem) => void;
  
  selectedVideo: VideoSourceData;
  setSelectedVideo: (video: VideoSourceData) => void;
  allVideos: VideoSourceData[];
  addCustomVideo: (video: VideoSourceData) => void;

  jobState: TryOnJobState;
  startInference: () => void;
  resetInference: () => void;

  viewMode: VideoViewMode;
  setViewMode: (mode: VideoViewMode) => void;
  splitPosition: number;
  setSplitPosition: (pos: number) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined);

export const TryOnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allGarments, setAllGarments] = useState<GarmentItem[]>(PRESET_GARMENTS);
  const [selectedGarment, setSelectedGarment] = useState<GarmentItem>(PRESET_GARMENTS[0]);

  const [allVideos, setAllVideos] = useState<VideoSourceData[]>(PRESET_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoSourceData>(PRESET_VIDEOS[0]);

  const [viewMode, setViewMode] = useState<VideoViewMode>('split_slider');
  const [splitPosition, setSplitPosition] = useState<number>(50);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [jobState, setJobState] = useState<TryOnJobState>({
    jobId: null,
    stage: 'completed',
    stageMessage: 'Ready for motion try-on render',
    progressPercent: 100,
    outputVideoUrl: PRESET_VIDEOS[0].videoUrl,
    metrics: {
      totalTimeSeconds: 4.8,
      temporalFlickerScore: 98.4,
      identityPreservationScore: 99.1,
      framesProcessed: 172,
      inferenceFps: 35.8,
    },
    error: null,
  });

  const timerRef = useRef<number | null>(null);

  const addCustomGarment = (garment: GarmentItem) => {
    setAllGarments((prev) => [garment, ...prev]);
    setSelectedGarment(garment);
  };

  const addCustomVideo = (video: VideoSourceData) => {
    setAllVideos((prev) => [video, ...prev]);
    setSelectedVideo(video);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetInference = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setJobState({
      jobId: null,
      stage: 'idle',
      stageMessage: 'Ready to generate virtual try-on',
      progressPercent: 0,
      outputVideoUrl: null,
      metrics: null,
      error: null,
    });
  };

  const startInference = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const stages: { stage: InferenceStage; message: string; durationMs: number; progress: number }[] = [
      { stage: 'ingesting', message: 'Decoding source video stream & extracting audio...', durationMs: 800, progress: 12 },
      { stage: 'extracting_frames', message: 'Sampling keyframes & running spatial normalization...', durationMs: 900, progress: 28 },
      { stage: 'densepose_tracking', message: 'Tracking 3D DensePose surface mesh & human parsing...', durationMs: 1200, progress: 48 },
      { stage: 'garment_feature_encoding', message: 'Extracting DINOv2 texture latents & UV warping garment...', durationMs: 1100, progress: 68 },
      { stage: 'diffusion_cross_attention', message: 'Spatial-Temporal Video Diffusion denoising (24 steps)...', durationMs: 1600, progress: 85 },
      { stage: 'identity_restoration', message: 'ArcFace identity preservation & skin-tone blending...', durationMs: 900, progress: 95 },
      { stage: 'video_multiplexing', message: 'FFmpeg H.264 temporal smoothing & remuxing final clip...', durationMs: 700, progress: 100 },
    ];

    const jobId = 'job_' + Math.random().toString(36).substring(2, 9);

    setJobState({
      jobId,
      stage: 'ingesting',
      stageMessage: stages[0].message,
      progressPercent: 5,
      outputVideoUrl: null,
      metrics: null,
      error: null,
    });

    const runStage = (index: number) => {
      if (index >= stages.length) {
        const simulatedMetrics: InferenceMetrics = {
          totalTimeSeconds: Number((Math.random() * 2 + 3.8).toFixed(1)),
          temporalFlickerScore: Number((Math.random() * 3 + 96.5).toFixed(1)),
          identityPreservationScore: Number((Math.random() * 2 + 97.8).toFixed(1)),
          framesProcessed: Math.round((selectedVideo.durationSeconds || 6) * 24),
          inferenceFps: Number((Math.random() * 5 + 32).toFixed(1)),
        };

        setJobState({
          jobId,
          stage: 'completed',
          stageMessage: 'Video try-on synthesis completed with 98%+ temporal stability!',
          progressPercent: 100,
          outputVideoUrl: selectedVideo.videoUrl,
          metrics: simulatedMetrics,
          error: null,
        });
        return;
      }

      const st = stages[index];
      setJobState((prev) => ({
        ...prev,
        stage: st.stage,
        stageMessage: st.message,
        progressPercent: st.progress,
      }));

      timerRef.current = window.setTimeout(() => {
        runStage(index + 1);
      }, st.durationMs);
    };

    runStage(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <TryOnContext.Provider
      value={{
        selectedGarment,
        setSelectedGarment,
        allGarments,
        addCustomGarment,
        selectedVideo,
        setSelectedVideo,
        allVideos,
        addCustomVideo,
        jobState,
        startInference,
        resetInference,
        viewMode,
        setViewMode,
        splitPosition,
        setSplitPosition,
        isPlaying,
        setIsPlaying,
        togglePlay,
        playbackSpeed,
        setPlaybackSpeed,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
};

export const useTryOn = () => {
  const context = useContext(TryOnContext);
  if (!context) {
    throw new Error('useTryOn must be used within a TryOnProvider');
  }
  return context;
};
