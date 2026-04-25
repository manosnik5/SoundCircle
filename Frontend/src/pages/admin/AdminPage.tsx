import { useAdminCheck } from "@/hooks/useMusic"
import Header from "./components/Header";
import DashBoardStats from "./components/DashBoardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Music, ArrowLeft } from "lucide-react";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const { data: isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
 
  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;
  return (
    <div className='bg-[#121212] min-h-screen text-zinc-100 p-8'>
      <Header>
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 cursor-pointer"
        >
          <ArrowLeft className="size-4"/>
          Return to Home
        </Button>
      </Header>
      <DashBoardStats/>
      <Tabs defaultValue="songs" className="space-y-6 dark">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="songs" className="data-state-active:bg-zinc-700 cursor-pointer">
            <Music className="mr-2 size-4"/>
            Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="data-state-active:bg-zinc-700 cursor-pointer">
            <Album className="mr-2 size-4"/>
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <SongsTabContent/>
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage