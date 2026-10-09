import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Film, Video, StopCircle, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';
import type { VideoSourceData } from '../types';
import { PoseOverlay } from './PoseOverlay';

export const CaptureStudio: React.FC = () => {
  const { allVideos, selectedVideo, setSelectedVideo, addCustomVideo } = useTryOn();
  const [activeTab, setActiveTab] = useState<'presets' | 'webcam' | 'upload'>('presets');

  // Webcam State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoStreamRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<number | null>(null);

  // Upload State
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoStreamRef.current) {
        videoStreamRef.current.srcObject = stream;
        videoStreamRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Silakan periksa izin browser.');
    }
  };

  const stopCameraStream = () => {
    if (videoStreamRef.current && videoStreamRef.current.srcObject) {
      const stream = videoStreamRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoStreamRef.current.srcObject = null;
    }
    setIsRecording(false);
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
  };

  const handleStartRecording = () => {
    if (!videoStreamRef.current || !videoStreamRef.current.srcObject) return;

    setCountdown(3);
    const countTimer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          triggerActualRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerActualRecording = () => {
    if (!videoStreamRef.current?.srcObject) return;
    recordedChunksRef.current = [];
    const stream = videoStreamRef.current.srcObject as MediaStream;

    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const newVideo: VideoSourceData = {
          id: 'webcam-capture-' + Date.now(),
          name: `Self Video (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
          type: 'webcam',
          videoUrl,
          durationSeconds: recordingSeconds || 5,
          aspectRatio: '9:16',
          hasPoseDetected: true,
          modelDescription: 'Recorded via live webcam camera',
        };
        addCustomVideo(newVideo);
        stopCameraStream();
        setActiveTab('presets');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 6) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e) {
      console.error('Recording initialization error:', e);
      setCameraError('Browser tidak mendukung perekaman video webm.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    setIsRecording(false);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Mohon pilih file video valid (.mp4, .mov, .webm)');
      return;
    }
    const url = URL.createObjectURL(file);
    const newVideo: VideoSourceData = {
      id: 'custom-video-' + Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: 'upload',
      videoUrl: url,
      durationSeconds: 6,
      aspectRatio: '9:16',
      hasPoseDetected: true,
      modelDescription: `Uploaded file (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
    };
    addCustomVideo(newVideo);
    setActiveTab('presets');
  };

  return (
    <div className="capture-studio glass-panel">
      <div className="studio-tabs">
        <button
          className={`tab-btn ${activeTab === 'presets' ? 'tab-active' : ''}`}
          onClick={() => {
            stopCameraStream();
            setActiveTab('presets');
          }}
        >
          <Film size={16} />
          <span>Preset Library</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'webcam' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('webcam');
            startCamera();
          }}
        >
          <Camera size={16} />
          <span>Live Record</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'tab-active' : ''}`}
          onClick={() => {
            stopCameraStream();
            setActiveTab('upload');
          }}
        >
          <Upload size={16} />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="studio-tab-content">
        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="presets-grid">
            {allVideos.map((vid) => {
              const isSelected = selectedVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  className={`preset-card ${isSelected ? 'preset-selected' : ''}`}
                  onClick={() => setSelectedVideo(vid)}
                >
                  <div className="preset-thumb-wrap">
                    {vid.thumbnailUrl ? (
                      <img src={vid.thumbnailUrl} alt={vid.name} className="preset-thumb" />
                    ) : (
                      <div className="preset-placeholder">
                        <Video size={24} className="text-secondary" />
                      </div>
                    )}
                    <span className="preset-duration">{vid.durationSeconds}s</span>
                    {isSelected && (
                      <div className="selected-badge">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                  <div className="preset-meta">
                    <h4 className="preset-title">{vid.name}</h4>
                    <p className="preset-desc">{vid.modelDescription}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: WEBCAM */}
        {activeTab === 'webcam' && (
          <div className="webcam-container">
            {cameraError ? (
              <div className="camera-error-box">
                <AlertCircle size={28} className="text-rose" />
                <p>{cameraError}</p>
                <button className="btn-secondary" onClick={startCamera}>
                  <RefreshCw size={14} /> Coba Lagi
                </button>
              </div>
            ) : (
              <div className="webcam-viewport">
                <video
                  ref={videoStreamRef}
                  autoPlay
                  playsInline
                  muted
                  className="webcam-video-element"
                />
                
                {/* Silhouette & Pose Overlay */}
                <PoseOverlay isAligned={true} statusText={isRecording ? `Perekaman Aktif: ${recordingSeconds}s / 6s` : 'Posisikan tubuh dalam silhouette'} />

                {countdown !== null && (
                  <div className="countdown-overlay">
                    <span className="countdown-number">{countdown}</span>
                    <span className="countdown-sub">Siap dalam posisi...</span>
                  </div>
                )}

                <div className="webcam-controls-bar">
                  {!isRecording ? (
                    <button
                      className="btn-record"
                      onClick={handleStartRecording}
                      disabled={countdown !== null}
                    >
                      <div className="record-dot"></div>
                      <span>Mulai Rekam 6s</span>
                    </button>
                  ) : (
                    <button className="btn-stop-record" onClick={handleStopRecording}>
                      <StopCircle size={18} />
                      <span>Selesai ({recordingSeconds}s)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPLOAD */}
        {activeTab === 'upload' && (
          <div
            className={`upload-dropzone ${dragActive ? 'dropzone-active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="dropzone-icon-ring">
              <Upload size={32} className="text-accent" />
            </div>
            <h3 className="dropzone-title">Tarik & Letakkan Video ke Sini</h3>
            <p className="dropzone-sub">Mendukung MP4, MOV, WebM (Maks. 50 MB, Disarankan 5–15 detik)</p>
            <button className="btn-browse">Pilih dari Komputer</button>
          </div>
        )}
      </div>
    </div>
  );
};
