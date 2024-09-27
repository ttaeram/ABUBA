import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaMicrophone, FaStop } from 'react-icons/fa';

interface AudioPlayerProps {
  src?: string;
  onNewRecording: (audioFile: Blob) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onNewRecording }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: Blob[] = []

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // 이벤트 리스너 추가
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);

        mediaRecorderRef.current.addEventListener("dataavailable", (event: BlobEvent) => {
          audioChunks.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
          onNewRecording(audioBlob);
        });
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <PlayerContainer>
      <audio ref={audioRef} src={src} />
      <ControlButton onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </ControlButton>
      <ProgressContainer>
        <ProgressBar 
          type="range" 
          min={0} 
          max={duration} 
          value={currentTime}
          onChange={(e) => {
            const audio = audioRef.current;
            if (audio) {
              audio.currentTime = Number(e.target.value);
              setCurrentTime(audio.currentTime);
            }
          }}
        />
        <TimeDisplay>{formatTime(currentTime)} / {formatTime(duration)}</TimeDisplay>
      </ProgressContainer>
      <ControlButton onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </ControlButton>
    </PlayerContainer>
  );
};

export default AudioPlayer;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 20px;
  margin-top: 10px;
`;

const ControlButton = styled.button`
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #173C91;
    transform: scale(1.1);
  }
`;

const ProgressContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressBar = styled.input`
  width: 100%;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    background: #ddd;
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: #3B6EBA;
    margin-top: -5px;
  }

  &:focus {
    outline: none;
  }
`;

const TimeDisplay = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;