import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return(
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
        <SignIn />
        <div className="h-30 w-30 bg-red-500"></div>
    </div>
    )
}