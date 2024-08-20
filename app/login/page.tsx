"use client"

import { useAuthStore } from "@/lib/store";
import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'

export default function Page() {
  
  const router = useRouter()
  const [credentials, setCredentials] = useState({username: "", password: "",});
  const loginUserItem = useAuthStore((state) => state.loginUser);
  const user=useAuthStore((state)=>state.user)


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = credentials;
      await loginUserItem(username, password);
      if(user){
        router.push('/', { scroll: false })
      }

    } catch (error) {
      console.log("No se pudo autenticar");
    }
  };
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setCredentials(prevState => ({
        ...prevState,
        [name]: value
    }));
  }


  return(
    <div className="h-[calc(100vh-96px)] flex items-center justify-center min-w-[800px]">

        <div className="h-[400px] w-[350px] shadow-xl rounded-md items-center justify-center flex bg-slate-400">
 
          <form onSubmit={handleSubmit}> 
            <span className="text-heading2-bold text-blue-900 items-center justify-center flex top-0">Login</span>
            <div className='flex flex-col gap-2 mb-4'>
            <label htmlFor="">Username</label>
            <input value={credentials.username} onChange={handleChange} name="username" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="text" placeholder="Username"/>
            </div>
            <div className='flex flex-col gap-2 mb-10'>
            <label htmlFor="">Password</label>
            <input value={credentials.password} onChange={handleChange} name="password" className='ring-1 ring-gray-300 p-[10px] rounded-md text-sm' type="password" placeholder="Password"/>
            </div>
            <button className="text-md shadow-md bg-red-300 p-2 ml-3 rounded-lg">Login</button>

          </form>
        </div>
    </div>
    )
}