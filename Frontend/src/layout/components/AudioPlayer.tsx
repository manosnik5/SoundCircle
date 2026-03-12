import { usePlayer } from "@/contexts/MusicPlayerContext"
import { useEffect, useRef } from "react"

const AudioPlayer = () => {
  const prevSongRef = useRef<string | null>(null)
  const { 
    currentSong, 
    isPlaying, 
    playNext, 
    audioRef, 
    setCurrentTime, 
    setDuration,
    volume 
  } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(err => console.log("Play error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playNext, setCurrentTime, setDuration, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (prevSongRef.current !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong.audioUrl;

      if (isPlaying) {
        audio.play().catch(err => console.log("Play error:", err));
      }
    }
  }, [currentSong, isPlaying, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume, audioRef]);
  
  return <audio ref={audioRef} />;
}

export default AudioPlayer