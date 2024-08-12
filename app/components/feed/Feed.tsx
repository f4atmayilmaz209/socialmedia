import { auth } from "@clerk/nextjs/server"
import Post from "./Post"
import prisma from "@/lib/client";
import { allUsers } from "@/lib/actions";


const Feed = async({username}:{username?:string}) => {

  const {userId}=auth()

  let posts:any[]=[];

  if(username){
    posts=await prisma.post.findMany({
      where:{
        user:{
          username:username
        }
      },
      include:{
        user:true,
        likes:{
          select:{
            userId:true
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }
  if(!username && userId){
    const following=await prisma.follower.findMany({
      where:{
        followerId:userId
      },
      select:{
        followingId:true
      }
    })
    const followingsIds=following.map(f=>f.followingId)
    const ids=[userId,...followingsIds]

    posts=await prisma.post.findMany({
      where:{
        userId:{
          in:ids
        }
      },
      include:{
        user:true,
        likes:{
          select:{
            userId:true
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }
  const users=await allUsers()

  let allPosts:any[]=[];
  if(!userId){
    allPosts = await prisma.post.findMany({
      where:{
        userId:{
          in:users?.map(user => user?.id)
        }
      },
      include:{
        user:true,
        likes:{
          select:{
            userId:true
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    }

  );

  }
  return (
    <div className='p-4 bg-white shadow-md rounded-lg flex flex-col gap-12'>
      {allPosts?.length ? (allPosts.map(post=>(
        <Post key={post.id} post={post}/>
      ))) : "No posts found!"}
      {posts?.length && (posts.map(post=>(
        <Post key={post.id} post={post}/>
      )))}


    </div>
  )
}

export default Feed