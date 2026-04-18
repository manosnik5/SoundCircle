import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useCreatePlaylist, useDeletePlaylist, usePlaylists } from "@/hooks/useMusic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Library, Music, Plus, Trash2 } from "lucide-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { usePlayer } from "@/contexts/MusicPlayerContext";
import TopBar from "@/components/TopBar";

const PlaylistPage = () => {
  const { isSignedIn } = useAuth();
  const { data: playlists, isLoading } = usePlaylists(isSignedIn);
  const createPlaylist = useCreatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const { currentSong } = usePlayer();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleMobile();
    window.addEventListener("resize", handleMobile);

    return () => window.removeEventListener("resize", handleMobile);
  }, []);

  const handleCreatePlaylist = () => {
    if (!title.trim()) return;

    setCreating(true);
    createPlaylist.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          setTitle("");
        },
        onSettled: () => {
          setCreating(false);
        },
      }
    );
  };

  return (
    <div
      className={`h-full rounded-lg bg-zinc-900 overflow-hidden flex flex-col ${
        isMobile
          ? currentSong
            ? "pb-35"
            : "pb-16"
          : "pb-0"
      }`}
    >
    <TopBar />

    <div className="flex-1 min-h-0 p-6 flex flex-col">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#8b5cf6] to-[#694bcc] p-3 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {playlists?.length ?? 0} {playlists?.length === 1 ? "playlist" : "playlists"}
            </p>
          </div>
        </div>

        <SignedIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-zinc-950/70 rounded-xl p-4 border border-zinc-800">
            <div className="flex-1 min-w-0">
              <label className="text-sm text-zinc-400">Create new playlist</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Playlist name"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#131313] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#694bcc]"
              />
            </div>
            <button
              onClick={handleCreatePlaylist}
              disabled={!title.trim() || creating}
              className="inline-flex items-center justify-center sm:mt-6 gap-2 rounded-xl bg-[#694bcc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#775ad4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              Create playlist
            </button>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-center text-zinc-300">
            Sign in to create playlists and access your saved collections.
          </div>
        </SignedOut>
      </div>

        <ScrollArea className="flex-1 h-full min-h-0 overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <PlaylistSkeleton key={i} />
              ))}
            </div>
          ) : playlists && playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="relative bg-zinc-800/40 p-4 rounded-lg hover:bg-zinc-800/60 transition-all group"
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      deletePlaylist.mutate(playlist._id);
                    }}
                    className="absolute right-6 top-6 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition bg-red-500 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link
                    to={`/playlist/${playlist._id}`}
                    className="block overflow-hidden rounded-xl bg-zinc-900/70"
                  >
                    {playlist.imageUrl ? (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={playlist.imageUrl}
                          alt={playlist.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-zinc-900 text-[#694bcc]">
                        <Library className="h-10 w-10" />
                      </div>
                    )}
                    <div className="p-4 text-white">
                      <h3 className="font-medium truncate">{playlist.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400 truncate">{playlist.description || "Personal playlist"}</p>
                    </div>
                  </Link>
                  <div className="mt-3 text-xs text-zinc-500">
                    {playlist.songs?.length ?? 0} {playlist.songs?.length === 1 ? "song" : "songs"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <Music className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No playlists yet</h2>
              <p className="text-sm text-zinc-400">Create one above to get started with your own collection.</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default PlaylistPage;
