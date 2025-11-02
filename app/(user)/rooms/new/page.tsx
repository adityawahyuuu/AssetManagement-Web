"use client"

import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import RoomForm from "@/components/forms/room-form"

export default function NewRoomPage() {
  const router = useRouter()

  const handleSuccess = (roomId: number) => {
    // Redirect to the new room page
    router.push(`/rooms/${roomId}`)
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  return (
    <MainLayout>
      <PageHeader
        title="Add New Room"
        description="Create a new room and start managing your assets"
      />
      <div className="max-w-3xl">
        <RoomForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </MainLayout>
  )
}
