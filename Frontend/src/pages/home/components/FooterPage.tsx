import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/MusicPlayerContext";
import { useState, useEffect } from "react";

const FooterPage = () => {
  const { currentSong } = usePlayer();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col w-full mt-24 dark ${
        isMobile
          ? currentSong
            ? "pb-10"
            : "pb-0"
          : "pb-0"
      }`}
    >
      {/* MAIN FOOTER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-[#1a1b1d] border border-x-0 border-zinc-800 py-8 px-4">
        
        <div className="flex flex-col space-y-1 items-start">
          <h1 className="font-semibold">Company</h1>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Information
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Jobs
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Communities
          </p>
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <h1 className="font-semibold">For Artists</h1>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Development Companies
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Advertising
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Investors
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Suppliers
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Useful Links
          </p>
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <h1 className="font-semibold">Support</h1>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Popular by Country
          </p>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-white">
            Upload Your Music
          </p>
        </div>

        {/* SOCIALS */}
        <div className="flex gap-3 items-start">
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <Instagram className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <Facebook className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
          >
            <Twitter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 px-4 pb-6">
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <h1 className="hover:text-white cursor-pointer">Legal</h1>
          <h1 className="hover:text-white cursor-pointer">
            Safety and Privacy Center
          </h1>
          <h1 className="hover:text-white cursor-pointer">Privacy Policy</h1>
          <h1 className="hover:text-white cursor-pointer">Accessibility</h1>
          <h1 className="hover:text-white cursor-pointer">About Ads</h1>
        </div>

        <h1 className="text-sm text-zinc-400">
          © 2026 SoundCircle
        </h1>
      </div>
    </div>
  );
};

export default FooterPage;