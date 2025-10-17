import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import BookList from "./BookList";

function EmotionDetector() {
  const videoRef = useRef();
  const [emotion, setEmotion] = useState("");
  const [books, setBooks] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const detectionTimerRef = useRef(null);
  const lastSuggestedEmotionRef = useRef("");
  const [isDetecting, setIsDetecting] = useState(true);

  // Removed local fallback suggestions; always fetch from backend

  useEffect(() => {
    const init = async () => {
      try {
        // Start camera immediately to avoid waiting on model downloads
        startVideo();

        const LOCAL_MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(LOCAL_MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(LOCAL_MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(LOCAL_MODEL_URL),
        ]);
        // quick integrity probe
        if (!faceapi.nets.ssdMobilenetv1.isLoaded || !faceapi.nets.faceExpressionNet.isLoaded || !faceapi.nets.faceLandmark68Net.isLoaded) {
          throw new Error("Model nets not loaded (integrity check failed)");
        }
        setModelsLoaded(true);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    init();
  }, []);

  const startVideo = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia not supported in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        const videoEl = videoRef.current;
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => setVideoReady(true);
        // Some browsers require an explicit play() call
        await videoEl.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const detectEmotion = async () => {
    try {
      if (!modelsLoaded) {
        console.warn("Models not loaded yet.");
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      // Ensure video has started and dimensions are available
      if (video.readyState < 2 || !video.videoWidth) {
        await new Promise((r) => setTimeout(r, 150));
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        console.warn("No face detected. Try better lighting and face the camera.");
        return;
      }

      const best = detections[0];
      const dominant = Object.entries(best.expressions).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      if (dominant !== emotion) {
        setEmotion(dominant);
      }
      // Only fetch if emotion changed (debounce suggestions)
      if (dominant !== lastSuggestedEmotionRef.current) {
        lastSuggestedEmotionRef.current = dominant;
        try {
          const res = await axios.get(`http://localhost:5000/api/books/${dominant}`);
          setBooks(res.data);
        } catch (e) {
          console.error("Books fetch failed:", e);
          setBooks([]);
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  };

  // Start continuous detection when both video and models are ready
  useEffect(() => {
    if (modelsLoaded && videoReady && isDetecting && !detectionTimerRef.current) {
      detectionTimerRef.current = setInterval(() => {
        detectEmotion();
      }, 600);
    }
    return () => {
      if (detectionTimerRef.current && (!modelsLoaded || !videoReady || !isDetecting)) {
        clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
    };
  }, [modelsLoaded, videoReady, isDetecting]);

  const startDetecting = () => {
    setIsDetecting(true);
  };

  const stopDetecting = () => {
    if (detectionTimerRef.current) {
      clearInterval(detectionTimerRef.current);
      detectionTimerRef.current = null;
    }
    setIsDetecting(false);
  };

  // Cleanup on unmount: stop interval and camera tracks
  useEffect(() => {
    return () => {
      if (detectionTimerRef.current) {
        clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
      const video = videoRef.current;
      const stream = video && video.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="row align-items-start g-4">
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="ratio ratio-4x3 bg-dark-subtle rounded overflow-hidden">
              <video ref={videoRef} autoPlay muted playsInline />
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {isDetecting ? (
                <button className="btn btn-outline-secondary" onClick={stopDetecting} disabled={!modelsLoaded}>
                  Stop Detecting
                </button>
              ) : (
                <button className="btn btn-success" onClick={startDetecting} disabled={!modelsLoaded}>
                  Start Detecting
                </button>
              )}
            </div>
            {emotion && <div className="alert alert-info mt-3 mb-0">Your Emotion: <strong>{emotion}</strong></div>}
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="card border-0">
        <div className="card-body p-0 scrollable-book-container">
  <h4 className="mb-3 ">Recommended Books</h4>
  <BookList books={books} />
</div>

        </div>
      </div>
    </div>
  );
}

export default EmotionDetector;

