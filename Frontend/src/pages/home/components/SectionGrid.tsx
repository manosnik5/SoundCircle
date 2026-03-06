import { useState, useEffect } from "react";
import type { Song } from "@/types";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton.tsx";
import PlayButton from "./PlayButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionGridProps {
  title: string;
  songs: Song[];
  isLoading: boolean;
}

const useCardsPerPage = () => {
  const [cards, setCards] = useState(window.innerWidth < 640 ? 2 : 4);

  useEffect(() => {
    const handle = () => setCards(window.innerWidth < 640 ? 2 : 4);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return cards;
};

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  const cardsPerPage = useCardsPerPage();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState<Song[]>([]);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    if (!songs) return;
    setVisible(songs.slice(index, index + cardsPerPage));
  }, [songs, index, cardsPerPage]);

  useEffect(() => {
    setIndex(0);
  }, [cardsPerPage]);

  const canGoBack = index > 0;
  const canGoForward = (songs?.length ?? 0) > index + cardsPerPage;

  if (isLoading) return <SectionGridSkeleton />;
  if (!songs) return null;

  const navigate = (dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);

    setTimeout(() => {
      setIndex((prev) =>
        dir === "right"
          ? Math.min(prev + cardsPerPage, songs.length - cardsPerPage)
          : Math.max(prev - cardsPerPage, 0)
      );
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("left")}
            disabled={!canGoBack || animating}
            className="p-1 rounded-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4 cursor-pointer" />
          </button>
          <button
            onClick={() => navigate("right")}
            disabled={!canGoForward || animating}
            className="p-1 rounded-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4 cursor-pointer" />
          </button>
        
        </div>
      </div>

      <div
        style={{
          transition: "opacity 200ms ease, transform 200ms ease",
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${direction === "right" ? "-20px" : "20px"})`
            : "translateX(0px)",
        }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {visible.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;