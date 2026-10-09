"""
Ardobe AI - Core Configuration & Environment Settings
Architected by: Agent Dante (MLOps Lead)
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    APP_NAME: str = "Ardobe AI Inference Gateway"
    APP_VERSION: str = "1.0.0-prod"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # MLOps & Hardware Acceleration
    DEVICE: str = "cuda" if os.getenv("FORCE_CPU") != "1" else "cpu"
    DEFAULT_PRECISION: str = "fp16"  # "fp32", "fp16", "int8"
    ENABLE_TENSORRT: bool = True
    MAX_BATCH_FRAMES: int = 48
    MAX_VIDEO_DURATION_SEC: int = 15

    # Storage Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    CHECKPOINTS_DIR: Path = BASE_DIR / "checkpoints"
    OUTPUTS_DIR: Path = BASE_DIR / "outputs"
    TEMP_DIR: Path = BASE_DIR / "tmp"

    # Model Weights Identifiers (HuggingFace / Local)
    DENSEPOSE_MODEL_PATH: str = "checkpoints/densepose_r50_fpn.pth"
    SAM_MODEL_PATH: str = "checkpoints/sam_vit_h_4b8939.pth"
    VTON_UNET_PATH: str = "checkpoints/animateanyone_vton_unet_fp16.safetensors"
    DINOV2_MODEL_NAME: str = "facebook/dinov2-base"
    INSIGHTFACE_MODEL_PATH: str = "checkpoints/buffalo_l"

    # Async Queue & Redis (Optional / Fallback to in-memory)
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    USE_MOCK_FALLBACK: bool = True  # Allows testing without downloading 20GB of model weights

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure required directories exist
settings.CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
settings.OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
settings.TEMP_DIR.mkdir(parents=True, exist_ok=True)
