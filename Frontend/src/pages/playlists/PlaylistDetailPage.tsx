import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  usePlaylist,
  useSearchSongs,
  useAddSongToPlaylist,
  useUpdatePlaylist,
} from "@/hooks/useMusic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ImageIcon, Pause, Play, Search } from "lucide-react";
import { usePlayer } from "@/contexts/MusicPlayerContext";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [addingSongId, setAddingSongId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: playlist, isLoading: playlistLoading } = usePlaylist(playlistId || "", !!playlistId);
  const { data: searchResults, isLoading: isSearching } = useSearchSongs(searchText);
  const addSongToPlaylist = useAddSongToPlaylist();
  const updatePlaylist = useUpdatePlaylist();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayer();
  const { user } = useUser();

  useEffect(() => {
    if (playlist?.title) {
      setTitleInput(playlist.title);
    }
  }, [playlist?.title]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!playlistId || !file) return;

    const formData = new FormData();
    formData.append("imageFile", file);

    await updatePlaylist.mutateAsync({ playlistId, payload: formData });
    event.target.value = "";
  };

  const handleTitleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!playlistId || !playlist) {
      setIsEditingTitle(false);
      return;
    }

    const trimmedTitle = titleInput.trim();
    if (!trimmedTitle || trimmedTitle === playlist.title) {
      setIsEditingTitle(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", trimmedTitle);

    await updatePlaylist.mutateAsync({ playlistId, payload: formData });
    setIsEditingTitle(false);
  };

  const alreadyAddedSongIds = new Set(playlist?.songs.map((song) => song._id) ?? []);
  const availableSongs = (searchResults ?? []).filter((song) => !alreadyAddedSongIds.has(song._id));

  const handleAddSong = async (songId: string) => {
    if (!playlistId) return;
    setAddingSongId(songId);
    await addSongToPlaylist.mutateAsync({ playlistId, songId });
    setAddingSongId(null);
  };

  const handlePlayPlaylist = () => {
    if (!playlist) return;
    const currentPlaying = playlist.songs.some((song) => song._id === currentSong?._id);
    if (currentPlaying) {
      togglePlay();
    } else {
      playAlbum(playlist.songs, 0);
    }
  };

  const handlePlayPlaylistSong = (index: number) => {
    if (!playlist) return;
    playAlbum(playlist.songs, index);
  };

  if (!playlistId) {
    return <div className="flex h-full items-center justify-center text-zinc-400">Playlist not found.</div>;
  }

  if (playlistLoading) {
    return <div className="flex h-full items-center justify-center text-zinc-400">Loading playlist...</div>;
  }

  return (
    <div className="h-full min-h-0 flex flex-col rounded-lg bg-zinc-900 overflow-hidden">
      <ScrollArea className="flex-1 h-full min-h-0 rounded-md">
        <div className="relative min-h-0">
          <div
            className="absolute inset-0 bg-linear-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6 pb-6 sm:pb-8">
              <div className="w-full sm:w-72 rounded-3xl overflow-hidden bg-zinc-900">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="group relative block h-72 w-full overflow-hidden leading-none"
                >
                  {playlist?.imageUrl ? (
                    
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-14 h-14" />
                        <p className="text-sm">Click to upload cover</p>
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 text-white opacity-0 transition group-hover:opacity-100">
                    <p className="text-sm">Change playlist image</p>
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex-1">
                <div className="rounded-3xl p-6">
                  <div className="flex flex-col gap-4">
                    <div className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">Playlist</div>
                    <form onSubmit={handleTitleSubmit} className="space-y-4">
                      {isEditingTitle ? (
                        <Input
                          value={titleInput}
                          onChange={(event) => setTitleInput(event.target.value)}
                          onBlur={() => setIsEditingTitle(false)}
                          autoFocus
                          className="text-4xl font-semibold text-white bg-zinc-950 border border-zinc-700"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingTitle(true)}
                          className="text-left"
                        >
                          <h1 className="text-6xl sm:text-8xl font-bold text-white hover:cursor-pointer transition">
                            {playlist?.title}
                          </h1>
                        </button>
                      )}
                    </form>

                 

                    <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400 pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {user?.imageUrl ? (
                            <AvatarImage src={user.imageUrl} alt={user?.fullName || "Owner avatar"} />
                          ) : (
                            <AvatarFallback>{user?.fullName?.[0] ?? "O"}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-xl font-medium text-white">{user?.fullName || playlist?.ownerId}</p>
                       
                        </div>
                      </div>

                  
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start gap-6">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer hover:scale-105 transition-all"
                onClick={handlePlayPlaylist}
              >
                {isPlaying && playlist?.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="text-black h-7 w-7" />
                ) : (
                  <Play className="text-black h-7 w-7 ml-1" />
                )}
              </Button>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <div className="rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Search songs to add</h2>
            
                  </div>
                </div>

                <div className="mt-5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      placeholder="Search existing songs"
                      className="pl-11"
                    />
                  </div>
                </div>

                {searchText.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {isSearching ? (
                      <div className="text-zinc-400">Searching songs...</div>
                    ) : availableSongs.length === 0 ? (
                      <div className="text-zinc-500">No matching songs found or all matches are already in this playlist.</div>
                    ) : (
                      <div className="space-y-3 bg-zinc-900 border border-white/5">
                        {availableSongs.map((song) => (
                          <div key={song._id} className="flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <img src={song.imageUrl} alt={song.title} className="h-16 w-16 rounded-xl object-cover" />
                              <div className="min-w-0">
                                <p className="text-white truncate">{song.title}</p>
                                <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAddSong(song._id)}
                              disabled={addingSongId === song._id}
                            >
                              {addingSongId === song._id ? "Adding..." : "Add song"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <div className="rounded-3xl bg-black/20 backdrop-blur-sm">
                <div className="hidden md:grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                  <div>#</div>
                  <div>Title</div>
                  <div>Added Date</div>
                  <div>
                    <Clock className="h-4 w-4" />
                  </div>
                </div>

                <div className="px-2 sm:px-6">
                  <div className="space-y-2 py-4">
                    {playlist?.songs?.length ? (
                      playlist.songs.map((song, index) => {
                        const isCurrentSong = currentSong?._id === song._id;
                        return (
                          <div
                            key={song._id}
                            onClick={() => handlePlayPlaylistSong(index)}
                            className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[16px_4fr_2fr_1fr] gap-3 md:gap-4 px-2 sm:px-4 py-2 text-sm text-zinc-400 rounded-md group hover:bg-white/5 cursor-pointer"
                          >
                            <div className="flex items-center justify-center w-8">
                              {isCurrentSong && isPlaying ? (
                                <div className="text-emerald-500 text-lg">♫</div>
                              ) : (
                                <>
                                  <span className="group-hover:hidden text-zinc-400">{index + 1}</span>
                                  <Play className="h-4 w-4 hidden group-hover:block text-white" />
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-3 min-w-0">
                              <img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                              <div className="min-w-0 flex-1">
                                <div className={`font-medium text-white truncate ${isCurrentSong ? "text-emerald-500" : ""}`}>
                                  {song.title}
                                </div>
                                <div className="truncate text-xs sm:text-sm">{song.artist}</div>
                              </div>
                            </div>

                            <div className="hidden md:flex items-center">{song.createdAt.split("T")[0]}</div>
                            <div className="flex items-center justify-end md:justify-start">{formatDuration(song.duration)}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-zinc-500">This playlist does not have any songs yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistDetailPage;
