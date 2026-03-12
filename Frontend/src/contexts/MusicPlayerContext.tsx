import { createContext, useCallback, useContext, useState, useRef, type ReactNode, type RefObject } from "react";
import { type Song } from "@/types";
import { useSocket } from "./SocketContext";
import { useAuth } from "@clerk/clerk-react";

interface MusicPlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    volume: number;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    audioRef: RefObject<HTMLAudioElement | null>; // Changed this
    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setVolume: (volume: number) => void;
    setIsMuted: (muted: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export const MusicPlayerProvider = ({children}: {children: ReactNode}) => {
    const [currentSong, setCurrentSongState] = useState<Song | null>(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    
    // Shared playback state
    const [volume, setVolumeState] = useState(75);
    const [isMuted, setIsMutedState] = useState(false);
    const [currentTime, setCurrentTimeState] = useState(0);
    const [duration, setDurationState] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null); // Changed this
    
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

    const setVolume = useCallback((vol: number) => {
        setVolumeState(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol / 100;
        }
    }, []);

    const setIsMuted = useCallback((muted: boolean) => {
        setIsMutedState(muted);
    }, []);

    const setCurrentTime = useCallback((time: number) => {
        setCurrentTimeState(time);
    }, []);

    const setDuration = useCallback((dur: number) => {
        setDurationState(dur);
    }, []);

    return (
        <MusicPlayerContext.Provider value={{
            currentSong,
            isPlaying,
            queue,
            currentIndex,
            volume,
            isMuted,
            currentTime,
            duration,
            audioRef,
            initializeQueue,
            playAlbum,
            setCurrentSong,
            togglePlay,
            playNext,
            playPrevious,
            setVolume,
            setIsMuted,
            setCurrentTime,
            setDuration,
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