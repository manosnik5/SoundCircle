import { usePlayer } from "@/contexts/MusicPlayerContext"
import { useEffect, useRef } from "react"

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const prevSongRef = useRef<string | null>(null)

  const {currentSong, isPlaying, playNext} = usePlayer();

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      playNext()
    }

    audioRef.current?.addEventListener("ended", handleEnded)

    return () => audioRef.current?.removeEventListener("ended", handleEnded)
  }, [playNext]);

  useEffect(() => {
  if (!audioRef.current || !currentSong) return;

  if (prevSongRef.current !== currentSong.audioUrl) {
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.currentTime = 0;
    prevSongRef.current = currentSong.audioUrl;
    audioRef.current.play();
  }
}, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);



  return <audio ref={audioRef}/>
}

export default AudioPlayer