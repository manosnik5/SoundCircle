import { Facebook, Instagram, Twitter} from 'lucide-react'
import { Button } from "@/components/ui/button";

const FooterPage = () => {
   return (
    <div className='flex flex-col w-full mt-24 dark'>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-[#1a1b1d] border border-l-0 border-r-0 border-zinc-800 py-8'>
        <div className='flex flex-col space-y-1 items-start'>
        <h1 className='font-semibold truncate'>Company</h1>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Information</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Jobs</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Communities</p>
        </div>
          <div className='flex flex-col space-y-1 items-start'>
        <h1 className='font-semibold truncate'>For Artists</h1>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Development Companies</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Advertising</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Investors</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Suppliers</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Useful Links</p>
        </div>
        <div className='flex flex-col space-y-1 items-start'>
        <h1 className='font-semibold truncate'>Support</h1>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Popular by Country</p>
            <p className='text-sm text-zinc-400 cursor-pointer hover:text-amber-50'>Upload Your Music</p>
        </div>
      
        <div className='flex gap-3'>
            <Button
                size='icon'
                variant='ghost'
                className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
            >
                <Instagram className='h-8 w-8' />
            </Button>
            <Button
                size='icon'
                variant='ghost'
                className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
            >
                <Facebook className='h-8 w-8' />
            </Button>
            <Button
                size='icon'
                variant='ghost'
                className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
            >
                <Twitter className='h-8 w-8' />
            </Button>
        </div>
        
    </div>
    <div className='flex flex-col lg:flex-row justify-between gap-4'>
        <div className='flex flex-wrap gap-4 text-sm text-zinc-400'>
            <h1 className='hover:text-white text-zinc-400 cursor-pointer'>Legal</h1>
            <h1 className='hover:text-white text-zinc-400 cursor-pointer'>Safety and Privacy Center</h1>
            <h1 className='hover:text-white text-zinc-400 cursor-pointer'>Privacy Policy</h1>
            <h1 className='hover:text-white text-zinc-400 cursor-pointer'>Accessibility</h1>
            <h1 className='hover:text-white text-zinc-400 cursor-pointer'>About Ads</h1>
    
        </div>
        <h1 className='text-sm text-zinc-400'>© 2026 SoundCircle</h1>
    </div>
    </div>
  )
}

export default FooterPage