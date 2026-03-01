import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlbums } from "@/hooks/useMusic";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const AddSongDialog = () => {
   const { data: albums} = useAlbums();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
	 const [isLoading, setIsLoading] = useState(false);

   interface NewSong {
    title: string;
    artist: string;
    album: string;
    duration: string;
  }

   const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "",
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

  const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      if (!files.audio || !files.image){
        return toast.error("Please upload both audio and image files")
      }

      const formData = new FormData();
      formData.append("title", newSong.title)
      formData.append("duration", newSong.duration)
      formData.append("artist", newSong.artist)

      if(newSong.album && newSong.album !== "none"){
        formData.append("albumId", newSong.album)
      }

      formData.append("imageFile", files.image);
      formData.append("audioFile", files.audio);

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0",
      })

      setFiles({
        audio: null,
		    image: null,
      })

      toast.success("Song added successfully!")
      setIsDialogOpen(false)
    }catch(error: any) {
      toast.error("Failed to add song: " + error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="cursor-pointer">
          <Plus className="size-4 mr-2"/>
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-auto text-amber-50 dark">
        <DialogHeader>
          <DialogTitle>Add new song</DialogTitle>
          <DialogDescription>Add a new song to your music library</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input hidden type="file" accept="audio/" ref={audioInputRef} onChange={(e) => setFiles((prev) => ({...prev, audio: e.target.files![0]}))}/>
          <input hidden type="file" accept="image/" ref={imageInputRef} onChange={(e) => setFiles((prev) => ({...prev, image: e.target.files![0]}))}/>
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer" onClick={() => imageInputRef.current?.click()}>
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className='space-y-2'>
                    <div className='text-sm text-emerald-500'>Image selected:</div>
                    <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
								  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 inline-block mb-2 bg-zinc-800 rounded-full">
                    <Upload/>
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">Upload Song Cover</div>
                  <Button className="text-xs cursor-pointer" variant={"outline"} size='sm'>Choose File</Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => audioInputRef.current?.click()} className="w-full cursor-pointer">
                {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Title</label>
             <Input value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} className="bg-zinc-800 border-zinc-700"/>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Artist</label>
             <Input value={newSong.artist} onChange={(e) => setNewSong({...newSong, artist: e.target.value})} className="bg-zinc-800 border-zinc-700"/>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Duration</label>
             <Input type="number" min="0" value={newSong.duration} onChange={(e) => setNewSong({...newSong, duration: e.target.value || "0"})} className="bg-zinc-800 border-zinc-700 "/>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Album (Optional)</label>
             <Select value={newSong.album} onValueChange={(value) => setNewSong({...newSong, album: value})}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select Album"/>
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 dark ">
                <SelectItem className="cursor-pointer" value="none">No Album</SelectItem>
                {albums?.map((album) => (
                  <SelectItem className="cursor-pointer" value={album._id} key={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
             </Select>
          </div>

          <DialogFooter>
            <Button className="cursor-pointer" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button className="cursor-pointer" disabled={isLoading || !files.image || !files.audio || !newSong.title || !newSong.artist} onClick={handleSubmit}>
              {isLoading  ? "Uploading..." : "Add Song"}
            </Button>
          </DialogFooter>


       


        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddSongDialog