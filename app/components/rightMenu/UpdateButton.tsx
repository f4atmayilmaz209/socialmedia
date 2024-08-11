"use client"

import { useFormStatus } from "react-dom"

const UpdateButton = () => {


    const {pending}=useFormStatus()
  return (
    <>
    {pending && (
        <div className={` mt-2 rounded-md text-white ${pending ? "disabled:bg-opacity-50 disabled:cursor-not-allowed" : ""}`}>
            {pending ? "Updating..." : "Update"}
        </div>)
    }

    </>
  )
}

export default UpdateButton