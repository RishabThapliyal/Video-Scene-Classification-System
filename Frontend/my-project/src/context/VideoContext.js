import React, { createContext, useContext, useState } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [file, setFile] = useState(null);
  const [sceneDescription, setSceneDescription] = useState("");
  const [resultTimestamp, setResultTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [error, setError] = useState(null);

  return (
    <VideoContext.Provider
      value={{
        file,
        setFile,
        sceneDescription,
        setSceneDescription,
        resultTimestamp,
        setResultTimestamp,
        endTimestamp,
        setEndTimestamp,
        error,
        setError,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  return useContext(VideoContext);
} 