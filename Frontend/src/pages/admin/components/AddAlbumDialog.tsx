import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   interface NewAlbum {
    title: string;
    artist: string;
    releaseYear: number;
  }

   const [newAlbum, setNewAlbum] = useState<NewAlbum>({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

  const [imageFile, setImageFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
	};

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      if (!imageFile){
        return toast.error("Please upload image file")
      }

      const formData = new FormData();
      formData.append("title", newAlbum.title)
      formData.append("releaseYear", newAlbum.releaseYear.toString())
      formData.append("artist", newAlbum.artist)
      formData.append("imageFile", imageFile);

      await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setNewAlbum({
        title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
      })

      setImageFile(null)

      toast.success("Album added successfully!")
      setIsDialogOpen(false)
    }catch(error: any) {
      toast.error("Failed to add album: " + error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700 text-amber-50 dark'>
				<DialogHeader>
					<DialogTitle>Add New Album</DialogTitle>
					<DialogDescription>Add a new album to your collection</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<input
						type='file'
						ref={imageInputRef}
						onChange={handleImageSelect}
						accept='image/*'
						className='hidden'
					/>
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => imageInputRef.current?.click()}
					>
						<div className='text-center'>
							<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
								<Upload className='h-6 w-6 text-zinc-400' />
							</div>
							<div className='text-sm text-zinc-400 mb-2'>
								{imageFile ? imageFile.name : "Upload album artwork"}
							</div>
							<Button variant='outline' size='sm' className='text-xs'>
								Choose File
							</Button>
						</div>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Title</label>
						<Input
							value={newAlbum.title}
							onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter album title'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={newAlbum.artist}
							onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter artist name'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Release Year</label>
						<Input
							type='number'
							value={newAlbum.releaseYear}
							onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter release year'
							min={1900}
							max={new Date().getFullYear()}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button className="cursor-pointer" variant='outline' onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className="cursor-pointer"
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
					>
						{isLoading ? "Creating..." : "Add Album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
  )
}

export default AddAlbumDialog