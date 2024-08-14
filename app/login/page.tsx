"use client"

import {loginUser } from "@/lib/actions";

export default function Page() {

  return(
    <div className="h-[calc(100vh-96px)] flex items-center justify-center min-w-[800px]">

        <div className="h-[400px] w-[350px] shadow-xl rounded-md items-center justify-center flex bg-slate-400">
 
          <form action={(formData)=>loginUser(formData)}> 
            <span className="text-heading2-bold text-blue-900 items-center justify-center flex top-0">Login</span>
            <div className='flex flex-col gap-2 mb-4'>
            <label htmlFor="">Email</label>
            <input name="email" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="text" placeholder="Email"/>
            </div>
            <div className='flex flex-col gap-2 mb-10'>
            <label htmlFor="">Password</label>
            <input name="password" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="password" placeholder="Password"/>
            </div>
            <button className="text-md shadow-md bg-red-300 p-2 ml-3 rounded-lg">Login</button>

          </form>
        </div>
    </div>
    )
}