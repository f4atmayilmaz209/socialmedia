"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { useRouter } from 'next/router'
import { redirect } from "next/navigation";

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


export const addPost=async(formData:FormData,img:string)=>{
    

    const desc=formData.get("desc") as string;
    const Desc=z.string().min(1).max(255)
    const validatedDesc=Desc.safeParse(desc)

    if(!validatedDesc.success){
        console.log("description is not value!")
        return
    }
    const {userId}=auth()
    if(!userId) throw new Error("User is not authenticated!")

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
    "use server";

    const username=formData.get("name") as string;
    const Name=z.string().min(1).max(255)
    const validatedName=Name.safeParse(username)
    const surname=formData.get("surname") as string;
    const Surname=z.string().min(1).max(255)
    const validatedSurname=Surname.safeParse(surname)
    const password=formData.get("password") as string;
    const Password=z.string().min(1).max(255)
    const validatedPassword=Password.safeParse(password)
    const email=formData.get("email") as string;
    const Email=z.string().email().min(1).max(255)
    const validatedEmail=Email.safeParse(email)


    if(!validatedName.success){
        console.log("name is not value!")
        return
    }

    try {   
        const user=await prisma.user.create({
            data:{
                username,
                surname,
                password,
                email
            }
        })

    } catch (error) {
        console.log(error)
    }


   redirect(`https://socialmedia-uhsb-p3wfky1hs-f4atmayilmaz209s-projects.vercel.app/login`)
}


export const loginUser=async(formData:FormData)=>{

    const password=formData.get("password") as string;
    const Password=z.string().min(1).max(255)
    const validatedPassword=Password.safeParse(password)
    const email=formData.get("email") as string;
    const Email=z.string().email().min(1).max(255)
    const validatedEmail=Email.safeParse(email)
}