"use client"
import { updateProfile } from '@/lib/actions'
import { User } from '@prisma/client'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useActionState, useState } from 'react'
import UpdateButton from './UpdateButton'
import { useFormState } from 'react-dom';


const UpdateUser = ({user}:{user:User}) => {

  const [open,setOpen]=useState(false)

  const [cover,setCover]=useState<any>(false)
  const [state,formAction]=useFormState(updateProfile,{success:false,error:false})
  
  const handleClose=()=>{
    setOpen(false)
    state.success && router.refresh()
  }



  const router=useRouter()


  return (
    <div className=''>
      <span 
        className='text-blue-500 text-xs cursor-pointer' 
        onClick={()=>setOpen(true)}
      >
        Update
      </span>
        {open && (
        <div className='absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50'>
          <form 
            action={(formData)=>formAction({formData,cover:cover?.secure_url || ""})}
            className='p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative'>
            <h1>Update Profile</h1>
            <div className='mt-4 text-xs text-gray-500'>
              Use the navbar profile to change the avatar or username
            </div>
            <CldUploadWidget uploadPreset='social_media' onSuccess={(result)=>setCover(result.info)}>
              {({open})=>{
                return(
                    <div className='flex flex-col gap-4 my-4' onClick={()=>open()}>
                      <label htmlFor="">Cover Picture</label>
                      <div className='flex items-center gap-2 cursor-pointer'>
                        <Image src={user.cover || "/noCover.png"} alt="" width={48} height={32} className="w-12 h-8 rounded-md object-cover"/>
                        <span className='text-xs underline text-gray-600'>Change</span>
                      </div>
                    </div>
                )
              }}

            </CldUploadWidget>

            {/*INPUT*/}
            <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
              <div className='flex flex-col gap-4'>
                <label htmlFor="">First Name</label>
                <input name="name" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.name || "John"}/>
              </div>


              <div className='flex flex-col gap-4'>
                <label htmlFor="">Surname</label>
                <input name="surname" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.surname || "Doe"}/>
              </div>
 

              <div className='flex flex-col gap-4'>
                <label htmlFor="">Description</label>
                <input name="description" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.description || "Life is beautiful..."}/>
              </div>


              <div className='flex flex-col gap-4'>
                <label htmlFor="">City</label>
                <input name="city" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.city || "New York"}/>
              </div>


              <div className='flex flex-col gap-4'>
                <label htmlFor="">School</label>
                <input name="school" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.school || "MIT"}/>
              </div>


              <div className='flex flex-col gap-4'>
                <label htmlFor="">Work</label>
                <input name="work" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.work || "Apple Inc."}/>
              </div>


              <div className='flex flex-col gap-4'>
                <label htmlFor="">Website</label>
                <input name="website" className='ring-1 ring-gray-300 p-[13px] rounded-md text-sm' type="text" placeholder={user.website || "social.media"}/>
              </div>
              </div>

            <button className='bg-blue-500 p-2 mt-2 rounded-md text-white'>
              Update
            </button>
            <UpdateButton/>
            {state.success && <span className='text-green-500'>Profile has been updated!</span>}
            {state.error && <span className='text-red-500'>Something went wrong!</span>}
            <div className='absolute text-xl right-2 top-3 cursor-pointer' onClick={handleClose}>X</div>
          </form>

        </div>
      )}
    </div>
  )
}

export default UpdateUser