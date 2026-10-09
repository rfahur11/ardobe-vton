export type GarmentCategory = 'all' | 'uniforms' | 'outerwear' | 'tops' | 'dresses_abaya' | 'hoodies';

export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentCategory;
  thumbnailUrl: string;
  hdGarmentUrl: string;
  brandOrStyle: string;
  tag: string;
  fabric: string;
  colors: string[];
  neckShape?: 'v_neck' | 'crew_neck' | 'collar' | 'hoodie' | 'robe';
  torsoFit?: 'fitted' | 'loose' | 'oversized' | 'fullbody';
}

export type InputSourceType = 'sample' | 'webcam' | 'upload';

export interface VideoSourceData {
  id: string;
  name: string;
  type: InputSourceType;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  aspectRatio: string;
  hasPoseDetected: boolean;
  modelDescription?: string;
}

export type InferenceStage = 
  | 'idle'
  | 'ingesting'
  | 'extracting_frames'
  | 'densepose_tracking'
  | 'garment_feature_encoding'
  | 'diffusion_cross_attention'
  | 'identity_restoration'
  | 'video_multiplexing'
  | 'completed'
  | 'failed';

export interface InferenceMetrics {
  totalTimeSeconds: number;
  temporalFlickerScore: number; // 0 - 100 (higher is smoother)
  identityPreservationScore: number; // 0 - 100%
  framesProcessed: number;
  inferenceFps: number;
}

export interface TryOnJobState {
  jobId: string | null;
  stage: InferenceStage;
  stageMessage: string;
  progressPercent: number;
  outputVideoUrl: string | null;
  metrics: InferenceMetrics | null;
  error: string | null;
}

export type VideoViewMode = 'split_slider' | 'side_by_side' | 'result_only' | 'source_only';
