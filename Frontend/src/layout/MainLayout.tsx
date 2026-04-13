import { Outlet, useNavigate } from "react-router-dom"
import LeftSidebar from "./components/LeftSidebar"
import FriendsActivity from "./components/FriendsActivity"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import PlayBackControls from "./components/PlayBackControls"
import AudioPlayer from "./components/AudioPlayer"
import BottomBarMenu from "./components/BottomBarMenu"
import MobileMiniPlayer from "./components/MobileMiniPlayer"
import MobilePlayBackPanel from "./components/MobilePlayBackPanel"
import { useEffect, useState } from "react"


const MainLayout = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false)
    const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

    useEffect(() => {
      const handleMobile = () => {
        setIsMobile(window.innerWidth < 768);
      }

      handleMobile()
      window.addEventListener("resize", handleMobile)

      return () => window.removeEventListener("resize", handleMobile)
    }, [])

    useEffect(() => {
      if (!isMobile && mobilePanelOpen) {
        setMobilePanelOpen(false);
        navigate("/");
      }
    }, [isMobile, mobilePanelOpen, navigate])
  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col">
      <AudioPlayer/>
      <ResizablePanelGroup orientation="horizontal" className="flex-1 flex h-full p-2 ">
         {!isMobile && (
          <>
            
            <ResizablePanel defaultSize="20%" minSize={isMobile ? "0%" : "10%"} maxSize="30%">
              <LeftSidebar />
            </ResizablePanel>
        <ResizableHandle className="w-1 hover:bg-[#36393e] bg-[#121212] transition-colors" /></>
         )}
        

        <ResizablePanel defaultSize={isMobile ? "80%" : "60%"}>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-1 bg-[#121212] hover:bg-[#36393e] transition-colors"  />
            <ResizablePanel defaultSize="20%" minSize="0%" maxSize="25%">
              <FriendsActivity/>
            </ResizablePanel></>
          
        )}

       
      </ResizablePanelGroup>
      {isMobile ? (
        <>
          <div className="flex justify-center">
            <MobileMiniPlayer onOpen={() => setMobilePanelOpen(true)} />
          </div>
          <BottomBarMenu />
        </>
      ) : (
        <PlayBackControls />
      )}
      {mobilePanelOpen && <MobilePlayBackPanel onClose={() => setMobilePanelOpen(false)} />}
    </div>
  )
}

export default MainLayout