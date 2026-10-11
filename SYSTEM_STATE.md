# 🌐 SYSTEM STATE: Ardobe AI (Video & Photo Virtual Try-On)

> **Repository / Directory**: `d:\porto\ardobe-vton`  
> **GitHub Remote**: [https://github.com/rfahur11/ardobe-vton.git](https://github.com/rfahur11/ardobe-vton.git)  
> **Last Updated**: 2026-10-09  
> **Current Version**: v0.1.0 (Alpha Prototype - Active & Live)  
> **Active Environment**: Development (Vite + React 19 + TypeScript + Vanilla CSS)  
> **Local Server**: `http://127.0.0.1:5173/` (HTTP 200 OK)

---

## 🛠️ 1. Tech Stack Overview
* **Frontend Core**: React 19 / TypeScript / Vite
* **Styling**: Vanilla CSS Cyber-Obsidian Design System (`src/styles/theme.css`, `src/App.css`) — Luxury Dark Mode, Glassmorphism, Fluid Typography (Outfit & Inter), Micro-interactions
* **Vision & Media Ingestion**: MediaRecorder API, HTML5 Video & Canvas 2D, Pose Silhouette Overlay
* **Inference Gateway**: TryOnContext Multi-Stage Pipeline Simulator + Pluggable Cloud Inference Connector
* **AI Model Engine (Architecture Target)**:
  * DensePose / DWPose (Pose Representation)
  * Segment Anything (SAM) / SCHP (Garment Masking)
  * Spatial-Temporal Video Diffusion (IDM-VTON + AnimateAnyone / Champ)
  * InsightFace ArcFace (Face & Skin Identity Guardian)
  * FFmpeg H.264 Multiplexer

---

## 📋 2. Feature Implementation Checklist

### Phase 1: Foundation & High-Fidelity Studio UI
- [x] Layer 1 Project Scaffolding (`docs/architecture.md`, `SYSTEM_STATE.md`, `AGENTS.md`, `.env.example`)
- [x] Modern Design System Tokens (`theme.css`, responsive layout, dark luxury aesthetic)
- [x] Video Ingestion Studio (`src/components/CaptureStudio.tsx`):
  - [x] Webcam Recording (MediaRecorder API, countdown timer 3s, auto stop 6s)
  - [x] Video File Upload (.mp4, .mov, .webm) dengan drag & drop
  - [x] Sample Video Library presets (Runway Walk, Studio Spin, Male Streetwear)
- [x] Pose Guidance Overlay (`src/components/PoseOverlay.tsx`):
  - [x] Interactive silhouette SVG & framing guide
  - [x] Real-time alignment indicator tag
- [x] Interactive Wardrobe Catalog (`src/components/WardrobePicker.tsx`):
  - [x] Koleksi multi-kategori (All, Outerwear, Abaya/Gaun, Hoodie, Tops)
  - [x] Custom garment image upload (instant asset injection)
  - [x] Attribute cards (fabric, style tag, color dots)
- [x] Dual-Mode Comparison Video Player (`src/components/VideoComparisonPlayer.tsx`):
  - [x] Interactive Before/After Split Slider dengan draggable handle
  - [x] Side-by-Side Synchronized Playback
  - [x] Try-On Result Only & Source Only modes
  - [x] Video Timeline scrubber, Play/Pause synchronization, Speed selector (0.5x, 1x, 1.5x, 2x)
  - [x] DensePose UV Mesh visualizer toggle
- [x] AI Inference Pipeline Simulator:
  - [x] 7-stage progress visualizer (Ingesting ➔ Sampling ➔ DensePose ➔ DINOv2 ➔ Spatial-Temporal Cross-Attention ➔ Identity Restoration ➔ FFmpeg Multiplexing)
  - [x] Live automated metrics banner (Render time, Temporal Stability %, Face Preservation %, FPS)
- [x] ML Architecture & Specification Drawer (`src/components/ModelArchitectureDrawer.tsx`):
  - [x] Pipeline breakdown specs (01 - 05)
  - [x] Edge vs Cloud Latency Budget table
  - [x] QA automated quality gates (SSIM, CLIP-I, ArcFace similarity)

### Phase 2: AI/ML Backend Architecture & MLOps (Agent Orion & Dante)
- [x] Detailed Deep Learning & MLOps Blueprint ([`docs/model_pipeline_specs.md`](file:///d:/porto/ardobe-vton/docs/model_pipeline_specs.md))
- [x] Python FastAPI Async Inference Gateway ([`inference_server/main.py`](file:///d:/porto/ardobe-vton/inference_server/main.py))
- [x] VTON Temporal Video Pipeline Orchestrator ([`inference_server/pipelines/vton_video_pipeline.py`](file:///d:/porto/ardobe-vton/inference_server/pipelines/vton_video_pipeline.py))
- [x] Dante's MLOps Model Quantizer & Benchmarking Foundry ([`inference_server/mlops/quantizer.py`](file:///d:/porto/ardobe-vton/inference_server/mlops/quantizer.py))
- [x] Telemetry, Hardware VRAM Monitor & Quality Gates ([`inference_server/core/telemetry.py`](file:///d:/porto/ardobe-vton/inference_server/core/telemetry.py))
- [x] Production CUDA 12.2 Docker Container ([`inference_server/Dockerfile.gpu`](file:///d:/porto/ardobe-vton/inference_server/Dockerfile.gpu))
- [x] Pydantic Strict Data Contracts & Schemas ([`inference_server/schemas/api_schemas.py`](file:///d:/porto/ardobe-vton/inference_server/schemas/api_schemas.py))

### Phase 3: Mobile Native Adaptation
- [ ] React Native / Flutter Shell wrapper
- [ ] On-device MediaPipe Camera bridge

---

## 🚀 3. Local Runbook
```bash
# Masuk ke folder proyek
cd d:\porto\ardobe-vton

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev -- --host 127.0.0.1

# Akses via browser
http://127.0.0.1:5173/
```
