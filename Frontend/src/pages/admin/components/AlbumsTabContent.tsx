import AddAlbumDialog from "./AddAlbumDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AlbumsTable from "./AlbumsTable"
import { Music } from "lucide-react"

const AlbumsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500"/>
              Album Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
          <AddAlbumDialog/>
        </div>
      </CardHeader>
      <CardContent>
        <AlbumsTable/>
      </CardContent>
     </Card>
  )
}

export default AlbumsTabContent