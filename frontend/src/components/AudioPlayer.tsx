import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaMicrophone, FaStop } from 'react-icons/fa';

interface AudioPlayerProps {
  src?: string;
  onNewRecording?: (audioFile: Blob) => void;
  disableRecording?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onNewRecording, disableRecording }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleAudioEnd = () => {
      setIsPlaying(false); // 재생이 끝나면 재생 버튼으로 돌아감
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd); // 재생 끝났을 때 상태 업데이트

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  useEffect(() => {
    if (recordedAudioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.src = recordedAudioUrl;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [recordedAudioUrl]);

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

  const handleStopRecording = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    setRecordedAudioUrl(audioUrl);

    // 새 Audio 객체 생성하여 duration 계산
    const tempAudio = new Audio(audioUrl);
    tempAudio.addEventListener('loadedmetadata', () => {
      setDuration(tempAudio.duration); // 녹음된 파일의 길이 설정
    });

    if (onNewRecording) {
      onNewRecording(audioBlob);
    }
    setIsRecording(false);
  };

  const startRecording = () => {
    if (disableRecording || isRecording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);

        mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
          chunks.push(event.data);
        });

        mediaRecorderRef.current.addEventListener('stop', () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          handleStopRecording(audioBlob);
        });
      })
      .catch(err => {
        console.error("Error starting recording:", err); // 에러 발생 시 로그로 출력
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00"; // Infinity 문제를 방지
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <PlayerContainer>
      <audio ref={audioRef} src={src || recordedAudioUrl || ""} />
      <ControlButton onClick={togglePlay} disabled={!recordedAudioUrl && !src}>
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
      {!disableRecording && (
        <ControlButton onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </ControlButton>
      )}
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
