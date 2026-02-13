import { SignedOut, SignedIn, SignOutButton } from '@clerk/clerk-react';
import { LayoutDashboardIcon } from 'lucide-react';
import SignInOAuthButton from './SignInOAuthButton';
import { Link } from 'react-router-dom';

const TopBar = () => {
    const isAdmin = false;
  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10'>
        <div className='flex gap-2 items-center'>
            logo
        </div>
        <div className='flex gap-4 items-center'>
            {
                isAdmin ? (
                    <Link to={"/admin"}>
                        <LayoutDashboardIcon className='size-4 mr-2'/>
                        Admin DashBoard
                    </Link>
                ) : (
                    <>
                        <SignedIn>
                            <SignOutButton/>
                        </SignedIn>
                        <SignedOut>
                            <SignInOAuthButton/>
                        </SignedOut>
                    </>
                  
                )
            }

           
        </div>
    </div>
  )
}

export default TopBar