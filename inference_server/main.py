"""
Ardobe AI - Production FastAPI Inference Gateway
Orchestrated by: Agent Orion (Deep Learning Lead) & Agent Dante (MLOps Lead)
"""

import time
import uuid
import asyncio
from typing import Dict, Any
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from core.config import settings
from core.telemetry import telemetry
from schemas.api_schemas import (
    VideoTryOnRequest,
    TryOnJobResponse,
    TryOnStage,
    GPUHealthStatus,
)
from pipelines.vton_video_pipeline import pipeline_instance
from mlops.quantizer import quantizer

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="High-Throughput Temporal Video Virtual Try-On Engine with Zero-Flicker Spatial-Temporal Consistency",
)

# CORS Middleware for Web & Mobile Clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Active Jobs Store (Can be swapped with Redis by Dante)
ACTIVE_JOBS: Dict[str, TryOnJobResponse] = {}


async def _run_job_worker(job_id: str, request: VideoTryOnRequest):
    async def update_progress(stage: TryOnStage, message: str, percentage: int):
        if job_id in ACTIVE_JOBS:
            job = ACTIVE_JOBS[job_id]
            job.status = stage
            job.stage_message = message
            job.progress_percentage = percentage
            job.updated_at = time.time()

    try:
        result = await pipeline_instance.execute_tryon(request, progress_callback=update_progress)
        if job_id in ACTIVE_JOBS:
            job = ACTIVE_JOBS[job_id]
            job.status = TryOnStage.COMPLETED
            job.stage_message = "Video try-on synthesis completed successfully!"
            job.progress_percentage = 100
            job.output_video_url = result["output_video_url"]
            job.metrics = result["metrics"]
            job.updated_at = time.time()
    except Exception as exc:
        if job_id in ACTIVE_JOBS:
            job = ACTIVE_JOBS[job_id]
            job.status = TryOnStage.FAILED
            job.stage_message = f"Inference failure: {str(exc)}"
            job.error = str(exc)
            job.updated_at = time.time()
        telemetry.failed_jobs += 1


@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "device": settings.DEVICE,
        "docs_url": "/docs",
    }


@app.post("/api/v1/tryon/video", response_model=TryOnJobResponse)
async def create_video_tryon_job(
    request: VideoTryOnRequest, background_tasks: BackgroundTasks
):
    """
    Submits a video try-on job and executes asynchronously.
    """
    job_id = f"job_{uuid.uuid4().hex[:10]}"
    now = time.time()

    initial_job = TryOnJobResponse(
        job_id=job_id,
        status=TryOnStage.QUEUED,
        stage_message="Job queued for GPU inference worker...",
        progress_percentage=0,
        output_video_url=None,
        metrics=None,
        error=None,
        created_at=now,
        updated_at=now,
    )
    ACTIVE_JOBS[job_id] = initial_job

    # Dispatch to background task worker
    background_tasks.add_task(_run_job_worker, job_id, request)
    return initial_job


@app.get("/api/v1/jobs/{job_id}", response_model=TryOnJobResponse)
async def get_job_status(job_id: str):
    """
    Queries current stage and progress of an active try-on job.
    """
    if job_id not in ACTIVE_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return ACTIVE_JOBS[job_id]


@app.get("/api/v1/jobs/{job_id}/stream")
async def stream_job_progress(job_id: str):
    """
    Server-Sent Events (SSE) live progress feed for frontend clients.
    """
    if job_id not in ACTIVE_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")

    async def event_generator():
        while True:
            job = ACTIVE_JOBS.get(job_id)
            if not job:
                break

            payload = job.model_dump_json()
            yield f"data: {payload}\n\n"

            if job.status in [TryOnStage.COMPLETED, TryOnStage.FAILED]:
                break

            await asyncio.sleep(0.4)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/health/gpu", response_model=GPUHealthStatus)
async def get_gpu_health():
    """
    Orion AI Hardware Telemetry endpoint.
    """
    return telemetry.get_hardware_status()


@app.get("/metrics")
async def get_mlops_telemetry():
    """
    Dante MLOps System Observability Snapshot.
    """
    return telemetry.get_system_snapshot()


@app.get("/api/v1/benchmarks")
async def get_quantization_benchmarks():
    """
    Retrieves MLOps quantization performance benchmarks.
    """
    return quantizer.benchmark_precision_profiles()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
