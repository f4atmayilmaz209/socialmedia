"use client"
import Link from 'next/link'
import MobileMenu from './MobileMenu'
import Image from 'next/image'
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useAuthStore } from '@/lib/store'
import { useState } from 'react'



const Navbar = () => {

    const user=useAuthStore((state)=>state.user)
    const [control,setControl]=useState(false)
    const logoutUser = useAuthStore((state) => state.logoutUser);



    const handleLogout = async () => {

        try {
          await logoutUser();
        } catch (error) {
          console.log("No se pudo autenticar");
        }
      };
  return (
    <div className='h-24 flex items-center justify-between'>
        {/*left*/}
        <div className='md:hidden lg:block w-[20%]'>
            <Link href="/" className='font-bold text-xl text-blue-600'>SOCIALMEDIA</Link>
        </div>
        {/*center*/}
        <div className='hidden md:flex w-[50%] text-sm items-center justify-between'>
            {/*links*/}
            <div className='flex gap-6 text-gray-600'>
                <Link href="/" className='flex items-center gap-2'>
                   <Image src="/home.png" alt="Homepage" width={16} height={16} className='w-4 h-4'/>
                   <span>Homepage</span> 
                </Link>
                <Link href="/" className='flex items-center gap-2'>
                   <Image src="/friends.png" alt="Friends" width={16} height={16} className='w-4 h-4'/>
                   <span>Friends</span> 
                </Link>
                <Link href="/" className='flex items-center gap-2'>
                   <Image src="/stories.png" alt="Stories" width={16} height={16} className='w-4 h-4'/>
                   <span>Stories</span> 
                </Link>
            </div>
            <div className='hidden xl:flex bg-slate-100 items-center rounded-xl'>
                <input type="text" placeholder="search..." className='bg-transparent outline-none'/>
                <Image src="/search.png" alt="" width={14} height={14}/>
            </div>
        </div>
        {/*right*/}
        {!user && (<>
        <div className='w-[30%] flex items-center gap-4 xl:gap-8 justify-end'>
            <ClerkLoading>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
            </ClerkLoading>
            <ClerkLoaded>
                <SignedIn>
                    <div className='cursor-pointer'>
                        <Image src="/people.png" alt="" width={24} height={24}/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src="/messages.png" alt="" width={20} height={20}/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src="/notifications.png" alt="" width={20} height={20}/>
                    </div>
                    <UserButton/>
                </SignedIn>
                {!user && (<SignedOut>
                    <div className='flex items-center gap-1 justify-between text-sm'>
                        <Image src="/login.png" alt="" width={20} height={20}/>
                        <Link href="/sign-in">Login/Register</Link>
                    </div>
                </SignedOut>)
                }
            </ClerkLoaded>

            <MobileMenu/>
        </div>
        </>)}
        {user && (<>
                <div className='w-[20%] flex items-center gap-4 xl:gap-8 justify-end'>
                    <div className='cursor-pointer'>
                        <Image src="/people.png" alt="" width={24} height={24}/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src="/messages.png" alt="" width={20} height={20}/>
                    </div>
                    <div className='cursor-pointer'>
                        <Image src="/notifications.png" alt="" width={20} height={20}/>
                    </div>
                    <div className='cursor-pointer relative' onClick={()=>setControl(prev=>!prev)}>
                        <Image className="w-10 h-10 rounded-full object-cover" src={ user?.cover || "/noCover.png"} alt="" width={10} height={10}/>
                        {control && <div onClick={()=>handleLogout()} className='flex flex-col absolute top-2 left-14 right-30 h-18 w-30 p-1 rounded-2xl z-10 text-gray-600 items-center justify-center text-xs ring-1 ring-cyan-600 font-sans'>Logout</div>}
                    </div>

                </div>
            
            </>)}
    </div>

  )
}

export default Navbar