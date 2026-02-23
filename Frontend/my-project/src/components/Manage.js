import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  Calendar,
  Clock,
  FileVideo,
  Folder,
  Plus,
  MoreVertical,
  AlertTriangle
} from "lucide-react";
// Removed unused import: useVideo

function Manage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Load saved videos from localStorage
  useEffect(() => {
    try {
      const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
      
      // Convert saved videos to the format expected by the component
      const formattedVideos = savedVideos.map((video, index) => ({
        id: video.id || index + 1,
        name: video.name,
        size: `${(video.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: "Unknown", // We don't store duration in metadata
        uploadDate: new Date(video.date).toLocaleDateString(),
        type: "saved", // All saved videos are of type "saved"
        scenes: 0, // We don't store scene count in metadata
        thumbnail: "📹",
        originalData: video // Keep original data for reference
      }));
      
      setVideos(formattedVideos);
    } catch (error) {
      console.error("Error loading saved videos:", error);
      toast.error("Failed to load saved videos");
    }
    
    setLoading(false);
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || video.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(video => video.id));
    }
  };

  const handleDeleteVideos = () => {
    if (selectedVideos.length === 0) {
      toast.error("Please select videos to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Remove from localStorage
    try {
      const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
      const updatedVideos = savedVideos.filter(video => !selectedVideos.includes(video.id));
      localStorage.setItem("savedVideos", JSON.stringify(updatedVideos));
      
      // Update local state
      setVideos(prev => prev.filter(video => !selectedVideos.includes(video.id)));
      setSelectedVideos([]);
      setShowDeleteModal(false);
      toast.success(`${selectedVideos.length} video(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting videos:", error);
      toast.error("Failed to delete videos");
    }
  };

  const handleDownload = (video) => {
    toast.success(`Downloading ${video.name}...`);
  };

  const handleView = (video) => {
    toast.success(`Opening ${video.name}...`);
  };

  const getTypeColor = (type) => {
    const colors = {
      saved: "info",
      vacation: "primary",
      business: "success",
      personal: "warning",
      nature: "info"
    };
    return colors[type] || "secondary";
  };

  const getTypeIcon = (type) => {
    const icons = {
      saved: "💾",
      vacation: "🏖️",
      business: "💼",
      personal: "👤",
      nature: "🌲"
    };
    return icons[type] || "📹";
  };

  // Add a handler to use a saved video in search
  const handleUseInSearch = (video) => {
    try {
      if (video.originalData && video.originalData.fileRef) {
        // Store the selected video temporarily for the Upload component
        localStorage.setItem("selectedVideoForUpload", JSON.stringify({
          name: video.name,
          size: video.size,
          type: video.type,
          fileRef: video.originalData.fileRef
        }));
        
        toast.success(`Loaded ${video.name} for search`);
        // Navigate to upload page
        window.location.href = '/upload';
      } else if (video.originalData && video.originalData.fileBlob) {
        // Store the file blob data
        localStorage.setItem("selectedVideoForUpload", JSON.stringify({
          name: video.name,
          size: video.size,
          type: video.type,
          fileBlob: video.originalData.fileBlob
        }));
        
        toast.success(`Loaded ${video.name} for search`);
        // Navigate to upload page
        window.location.href = '/upload';
      } else {
        toast.error("Video file not available. Please re-upload the video.");
      }
    } catch (error) {
      console.error("Error loading video for search:", error);
      toast.error("Failed to load video. Please re-upload.");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your video library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="display-5 fw-bold mb-4">Manage Your Videos</h1>
        <p className="lead text-secondary fs-5">
          Organize, search, and manage your video library with powerful tools
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="row g-4 mb-6"
      >
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <FileVideo className="text-primary mb-3" size={32} />
              <h3 className="mb-1">{videos.length}</h3>
              <p className="text-muted mb-0">Total Videos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Folder className="text-success mb-3" size={32} />
              <h3 className="mb-1">{videos.reduce((sum, v) => sum + v.scenes, 0)}</h3>
              <p className="text-muted mb-0">Total Scenes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Clock className="text-warning mb-3" size={32} />
              <h3 className="mb-1">
                {videos.reduce((sum, v) => {
                  if (v.duration === "Unknown") return sum;
                  const [mins, secs] = v.duration.split(':').map(Number);
                  return sum + mins + secs / 60;
                }, 0).toFixed(1)}h
              </h3>
              <p className="text-muted mb-0">Total Duration</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <Calendar className="text-info mb-3" size={32} />
              <h3 className="mb-1">{new Set(videos.map(v => v.uploadDate)).size}</h3>
              <p className="text-muted mb-0">Upload Days</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card border-0 shadow-sm mb-6"
      >
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="saved">Saved Videos</option>
                <option value="vacation">Vacation</option>
                <option value="business">Business</option>
                <option value="personal">Personal</option>
                <option value="nature">Nature</option>
              </select>
            </div>
            <div className="col-md-5">
              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleSelectAll}
                >
                  {selectedVideos.length === filteredVideos.length ? "Deselect All" : "Select All"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteVideos}
                  disabled={selectedVideos.length === 0}
                >
                  <Trash2 className="me-2" size={16} />
                  Delete ({selectedVideos.length})
                </button>
                <button className="btn btn-primary">
                  <Plus className="me-2" size={16} />
                  Upload New
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {filteredVideos.length === 0 ? (
          <div className="text-center py-8">
            <FileVideo className="text-muted mb-4" size={64} />
            <h4 className="text-muted">
              {videos.length === 0 ? "No saved videos yet" : "No videos found"}
            </h4>
            <p className="text-muted">
              {videos.length === 0 
                ? "Save videos from the Upload page to see them here" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {videos.length === 0 && (
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/upload'}
              >
                Go to Upload
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card border-0 shadow-sm h-100"
              >
                <div className="card-body p-4">
                  {/* Video Header */}
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={selectedVideos.includes(video.id)}
                        onChange={() => handleSelectVideo(video.id)}
                      />
                      <span className="fs-1">{video.thumbnail}</span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                        <MoreVertical size={16} />
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => handleView(video)}>
                          <Eye className="me-2" size={16} />View
                        </button></li>
                        <li><button className="dropdown-item" onClick={() => handleDownload(video)}>
                          <Download className="me-2" size={16} />Download
                        </button></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger">
                          <Trash2 className="me-2" size={16} />Delete
                        </button></li>
                      </ul>
                    </div>
                  </div>

                  {/* Video Info */}
                  <h6 className="card-title mb-2 text-truncate">{video.name}</h6>
                  
                  <div className="mb-3">
                    <span className={`badge bg-${getTypeColor(video.type)} me-2`}>
                      {getTypeIcon(video.type)} {video.type}
                    </span>
                    <span className="badge bg-light text-dark">
                      {video.scenes} scenes
                    </span>
                  </div>

                  <div className="row g-2 text-muted small mb-3">
                    <div className="col-6">
                      <Clock className="me-1" size={12} />
                      {video.duration}
                    </div>
                    <div className="col-6">
                      <FileVideo className="me-1" size={12} />
                      {video.size}
                    </div>
                  </div>

                  <div className="text-muted small">
                    <Calendar className="me-1" size={12} />
                    Uploaded {video.uploadDate}
                  </div>

                  {/* Use in Search Scene Button */}
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleUseInSearch(video)}
                    >
                      Use in Search Scene
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
                className="modal-content"
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    <AlertTriangle className="me-2 text-warning" size={20} />
                    Confirm Deletion
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete {selectedVideos.length} selected video(s)? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    <Trash2 className="me-2" size={16} />
                    Delete Videos
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Manage;