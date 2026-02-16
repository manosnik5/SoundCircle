import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { type Song } from "@/types";

interface MusicPlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void
    setCurrentSong: (song: Song | null) => void
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export const MusicPlayerProvider = ({children}: {children: ReactNode}) => {
    const [currentSong, setCurrentSongState] = useState<Song | null>(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const initializeQueue = useCallback((songs: Song[]) => {
        setQueue(songs);
        if(currentIndex === -1) {
            setCurrentSongState(currentSong || songs[0])
            setCurrentIndex(0);
        }
    }, [currentSong, currentIndex])

    const playAlbum = useCallback((songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];
        setQueue(songs);
        setCurrentSongState(song);
        setCurrentIndex(startIndex);
        setIsPlaying(true);
    }, [])

    const setCurrentSong = useCallback((song: Song | null) => {
        if (!song) return;

        const songIndex = queue.findIndex((s) => s._id === song._id);
        setCurrentSongState(song);
        setIsPlaying(true);

        if (songIndex !== -1) {
            setCurrentIndex(songIndex);
        }
    }, [queue]);

    const togglePlay = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, [])

    const playNext = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      setCurrentSongState(nextSong);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue]);

  const playPrevious = useCallback(() => {
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      setCurrentSongState(prevSong);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue]);
  return (
    <MusicPlayerContext.Provider value={{
        currentSong,
        isPlaying,
        queue,
        currentIndex,
        initializeQueue,
        playAlbum,
        setCurrentSong,
        togglePlay,
        playNext,
        playPrevious,
      }}>
        {children}
    </MusicPlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

