"""
Ardobe AI - Data Contracts & Pydantic Schemas
Architected by: Agent Sophia (Analyst) & Agent Orion (AI/Vision)
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TryOnStage(str, Enum):
    QUEUED = "queued"
    INGESTING = "ingesting"
    EXTRACTING_FRAMES = "extracting_frames"
    DENSEPOSE_TRACKING = "densepose_tracking"
    GARMENT_FEATURE_ENCODING = "garment_feature_encoding"
    DIFFUSION_CROSS_ATTENTION = "diffusion_cross_attention"
    IDENTITY_RESTORATION = "identity_restoration"
    VIDEO_MULTIPLEXING = "video_multiplexing"
    COMPLETED = "completed"
    FAILED = "failed"


class ResolutionTarget(str, Enum):
    RES_720P = "720p"
    RES_1080P = "1080p"


class PrecisionMode(str, Enum):
    FP32 = "fp32"
    FP16 = "fp16"
    INT8 = "int8"


class VideoTryOnRequest(BaseModel):
    video_url: str = Field(..., description="URL or data URI of source input video")
    garment_id: str = Field(..., description="Identifier of the target garment")
    garment_image_url: Optional[str] = Field(None, description="Optional custom garment image URL")
    target_resolution: ResolutionTarget = Field(ResolutionTarget.RES_720P, description="Output video resolution")
    preserve_face: bool = Field(True, description="Enforce ArcFace facial & skin tone fidelity")
    temporal_smoothing: float = Field(0.85, ge=0.0, le=1.0, description="Temporal attention anti-flicker strength")
    precision: PrecisionMode = Field(PrecisionMode.FP16, description="Model quantization precision")


class MLOpsMetrics(BaseModel):
    inference_time_sec: float
    fps: float
    frames_count: int
    temporal_flicker_score: float = Field(..., description="0-100% consistency score (higher is smoother)")
    face_similarity_score: float = Field(..., description="ArcFace cosine similarity (0.0 - 1.0)")
    garment_fidelity_clip_i: float = Field(..., description="CLIP-I texture alignment score")
    gpu_vram_peak_mb: float
    precision_used: str


class TryOnJobResponse(BaseModel):
    job_id: str
    status: TryOnStage
    stage_message: str
    progress_percentage: int
    output_video_url: Optional[str] = None
    metrics: Optional[MLOpsMetrics] = None
    error: Optional[str] = None
    created_at: float
    updated_at: float


class GPUHealthStatus(BaseModel):
    cuda_available: bool
    device_name: str
    device_count: int
    vram_total_mb: float
    vram_allocated_mb: float
    vram_reserved_mb: float
    cuda_version: Optional[str] = None
