import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  GarmentItem, 
  VideoSourceData, 
  TryOnJobState, 
  VideoViewMode, 
  InferenceMetrics 
} from '../types';
import { PRESET_GARMENTS, PRESET_VIDEOS } from '../data/mockData';
import { InferenceService, type GPUHealthResponse } from '../services/inferenceService';

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

  gpuHealth: GPUHealthResponse | null;
  isBackendConnected: boolean;

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

  const [gpuHealth, setGpuHealth] = useState<GPUHealthResponse | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

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

  // Check backend hardware telemetry on mount & interval
  useEffect(() => {
    const checkBackend = async () => {
      const health = await InferenceService.fetchGPUHealth();
      if (health) {
        setGpuHealth(health);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

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
    InferenceService.cancelActiveJob();
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
    setJobState({
      jobId: null,
      stage: 'ingesting',
      stageMessage: 'Connecting to inference gateway...',
      progressPercent: 5,
      outputVideoUrl: null,
      metrics: null,
      error: null,
    });

    InferenceService.submitVideoTryOnJob(
      selectedVideo,
      selectedGarment,
      (partial) => {
        setJobState((prev) => ({
          ...prev,
          ...partial,
        }));
      },
      (outputVideoUrl: string, metrics: InferenceMetrics) => {
        setJobState((prev) => ({
          ...prev,
          stage: 'completed',
          stageMessage: 'Video try-on synthesis completed successfully!',
          progressPercent: 100,
          outputVideoUrl,
          metrics,
          error: null,
        }));
      },
      (errorMessage: string) => {
        setJobState((prev) => ({
          ...prev,
          stage: 'failed',
          stageMessage: errorMessage,
          progressPercent: 0,
          error: errorMessage,
        }));
      }
    );
  };

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
        gpuHealth,
        isBackendConnected,
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
