import { Button } from '@/components/ui/button'
import { Frown, Home } from 'lucide-react'
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen flex pt-50 justify-center bg-[#1a1b1d]'>
        <div className='text-center space-y-8 px-4'>
            <div className='flex justify-center'>
				<Frown className='h-30 w-30 text-zinc-400' />
			</div>
            <div className='space-y-4'>
                <h1 className='text-7xl font-bold text-white'>404</h1>
                <h2 className='text-2xl font-semibold text-white'>Page not found</h2>
                <p className='text-neutral-400 max-w-md mx-auto'>
                    Looks like what you are trying to access doesn't exist. Let's get you back to the music.
                </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 dark'>
					<Button
						onClick={() => navigate(-1)}
						variant='outline'
						className='bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto cursor-pointer'
					>
						Go Back
					</Button>
					<Button
						onClick={() => navigate("/")}
						className='bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto cursor-pointer'
					>
						<Home className='mr-2 h-4 w-4' />
						Back to Home
					</Button>
				</div>
        </div>
    </div>
  )
}

export default NotFoundPage