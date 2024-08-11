"use client"

import { addComment } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { Comment, User } from "@prisma/client"
import Image from "next/image"
import { useOptimistic, useState } from "react"


type CommentWithUser=Comment & {user:User}

const CommentList = ({
    comments,
    postId
}:{comments:CommentWithUser[],postId:string}) => {

    const {user}=useUser()
    const [commentState,setCommentState]=useState(comments)
    const [desc,setDesc]=useState("")

    const [optimisticComment,addOptimisticComment]=useOptimistic(commentState,(state,value:CommentWithUser)=>[value,...state])

    const add=async()=>{
        if(!user || !desc) return;
        addOptimisticComment({
            id:Math.random().toString(),
            desc,
            createdAt:new Date(Date.now()),
            updatedAt:new Date(Date.now()),
            userId:user.id,
            postId:postId,
            user:{
                id:user.id,
                username:"Sending Please Wait...",
                avatar:user.imageUrl || "/noAvatar.png",
                cover:"",
                description:"",
                name:"",
                surname:"",
                city:"",
                work:"",
                school:"",
                website:"",
                createdAt:new Date(Date.now())
            }
        })
        try {
            const createdComment=await addComment(postId,desc)
            setCommentState((prev)=>[createdComment,...prev])
        } catch (error) {
            
        }
    }

    return (
    <>
        {user && (

            <div className='flex items-center gap-4'>
                <Image src={user?.imageUrl || "noAvatar.png"} alt="" width={32} height={32} className='w-10 h-10 rounded-full' />
                <form action={add} className='flex shadow-lg gap-1 bg-slate-200 rounded-md w-full h-10 items-center'>
                    <input onChange={(e:any)=>setDesc(e.target.value)} type="text" placeholder=' Write a comment...' className='w-[95%] h-full bg-slate-200 rounded-xl outline-none p-2' />
                    <Image src="/emoji.png" width={16} height={16} alt="" className='ring-2 ring-white rounded-full cursor-pointer object-cover w-6 h-6' />
                </form>

            </div>
        )}
        {/*COMMENTS*/}
        <div className='flex items-center gap-8 text-xs text-gray-500'>
            {/*Comment*/}
            {optimisticComment.map(comment=>(
                <div key={comment.id} className='flex justify-between gap-4 w-full lg:w-full mt-6'>
                {/*AVATAR*/}
                <Image src={comment.user.avatar || "noAvatar.png"} alt="" width={30} height={8} className='w-[15%] h-12 lg:w-[30%] rounded-full object-cover' />
                {/*DESC*/}
                <div className='flex flex-col gap-2'>
                    <span className='font-medium'>
                        {comment.user.name && comment.user.surname ? comment.user.name + " " + comment.user.surname : comment.user.username}
                    </span>
                    <p>{comment.desc}</p>
                    <div className='flex items-center gap-8 text-xs text-gray-500'>
                        <div className='flex items-center gap-4'>
                            <Image src="/like.png" alt="" width={12} height={12} className='cursor-pointer w-4 h-4' />
                            <span className='text-gray-300'>|</span>
                            <span className='text-gray-500'>0 Likes</span>
                        </div>
                        <div className=''>Reply</div>
                    </div>
                </div>
                {/*ICON*/}
                <Image src="/more.png" alt="" width={16} height={16} className='cursor-pointer w-4 h-4'></Image>

                </div>
            ))

            }
        </div>

    </>
    )
}

export default CommentList