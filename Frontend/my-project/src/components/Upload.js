import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import { 
  Upload as UploadIcon, 
  Search, 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  FileVideo,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Target
} from "lucide-react";
import { useVideo } from "../context/VideoContext";
import './UploadMarker.css';

function Upload() {
  // Use context for persistent state
  const {
    file, setFile,
    sceneDescription, setSceneDescription,
    resultTimestamp, setResultTimestamp,
    error, setError
  } = useVideo();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showSavedVideos, setShowSavedVideos] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);

  const playerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setResultTimestamp(null);
      setError(null);
      setUploadProgress(0);
      toast.success("Video uploaded successfully!");
    } else {
      toast.error("Please select a valid video file.");
    }
  }, [setError, setFile, setResultTimestamp]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
    },
    multiple: false
  });

  // Handle upload area click
  const handleUploadAreaClick = () => {
    setShowUploadOptions(true);
  };

  // Combine dropzone props with click handler
  const uploadAreaProps = {
    ...getRootProps(),
    onClick: handleUploadAreaClick
  };

  const handleDescriptionChange = (event) => {
    setSceneDescription(event.target.value);
  };

  const handleSearchScene = async () => {
    if (!file) {
      toast.error("Please select a video file.");
      return;
    }
    if (!sceneDescription.trim()) {
      toast.error("Please enter a scene description.");
      return;
    }

    setLoading(true);
    setResultTimestamp(null);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("sceneDescription", sceneDescription.trim());

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("http://127.0.0.1:5000/process_video", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        setResultTimestamp(data.timestamp);
        toast.success("Scene found successfully!");
        console.log("Scene search successful:", data.message, "Timestamp:", data.timestamp);

        // Auto-seek to timestamp if available and valid
        if (data.timestamp && playerRef.current) {
          const parts = data.timestamp.split(":").map(Number);
          if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
            const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            if (!isNaN(totalSeconds) && (!duration || totalSeconds <= duration)) {
              // Use a more reliable seeking approach
              const seekToTimestamp = () => {
                if (playerRef.current && duration > 0) {
                  console.log("Seeking to:", totalSeconds, "seconds");
                  playerRef.current.seekTo(totalSeconds);
                  // Don't auto-play, let user control
                  toast.success(`Jumped to ${data.timestamp}`);
                } else if (playerRef.current) {
                  console.log("Player ready but no duration, retrying...");
                  setTimeout(seekToTimestamp, 500);
                } else {
                  console.log("Player not ready, retrying...");
                  setTimeout(seekToTimestamp, 1000);
                }
              };
              
              // Wait for player to be fully ready
              setTimeout(seekToTimestamp, 2000);
            } else {
              toast.error("Timestamp is out of video range.");
              console.error("Timestamp out of range:", totalSeconds, "Duration:", duration);
            }
          } else {
            toast.error("Invalid timestamp format from backend.");
            console.error("Invalid timestamp format:", data.timestamp);
          }
        }
      } else {
        // Handle different error status codes
        if (response.status === 404) {
          setError(data.error || "Scene not found in the video. Try describing it differently.");
          toast.error("Scene not found. Try a different description.");
        } else {
          setError(data.error || "An unknown error occurred during scene search.");
          toast.error(data.error || "Scene search failed.");
        }
        console.error("Scene search failed:", data.error);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please ensure the backend is running and accessible.");
      toast.error("Connection failed. Please check your backend server.");
      console.error("Error connecting to backend:", err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSceneDescription("");
    setResultTimestamp(null);
    setError(null);
    setUploadProgress(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayerDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekToTimestamp = () => {
    if (!resultTimestamp || !playerRef.current) {
      toast.error("No valid timestamp to seek to.");
      console.warn("No valid timestamp or player ref.", { resultTimestamp, playerRef });
      return;
    }
    const parts = resultTimestamp.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      toast.error("Invalid timestamp format from backend.");
      console.error("Invalid timestamp format:", resultTimestamp);
      return;
    }
    const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      toast.error("Invalid timestamp value.");
      console.error("Invalid total seconds:", totalSeconds);
      return;
    }
    if (duration && totalSeconds > duration) {
      toast.error("Timestamp is beyond video duration.");
      console.error("Timestamp out of range:", totalSeconds, "Duration:", duration);
      return;
    }
    
    console.log("Manually seeking to seconds:", totalSeconds, "from timestamp:", resultTimestamp);
    
    // Ensure player is ready and seek
    const seekToTimestamp = () => {
      if (playerRef.current && duration > 0) {
        playerRef.current.seekTo(totalSeconds);
        // Don't auto-play, let user control
        toast.success(`Jumped to ${resultTimestamp}`);
        console.log("Successfully sought to:", totalSeconds, "seconds");
      } else if (playerRef.current) {
        console.log("Player ready but no duration, retrying...");
        setTimeout(seekToTimestamp, 300);
      } else {
        console.log("Player not ready for manual seek, retrying...");
        setTimeout(seekToTimestamp, 500);
      }
    };
    
    seekToTimestamp();
  };

  // Helper to get marker position as percent
  const getMarkerPercent = () => {
    if (!resultTimestamp || !duration) return null;
    const parts = resultTimestamp.split(":").map(Number);
    if (parts.length !== 3) return null;
    const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (isNaN(totalSeconds) || totalSeconds < 0 || totalSeconds > duration) return null;
    return (totalSeconds / duration) * 100;
  };

  // Memoize video URL to prevent unnecessary re-renders
  const memoizedVideoUrl = React.useMemo(() => {
    try {
      if (file && file instanceof File) {
        return URL.createObjectURL(file);
      }
      return null;
    } catch (error) {
      console.error("Error creating video URL:", error);
      return null;
    }
  }, [file]);

  // Cleanup URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      if (memoizedVideoUrl) {
        URL.revokeObjectURL(memoizedVideoUrl);
      }
    };
  }, [memoizedVideoUrl]);

  // Save to Library handler
  const handleSaveToLibrary = () => {
    if (!file) return;
    
    try {
      const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
      
      // Check if video already exists by name and size
      if (savedVideos.some(v => v.name === file.name && v.size === file.size)) {
        toast("Video already saved to library.", { icon: "ℹ️" });
        return;
      }
      
      // Store only metadata, not the full video file
      const videoMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        date: new Date().toISOString(),
        id: Date.now().toString(),
        // Store a reference to the current file object (temporary)
        fileRef: file
      };
      
      savedVideos.push(videoMetadata);
      
      // Try to save to localStorage
      try {
        localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
        toast.success("Video metadata saved to library!");
        console.log("Video metadata saved:", videoMetadata);
      } catch (storageError) {
        // If localStorage is full, try to clean up old entries
        if (storageError.name === 'QuotaExceededError') {
          console.warn("localStorage quota exceeded, cleaning up old entries...");
          
          // Remove oldest entries to make space
          const maxEntries = 10; // Keep only 10 most recent videos
          if (savedVideos.length > maxEntries) {
            const cleanedVideos = savedVideos.slice(-maxEntries);
            try {
              localStorage.setItem("savedVideos", JSON.stringify(cleanedVideos));
              toast.success("Video saved! (Some old videos were removed to make space)");
            } catch (cleanupError) {
              toast.error("Storage is full. Please clear some space and try again.");
              console.error("Storage cleanup failed:", cleanupError);
            }
          } else {
            toast.error("Storage is full. Please clear some space and try again.");
          }
        } else {
          toast.error("Failed to save video metadata.");
          console.error("Storage error:", storageError);
        }
      }
    } catch (error) {
      toast.error("Failed to save video to library.");
      console.error("Save to library error:", error);
    }
  };

  // Load saved videos from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedVideos") || "[]");
      setSavedVideos(saved);
    } catch (error) {
      console.error("Error loading saved videos:", error);
    }
  }, []);

  // Check for selected video from Manage page
  useEffect(() => {
    try {
      const selectedVideoData = localStorage.getItem("selectedVideoForUpload");
      if (selectedVideoData) {
        const selectedVideo = JSON.parse(selectedVideoData);
        if (selectedVideo.fileRef && selectedVideo.fileRef instanceof File) {
          setFile(selectedVideo.fileRef);
          toast.success(`Loaded ${selectedVideo.name} from saved videos`);
          // Clear the temporary storage
          localStorage.removeItem("selectedVideoForUpload");
        } else if (selectedVideo.fileBlob) {
          // Reconstruct file from blob data
          try {
            const blob = new Blob([new Uint8Array(selectedVideo.fileBlob)], { type: selectedVideo.type });
            const file = new File([blob], selectedVideo.name, { type: selectedVideo.type });
            setFile(file);
            toast.success(`Loaded ${selectedVideo.name} from saved videos`);
          } catch (blobError) {
            console.error("Error reconstructing file from blob:", blobError);
            toast.error("Failed to load video. Please re-upload.");
          }
          // Clear the temporary storage
          localStorage.removeItem("selectedVideoForUpload");
        } else {
          toast.error("Video file not available. Please re-upload the video.");
          localStorage.removeItem("selectedVideoForUpload");
        }
      }
    } catch (error) {
      console.error("Error loading selected video:", error);
      localStorage.removeItem("selectedVideoForUpload");
    }
  }, [setFile]);

  // Handle choosing from device
  const handleChooseFromDevice = () => {
    setShowUploadOptions(false);
    fileInputRef.current?.click();
  };

  // Handle choosing from saved videos
  const handleChooseFromSaved = () => {
    setShowUploadOptions(false);
    setShowSavedVideos(true);
  };

  // Handle selecting a saved video
  const handleSelectSavedVideo = async (savedVideo) => {
    try {
      if (savedVideo.originalData && savedVideo.originalData.fileRef) {
        // If we have the file reference, use it directly
        setFile(savedVideo.originalData.fileRef);
        setShowSavedVideos(false);
        toast.success(`Loaded ${savedVideo.name} for search`);
      } else if (savedVideo.fileBlob) {
        // If we have file blob data, reconstruct the file
        const blob = new Blob([new Uint8Array(savedVideo.fileBlob)], { type: savedVideo.type });
        const file = new File([blob], savedVideo.name, { type: savedVideo.type });
        setFile(file);
        setShowSavedVideos(false);
        toast.success(`Loaded ${savedVideo.name} for search`);
      } else {
        toast.error("Video file not available. Please re-upload the video.");
      }
    } catch (error) {
      console.error("Error loading saved video:", error);
      toast.error("Failed to load video. Please re-upload.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`Video loaded: ${selectedFile.name}`);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-4"
        >
          <Sparkles className="text-primary mx-auto" size={60} />
        </motion.div>
        <h1 className="display-5 fw-bold mb-4">Search Scenes in Your Video</h1>
        <p className="lead text-secondary fs-5">
          Upload your video and describe the scene you're looking for. Our AI will find it for you!
        </p>
      </motion.div>

      <div className="row g-6">
        {/* Upload Section */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-6">
                <motion.h3 
                  className="card-title mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <UploadIcon className="me-2" size={24} />
                  Upload Video
                </motion.h3>

                {/* Dropzone */}
                <motion.div
                  {...uploadAreaProps}
                  className={`border-2 border-dashed rounded-4 p-6 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-primary bg-primary bg-opacity-10"
                      : isDragReject
                      ? "border-danger bg-danger bg-opacity-10"
                      : "border-gray-300 hover:border-primary hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <input {...getInputProps()} />
                  <motion.div
                    animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileVideo className="mx-auto mb-3 text-muted" size={48} />
                  </motion.div>
                  {isDragActive ? (
                    <p className="mb-0 text-primary fw-medium">Drop the video here...</p>
                  ) : isDragReject ? (
                    <p className="mb-0 text-danger fw-medium">Invalid file type!</p>
                  ) : (
                    <div>
                      <p className="mb-2 fw-medium">Drag & drop a video file here</p>
                      <p className="mb-0 text-muted small">or click to browse</p>
                      <p className="mb-0 text-muted small">Supports: MP4, AVI, MOV, MKV, WMV, FLV, WEBM</p>
                    </div>
                  )}
                </motion.div>

                {/* File Info */}
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="mt-4 p-4 bg-light rounded-3"
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FileVideo className="me-3 text-primary" size={24} />
                          </motion.div>
                          <div>
                            <p className="mb-1 fw-medium">{file.name}</p>
                            <p className="mb-0 text-muted small">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={handleRemoveFile}
                          className="btn btn-sm btn-outline-danger"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scene Description */}
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <label htmlFor="sceneDescription" className="form-label fw-medium">
                    <Target className="me-2" size={16} />
                    Describe the scene you're looking for:
                  </label>
                  <textarea
                    id="sceneDescription"
                    className="form-control"
                    rows="4"
                    placeholder="e.g., 'A person riding a bicycle on a street', 'A sunset over the ocean', 'A car driving through a city'"
                    value={sceneDescription}
                    onChange={handleDescriptionChange}
                    disabled={loading}
                  />
                  <div className="form-text">
                    Be as descriptive as possible for better results
                  </div>
                </motion.div>

                {/* Search Button */}
                <motion.button
                  className="btn btn-primary btn-lg w-100 mt-4"
                  onClick={handleSearchScene}
                  disabled={loading || !file || !sceneDescription.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="me-2" size={20} />
                      </motion.div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="me-2" size={20} />
                      Search Scene
                    </>
                  )}
                </motion.button>

                {/* Progress Bar */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-muted">Processing...</span>
                        <span className="small text-muted">{uploadProgress}%</span>
                      </div>
                      <div className="progress" style={{ height: "8px" }}>
                        <motion.div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                  {resultTimestamp && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="mt-4 alert alert-success"
                    >
                      <div className="d-flex align-items-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          <CheckCircle className="me-2" size={20} />
                        </motion.div>
                        <div>
                          <strong>Scene found!</strong> Timestamp: {resultTimestamp}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="mt-4 alert alert-danger"
                    >
                      <div className="d-flex align-items-center">
                        <AlertCircle className="me-2" size={20} />
                        <div>{error}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save to Library Button */}
                <motion.button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={handleSaveToLibrary}
                  disabled={!file}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Save to Library
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Video Player Section */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-6">
                <motion.h3 
                  className="card-title mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Play className="me-2" size={24} />
                  Video Player
                </motion.h3>
                {file && memoizedVideoUrl ? (
                  <div>
                    {/* Video Player */}
                    <motion.div 
                      className="position-relative rounded-3 overflow-hidden bg-black mb-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <ReactPlayer
                        ref={playerRef}
                        url={memoizedVideoUrl}
                        width="100%"
                        height="300px"
                        controls
                        playing={isPlaying}
                        onProgress={state => {
                          setCurrentTime(state.playedSeconds);
                        }}
                        onDuration={handlePlayerDuration}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onReady={() => {
                          console.log("Video player ready");
                          // Reset any previous errors
                          setError(null);
                        }}
                        onError={(e) => {
                          console.error("Video player error:", e);
                          toast.error("Video cannot be played. Try a different file.");
                          setError("Video playback error. Please try a different video file.");
                        }}
                        onSeek={(seconds) => {
                          console.log("Video seeked to:", seconds, "seconds");
                          setCurrentTime(seconds);
                        }}
                        config={{
                          file: {
                            attributes: {
                              crossOrigin: "anonymous"
                            },
                            forceVideo: true,
                            forceHLS: false,
                            forceDASH: false
                          }
                        }}
                        style={{ borderRadius: "var(--radius-lg)" }}
                        progressInterval={100}
                        playsinline
                        muted={false}
                        volume={1}
                        playbackRate={1}
                        pip={false}
                        stopOnUnmount={false}
                        light={false}
                      />
                      {/* Marker overlay on progress bar */}
                      {resultTimestamp && duration && getMarkerPercent() !== null && (
                        <motion.div 
                          className="scene-marker-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          <motion.div
                            className="scene-marker"
                            style={{ left: `${getMarkerPercent()}%` }}
                            title={`Found scene at ${resultTimestamp}`}
                            onClick={handleSeekToTimestamp}
                            tabIndex={0}
                            role="button"
                            aria-label={`Jump to found scene at ${resultTimestamp}`}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSeekToTimestamp(); }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{ 
                              scale: [1, 1.1, 1],
                              boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.4)", "0 0 0 10px rgba(99, 102, 241, 0)", "0 0 0 0 rgba(99, 102, 241, 0)"]
                            }}
                            transition={{ 
                              scale: { duration: 2, repeat: Infinity },
                              boxShadow: { duration: 2, repeat: Infinity }
                            }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                    {/* Video Controls */}
                    <motion.div 
                      className="d-flex align-items-center justify-content-between mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <div className="d-flex align-items-center">
                        <Clock className="me-2 text-muted" size={16} />
                        <span className="small text-muted">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <motion.button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="btn btn-sm btn-outline-primary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </motion.button>
                        <motion.button
                          onClick={() => playerRef.current?.seekTo(0)}
                          className="btn btn-sm btn-outline-secondary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <RotateCcw size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                    {/* Jump to Scene Button */}
                    <AnimatePresence>
                      {resultTimestamp && (
                        <motion.button
                          onClick={handleSeekToTimestamp}
                          className="btn btn-success w-100 mb-2"
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Zap className="me-2" size={16} />
                          </motion.div>
                          Jump to Found Scene ({resultTimestamp})
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FileVideo className="mx-auto mb-3 text-muted" size={64} />
                    </motion.div>
                    <p className="text-muted mb-0">
                      {file ? "Video cannot be previewed. Try a different file." : "Upload a video to start playing"}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <div className="card border-0 shadow-sm">
          <div className="card-body p-6">
            <motion.h4 
              className="card-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              💡 Tips for Better Results
            </motion.h4>
            <div className="row g-4">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  {[
                    "Be specific about objects, actions, and settings",
                    "Include colors, lighting, and weather conditions",
                    "Mention people, animals, or vehicles if present"
                  ].map((tip, index) => (
                    <motion.li 
                      key={index}
                      className="mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                    >
                      <CheckCircle className="text-success me-2" size={16} />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled">
                  {[
                    "Describe the camera angle or perspective",
                    "Include background elements and scenery",
                    "Mention any text, signs, or logos visible"
                  ].map((tip, index) => (
                    <motion.li 
                      key={index}
                      className="mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    >
                      <CheckCircle className="text-success me-2" size={16} />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hidden file input for device selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        style={{ display: 'none' }}
      />

      {/* Upload Options Modal */}
      <AnimatePresence>
        {showUploadOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content border-0 shadow-lg"
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    <UploadIcon className="me-2" size={20} />
                    Choose Upload Method
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUploadOptions(false)}
                  />
                </div>
                <div className="modal-body pt-0">
                  <div className="row g-4">
                    <div className="col-12">
                      <button
                        className="btn btn-outline-primary w-100 p-4 border-2 rounded-3 shadow-sm"
                        onClick={handleChooseFromDevice}
                        style={{ minHeight: '120px' }}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <div className="mb-3">
                            <UploadIcon size={40} className="text-primary" />
                          </div>
                          <div className="fw-bold mb-1">Upload from Device</div>
                          <small className="text-muted">Choose a new video file from your computer</small>
                        </div>
                      </button>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-outline-secondary w-100 p-4 border-2 rounded-3 shadow-sm"
                        onClick={handleChooseFromSaved}
                        style={{ minHeight: '120px' }}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <div className="mb-3">
                            <FileVideo size={40} className="text-secondary" />
                          </div>
                          <div className="fw-bold mb-1">Choose from Saved</div>
                          <small className="text-muted">Use a previously saved video from your library</small>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Videos Modal */}
      <AnimatePresence>
        {showSavedVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="modal-content border-0 shadow-lg"
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    <FileVideo className="me-2" size={20} />
                    Choose from Saved Videos
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSavedVideos(false)}
                  />
                </div>
                <div className="modal-body pt-0">
                  {savedVideos.length === 0 ? (
                    <div className="text-center py-5">
                      <FileVideo size={64} className="text-muted mb-3" />
                      <h6 className="fw-bold">No saved videos found</h6>
                      <p className="text-muted">Save videos from the Upload page to see them here</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowSavedVideos(false)}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {savedVideos.map((video) => (
                        <div key={video.id} className="col-md-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center mb-3">
                                <FileVideo className="text-primary me-2" size={24} />
                                <h6 className="card-title mb-0 text-truncate fw-bold">{video.name}</h6>
                              </div>
                              <div className="text-muted small mb-3">
                                <div className="mb-1">
                                  <strong>Size:</strong> {((video.size / 1024 / 1024).toFixed(1))} MB
                                </div>
                                <div className="mb-1">
                                  <strong>Type:</strong> {video.type}
                                </div>
                                <div>
                                  <strong>Date:</strong> {new Date(video.date).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => handleSelectSavedVideo(video)}
                              >
                                <FileVideo className="me-2" size={16} />
                                Use This Video
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Upload;