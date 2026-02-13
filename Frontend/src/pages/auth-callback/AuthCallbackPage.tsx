import { Loader } from "lucide-react"
import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../../lib/axios"

const AuthCallbackPage = () => {
  const {isLoaded, user} = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
    useEffect(() => {
      const syncUser = async () => {
         if (!isLoaded || !user || syncAttempted.current) return;
        try{
          syncAttempted.current = true;
         

          await axiosInstance.post("/auth/callback", {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          })

        }catch(error) {
          console.error("Error in auth callback:", error);
        }finally{
          navigate("/")
        }
      }

      syncUser();
    }, [isLoaded, user, navigate])
  return (
    <div className='h-screen w-full bg-[#121212] flex items-center justify-center'>
      <div className='bg-[#171717] w-[90%] max-w-md border-[#181818] rounded-xl'>
        <div className='flex flex-col items-center gap-4 py-6'>
          <Loader className="size-6 text-blue-500 animate-spin"/>
          <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
          <p className="text-zinc-500 text-sm">Redirecting...</p>
        </div>
      </div>
    </div>
  )
}

export default AuthCallbackPage