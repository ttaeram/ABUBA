import React, { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import styled from 'styled-components';
import { FaPlay, FaPause, FaMicrophone, FaStop } from 'react-icons/fa';

interface AudioPlayerProps {
  src?: string;
  onNewRecording?: (audioFile: Blob) => void;
  disableRecording?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onNewRecording, disableRecording }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
  const hasRecord = useRef<boolean>(false)

  useEffect(() => {
    if (mediaBlobUrl && onNewRecording && !hasRecord.current) {
      hasRecord.current = true
      fetch(mediaBlobUrl)
        .then(response => response.blob())
        .then(blob => {
          onNewRecording(blob);
        });
    }
  }, [mediaBlobUrl, onNewRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
      hasRecord.current = false
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  return (
    <PlayerContainer>
      {!disableRecording && (
        <ControlButton isRecording={isRecording} onClick={toggleRecording}>
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </ControlButton>
      )}
      <audio controls src={mediaBlobUrl || src || ""} />
    </PlayerContainer>
  );
};

export default AudioPlayer;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
`;

const ControlButton = styled.button<{ isRecording: boolean }>`
  background-color: ${(props) => (props.isRecording ? '#FF4D4D' : '#3B6EBA')};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin right: 20px
  
  &:hover {
    transform: scale(1.1);
  }
`;
