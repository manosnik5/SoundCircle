import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSongs } from "@/hooks/useMusic";
import { Calendar, Trash2 } from "lucide-react";
import { useDeleteSong } from "@/hooks/useMusic";

const SongsTable = () => {
    const { data: songs, isLoading, error} = useSongs();
    const deleteSongMutation = useDeleteSong();

    if (isLoading) {
        return (
            <div className="flex items-center justify-between p-8">
                <div className="text-zinc-400">Loading songs...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-between p-8">
                <div className="text-red-400">{error}</div>
            </div>
        )
    }

    const handleDelete = (songId: string) => {

      deleteSongMutation.mutate(songId);
      
    
  };
    return (
        <Table>  
            <TableHeader>
                </TableHeader> 
                <TableRow>
                    <TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
                </TableRow>
                <TableBody>

                </TableBody>
                    {songs?.map((song) => (
                    <TableRow key={song._id} className="hover:bg">
                        <TableCell>
							<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
						</TableCell>
                        <TableCell className='font-medium'>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>
                        <TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer'
									onClick={() => handleDelete(song._id)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						</TableCell>
                    </TableRow>
        ))}
        </Table>
    )
}

export default SongsTable