"use client"
import { SignIn } from "@clerk/nextjs";
import { createUser } from "@/lib/actions";
import { useState } from "react";
import Link from "next/link";

export default function Page() {


  return(
    <div className="h-[calc(100vh-96px)] flex items-center justify-center min-w-[800px] gap-12">
        <SignIn />
        <div className="h-[540px] w-[350px] shadow-xl rounded-md items-center justify-center flex m-auto">
 
          <form action={(formData)=>createUser(formData)}> 
            <span className="text-heading2-bold text-blue-400 items-center justify-center flex mt-30"><Link href="/login" className="underline">Login</Link>/Register</span>

            <div className='flex flex-col gap-2 mb-4 mt-10'>
              <label htmlFor="">Name</label>
              <input name="name" className='ring-1 ring-gray-300 p-[10px] w-[250px] rounded-md text-sm' type="text" placeholder="Name"/>
            </div>

            <div className='flex flex-col gap-2 mb-4'>
              <label htmlFor="">Surname</label>
              <input name="surname" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="text" placeholder="Surname"/>
            </div>
            
            <div className='flex flex-col gap-2 mb-4'>
            <label htmlFor="">Email</label>
            <input name="email" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="text" placeholder="Email"/>
            </div>
            <div className='flex flex-col gap-2 mb-10'>
            <label htmlFor="">Password</label>
            <input name="password" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="password" placeholder="Password"/>
            </div>
            <button className="text-md">Create</button>

          </form>
        </div>
    </div>
    )
}