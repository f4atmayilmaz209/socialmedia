"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { schema } from "./schema";


export const switchFollow=async(userId:string)=>{


    const {userId:currentUserId}=auth()

    if(!currentUserId){
        throw new Error("User is not authenticated!")
    }

    try {
        const existingFollow=await prisma.follower.findFirst({
            where:{
                followerId:currentUserId,
                followingId:userId
            }
        })
        if(existingFollow){
            await prisma.follower.delete({
                where:{
                    id:existingFollow.id,
                }
            })
        }else{
            const existingFollowRequest=await prisma.followRequest.findFirst({
                where:{
                    senderId:currentUserId,
                    receiverId:userId
                }
            })
            if(existingFollowRequest){
                await prisma.followRequest.delete({
                    where:{
                        id:existingFollowRequest.id
                    }
                })
            }else{
                await prisma.followRequest.create({
                    data:{
                        senderId:currentUserId,
                        receiverId:userId
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong...")
    }
}


export const switchBlock=async(userId:string)=>{
    const {userId:currentUserId}=auth()


    if(!currentUserId) {
        throw new Error("User is not authenticated")
    }

    try {
        const existingBlock=await prisma.block.findFirst({
            where:{
                blockerId:currentUserId,
                blockedId:userId
            }
        })
        if(existingBlock){
            await prisma.block.delete({
                where:{
                    id:existingBlock.id
                }
            })
        }else{
            await prisma.block.create({
                data:{
                    blockerId:currentUserId,
                    blockedId:userId
                }
            })
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong!")
    }
}

export const acceptFollowRequest=async(userId:string)=>{
    const {userId:currentUserId}=auth()


    if(!currentUserId){
        throw new Error("User is not Authenticated!")
    }
    try {
        const existingFollowRequest=await prisma.followRequest.findFirst({
            where:{
                senderId:userId,
                receiverId:currentUserId
            }
        })
        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where:{
                    id:existingFollowRequest.id
                }
            })
            await prisma.follower.create({
                data:{
                    followerId:userId,
                    followingId:currentUserId
                }
            })
        }  
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong!")
        
    }
    
}

export const declineFollowRequest=async(userId:string)=>{
    const {userId:currentUserId}=auth()


    if(!currentUserId){
        throw new Error("User is not Authenticated!")
    }
    try {
        const existingFollowRequest=await prisma.followRequest.findFirst({
            where:{
                senderId:userId,
                receiverId:currentUserId
            }
        })
        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where:{
                    id:existingFollowRequest.id
                }
            })

        }  
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong!")
        
    }
    
}

export const updateProfile=async(
    prevState:{success:boolean;error:boolean},
    payload:{formData:FormData,cover:string}
)=>{

    const {formData,cover}=payload;
    const fields=Object.fromEntries(formData)

    const filteredFields=Object.fromEntries(
        Object.entries(fields).filter(([_,value])=>value!=="")
    )
    console.log(fields)

    const Profile=z.object({
        cover:z.string().optional(),
        name:z.string().max(60).optional(),
        surname:z.string().max(60).optional(),
        description:z.string().max(255).optional(),
        city:z.string().max(60).optional(),
        school:z.string().max(60).optional(),
        work:z.string().max(60).optional(),
        website:z.string().max(60).optional(),

    })

    const validatedFields=Profile.safeParse({cover,...filteredFields})

    if(!validatedFields.success){
        console.log(validatedFields.error?.flatten().fieldErrors)
        return {success:false,error:true}
    }

    const {userId}=auth()
    if(!userId){
        return {success:false,error:true}
    }

    try {
        await prisma.user.update({
            where:{
                id:userId
            },
            data:validatedFields.data
        })
        return {success:true,error:false}
    } catch (error) {
        return {success:false,error:true}
    }
}

