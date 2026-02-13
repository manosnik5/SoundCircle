import { Outlet } from "react-router-dom"
import LeftSidebar from "./components/LeftSidebar"
import FriendsActivity from "./components/FriendsActivity"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


const MainLayout = () => {
    const isMobile = false
  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col">
      <ResizablePanelGroup orientation="horizontal" className="flex-1 flex h-full p-2 ">
        <ResizablePanel defaultSize="20%" minSize={isMobile ? "0%" : "10%"} maxSize="30%">
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        <ResizablePanel defaultSize={isMobile ? "80%" : "60%"}>
          <Outlet />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"  />

        <ResizablePanel defaultSize="20%" minSize="0%" maxSize="25%">
          <FriendsActivity/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default MainLayout