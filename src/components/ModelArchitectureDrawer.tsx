import React from 'react';
import { X, Layers, Cpu, Server, ShieldCheck } from 'lucide-react';

interface ModelArchitectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureDrawer: React.FC<ModelArchitectureDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container glass-panel-glow" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-title">
            <Layers size={22} className="text-accent" />
            <div>
              <h3>AI/ML Model & System Architecture</h3>
              <p>Technical Blueprint: Video Virtual Try-On Pipeline</p>
            </div>
          </div>
          <button className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Section 1: Pipeline Breakdown */}
          <section className="drawer-section">
            <h4 className="section-title">
              <Cpu size={16} className="text-secondary" />
              1. Deep Learning Pipeline (Temporal Diffusion VTON)
            </h4>
            <div className="pipeline-steps-grid">
              <div className="step-card">
                <span className="step-num">01</span>
                <h5>Video Ingestion & Pose</h5>
                <p>Ekstraksi frame 24 FPS. DensePose mendeteksi UV coordinate tubuh 3D untuk mapping baju berpresisi tinggi tanpa warping artefak.</p>
                <div className="tech-badge">DWPose / DensePose IUV</div>
              </div>

              <div className="step-card">
                <span className="step-num">02</span>
                <h5>Human Parsing & Masking</h5>
                <p>Segmentasi dinamis memisahkan baju lama dari area kulit, leher, tangan, dan rambut pengguna agar tidak terhapus.</p>
                <div className="tech-badge">Segment Anything (SAM) / SCHP</div>
              </div>

              <div className="step-card">
                <span className="step-num">03</span>
                <h5>Garment Latent Encoding</h5>
                <p>Ekstraksi tekstur kain resolusi tinggi, kancing, motif, dan jahitan baju target ke dalam latent space.</p>
                <div className="tech-badge">DINOv2 + CLIP ViT-H/14</div>
              </div>

              <div className="step-card">
                <span className="step-num">04</span>
                <h5>Spatial-Temporal Video UNet</h5>
                <p>Diffusion inpainting frame-by-frame dengan Cross-Attention temporal untuk mencegah flickering antar-frame saat bergerak.</p>
                <div className="tech-badge">AnimateAnyone / IDM-VTON Core</div>
              </div>

              <div className="step-card">
                <span className="step-num">05</span>
                <h5>Identity Preservation</h5>
                <p>Blending wajah dan skin tone asli dengan face similarity verification &gt; 98%.</p>
                <div className="tech-badge">InsightFace (ArcFace) + Bilateral Filter</div>
              </div>
            </div>
          </section>

          {/* Section 2: Hybrid Edge-Cloud Distribution */}
          <section className="drawer-section">
            <h4 className="section-title">
              <Server size={16} className="text-emerald" />
              2. Edge vs Cloud Latency Budget
            </h4>
            <div className="table-wrapper">
              <table className="arch-table">
                <thead>
                  <tr>
                    <th>Komponen</th>
                    <th>Runtime</th>
                    <th>Latency Target</th>
                    <th>Tanggung Jawab</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Camera Pose Tracking</strong></td>
                    <td><span className="badge-edge">Mobile / Web Edge</span></td>
                    <td>&lt; 16 ms (60 FPS)</td>
                    <td>MediaPipe Pose silhouette & panduan posisi badan</td>
                  </tr>
                  <tr>
                    <td><strong>Frame Quality Gate</strong></td>
                    <td><span className="badge-edge">Mobile / Web Edge</span></td>
                    <td>&lt; 50 ms</td>
                    <td>Deteksi blur, backlight gelap, framing torso</td>
                  </tr>
                  <tr>
                    <td><strong>Video Try-On Inpainting</strong></td>
                    <td><span className="badge-cloud">Cloud GPU (A10G / L4)</span></td>
                    <td>3.5 – 5.0 detik</td>
                    <td>Spatial-Temporal Cross-Attention diffusion</td>
                  </tr>
                  <tr>
                    <td><strong>Video Multiplexing</strong></td>
                    <td><span className="badge-cloud">Cloud Worker</span></td>
                    <td>&lt; 800 ms</td>
                    <td>FFmpeg H.264 encode + Audio sync pass</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: QA Automated Quality Gates */}
          <section className="drawer-section">
            <h4 className="section-title">
              <ShieldCheck size={16} className="text-amber" />
              3. QA Automated Quality Gates
            </h4>
            <div className="qa-metrics-grid">
              <div className="qa-item">
                <div className="qa-score">98.4%</div>
                <div className="qa-name">Temporal Consistency Score</div>
                <div className="qa-desc">Memastikan tidak ada kedipan (flickering) atau distorsi antar-frame berturutan.</div>
              </div>
              <div className="qa-item">
                <div className="qa-score">&gt; 0.90</div>
                <div className="qa-name">Garment Texture CLIP-I</div>
                <div className="qa-desc">Kesesuaian tekstur, warna, dan logo pakaian hasil render dengan foto asli katalog.</div>
              </div>
              <div className="qa-item">
                <div className="qa-score">&gt; 0.95</div>
                <div className="qa-name">Face Cosine Similarity</div>
                <div className="qa-desc">Memastikan struktur wajah, mata, dan rambut pengguna tetap identik 100%.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