export const switchLike=async(postId:string)=>{
    const {userId}=auth()

    if(!userId) throw new Error("User is not authenticated!")

    try {
        const existingLike=await prisma.like.findFirst({
            where:{
                postId,
                userId
            }
        })

        if(existingLike){
            await prisma.like.delete({
                where:{
                    id:existingLike.id
                }
            })
        }else{
            await prisma.like.create({
                data:{
                    postId,
                    userId
                }
            })
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }
}


export const addComment=async(postId:string,desc:string)=>{

    const {userId}=auth()

    if(!userId) throw new Error("User is not authenticated!")

        try {
            const createdComment=await prisma.comment.create({
                data:{
                    desc,userId,postId
                },
                include:{
                    user:true
                }
            })
            return createdComment; 

        } catch (error) {
            console.log(error)
            throw new Error("Something went wrong!")
        }
}


export const addPost=async(formData:FormData,img:string,userId2?:string)=>{
    

    const desc=formData.get("desc") as string;
    const Desc=z.string().min(1).max(255)
    const validatedDesc=Desc.safeParse(desc)

    if(!validatedDesc.success){
        console.log("description is not value!")
        return
    }
    const {userId}=auth()
    
    if(!userId && !userId2) throw new Error("User is not authenticated!")
    if(userId){
        try {
            await prisma.post.create({
                data:{
                    desc:validatedDesc.data,
                    userId,
                    img
                }
            })
            revalidatePath("/")
        } catch (error) {
            console.log(error)
        }
    }else{
        try {
            const userId=userId2 as string
            await prisma.post.create({
                data:{
                    desc:validatedDesc.data,
                    userId,
                    img
                }
            })
            revalidatePath("/")
        } catch (error) {
            console.log(error)
        }
    }


}

export const addStory=async(img:string)=>{
    

    const {userId}=auth()
    if(!userId) throw new Error("User is not authenticated!")

    try {
        const existingStory=await prisma.story.findFirst({
            where:{
                userId
            }
        })

        if(existingStory){
            await prisma.story.delete({
                where:{
                    id:existingStory.id
                }
            })
        }
        const createdStory=await prisma.story.create({
            data:{
                userId,
                img,
                expiresAt:new Date(Date.now()+24*60*60*1000)
            },
            include:{
                user:true
            }
        })
        return createdStory;
    } catch (error) {
        console.log(error)
    }

}

export const deletePost=async(postId:string)=>{
    const {userId}=auth()

    if(!userId) throw new Error("User is not authenticated!")

    try {
        await prisma.post.delete({
            where:{
                id:postId,
                userId
            }
        })

        revalidatePath("/")
    } catch (error) {
        
    }
}
export const allUsers=async()=>{


    try {
        const users=await prisma.user.findMany()
        return users

    } catch (error) {
        
    }
}
 

export const createUser=async(formData:FormData)=>{

    const validation = schema.safeParse({
        username: formData.get("name") as string,
        surname: formData.get("surname") as string,
        email:formData.get("email") as string,
        password:formData.get("password") as string,
      });


    if(validation.success){
            
        const {password,...others} = validation?.data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user=await prisma.user.create({
            data:{
                username:validation.data.username,
                surname:validation.data.surname,
                email:validation.data.email,
                password:hashedPassword
            }
        })
    }else{
        return {
            errors: validation.error.flatten().fieldErrors,
          };
    }

   redirect(`http://localhost:3000/login`)


}



export const getUser=async(username:string)=>{



    const user=await prisma.user.findFirst({
        where:{
            username:username,

        },
        include:{
            _count:{
                select:{
                    followers:true,
                    following:true,
                    posts:true
                }
            }
        }
    })

    return user

}



export const getBlock=async(blockerId:string,blockedId:string)=>{
 
    const res=await prisma.block.findFirst({
        where:{
            blockerId:blockerId,
            blockedId:blockedId
        }
    })
    return res;


}
export const loginUserII=async(username:string,password:string)=>{



    let user;
    if(username){
        user=await prisma.user.findFirst({
        where:{
            username:username,

        },
        include:{
            _count:{
                select:{
                    followers:true,
                    following:true,
                    posts:true
                }
            }
        }
    })
    }
    if(user?.password){
        const match = await bcrypt.compare(password, user?.password);
        if(match){
            return user;
        }

    }
}