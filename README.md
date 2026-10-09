# 🧥 Ardobe AI — Motion Wardrobe & Video Virtual Try-On Studio

> **Real-Time Temporal Video Virtual Try-On (VTON) Studio with Pose Guidance, Multi-Category Wardrobe Swapping, and Zero-Flicker Spatial-Temporal Consistency.**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Highlights

* 🎥 **Dual-Mode Video Comparison Player**:
  * **Interactive Split-Screen Slider**: Drag or hover anywhere across the viewport to reveal before/after video try-on in real time.
  * **Side-by-Side Synchronized Playback**: Frame-by-frame synchronized preview between original video and synthetic try-on result.
  * **DensePose 3D Mesh Visualizer**: Toggle surface UV tracking keypoints on the subject.
  * **Full Playback Controls**: Frame scrubbing, 0.5x–2.0x playback speed, play/pause synchronization.
* 👗 **Interactive Multi-Category Wardrobe**:
  * Preset collection spanning *Outerwear*, *Abaya & Dresses*, *Heavyweight Hoodies*, *Formal Blazers*, and *Streetwear Tees*.
  * **Custom Garment Ingestion**: Upload any clothing photo to immediately plug it into the try-on pipeline.
* 📹 **Multi-Source Video Ingestion**:
  * **Live Webcam Recording**: Integrated `MediaRecorder API` with 3-second countdown and 6-second auto-record.
  * **Silhouette Pose Guidance**: Visual wireframe ensuring optimal lighting and torso proportions before recording.
  * **File Upload & Drag-and-Drop**: Supports `.mp4`, `.mov`, `.webm` formats.
* 🧠 **Deep Learning Architecture & Simulator**:
  * 7-stage simulated inference tracking (*DensePose Tracking ➔ SAM Human Parsing ➔ DINOv2 Garment Feature Encoding ➔ Spatial-Temporal Cross-Attention Diffusion ➔ ArcFace Identity Preservation*).
  * Real-time automated QA metrics (Temporal Consistency Score, Face Preservation, Inference FPS).

---

## 📐 AI Pipeline Architecture

```
[Video Source (24 FPS)] ──► [DWPose / DensePose IUV] ──┐
                                                       ├──► [Spatial-Temporal Video UNet] ──► [ArcFace Blending] ──► [H.264 Video]
[Garment Asset]         ──► [DINOv2 + CLIP Latents]   ──┘
```

For full system contracts, failure modes, and latency budgets, see [`docs/architecture.md`](docs/architecture.md).

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/rfahur11/ardobe-vton.git
cd ardobe-vton

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://127.0.0.1:5173/` in your browser.

---

## 🛠️ Project Structure

```
ardobe-vton/
├── docs/
│   └── architecture.md        # Technical architecture, Mermaid diagrams, contracts
├── src/
│   ├── components/
│   │   ├── CaptureStudio.tsx          # Webcam & video file ingestion
│   │   ├── Header.tsx                 # Brand bar & GPU status indicators
│   │   ├── ModelArchitectureDrawer.tsx# AI/ML pipeline blueprint drawer
│   │   ├── PoseOverlay.tsx            # Silhouette & framing guide
│   │   ├── VideoComparisonPlayer.tsx  # Interactive split-screen slider & controls
│   │   └── WardrobePicker.tsx         # Wardrobe carousel & custom clothing upload
│   ├── context/
│   │   └── TryOnContext.tsx           # Global state & multi-stage pipeline simulator
│   ├── data/
│   │   └── mockData.ts                # Preset garments & motion video samples
│   ├── styles/
│   │   └── theme.css                  # Cyber-obsidian design system tokens
│   ├── types/
│   │   └── index.ts                   # Strict TypeScript interfaces
│   ├── App.css
│   ├── App.tsx
│   └── main.tsx
├── SYSTEM_STATE.md            # Living state & feature checklist
└── AGENTS.md                  # Development guidelines & quality verification gates
```

---

## 📄 License
MIT © [rfahur11](https://github.com/rfahur11)
