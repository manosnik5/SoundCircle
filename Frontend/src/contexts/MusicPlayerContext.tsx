import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { type Song } from "@/types";
import { useSocket } from "./SocketContext";
import { useAuth } from "@clerk/clerk-react";

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
    
    const { socket } = useSocket();
    const { userId } = useAuth();

    const updateActivity = useCallback((activity: string) => {
        if (socket && userId) {
            socket.emit("update_activity", {
                userId,
                activity
            });
        }
    }, [socket, userId]);

    const initializeQueue = useCallback((songs: Song[]) => {
        setQueue(songs);
        if (currentIndex === -1) {
            setCurrentSongState((prev) => prev ?? songs[0]);
            setCurrentIndex(0);
        }
    }, [currentIndex])

    const playAlbum = useCallback((songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];
        
        updateActivity(`Playing ${song.title} by ${song.artist}`);

        setQueue(songs);
        setCurrentSongState(song);
        setCurrentIndex(startIndex);
        setIsPlaying(true);
    }, [updateActivity])

    const setCurrentSong = useCallback((song: Song | null) => {
        if (!song) return;

        updateActivity(`Playing ${song.title} by ${song.artist}`);

        const songIndex = queue.findIndex((s) => s._id === song._id);
        setCurrentSongState(song);
        setIsPlaying(true);

        if (songIndex !== -1) {
            setCurrentIndex(songIndex);
        }
    }, [queue, updateActivity]);

    const togglePlay = useCallback(() => {
        const willStartPlaying = !isPlaying;
        
        if (willStartPlaying && currentSong) {
            updateActivity(`Playing ${currentSong.title} by ${currentSong.artist}`);
        } else {
            updateActivity("Idle");
        }

        setIsPlaying(willStartPlaying);
    }, [isPlaying, currentSong, updateActivity])

    const playNext = useCallback(() => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex];
            
            updateActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);
            
            setCurrentSongState(nextSong);
            setCurrentIndex(nextIndex);
            setIsPlaying(true);
        } else {
            updateActivity("Idle");
            setIsPlaying(false);
        }
    }, [currentIndex, queue, updateActivity]);

    const playPrevious = useCallback(() => {
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];
            
            updateActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);
            
            setCurrentSongState(prevSong);
            setCurrentIndex(prevIndex);
            setIsPlaying(true);
        } else {
            updateActivity("Idle");
            setIsPlaying(false);
        }
    }, [currentIndex, queue, updateActivity]);

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