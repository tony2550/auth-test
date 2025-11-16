import { NextResponse } from "next/server"
import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/lucia/session"

export async function POST() {
  try {
    const { session } = await getCurrentSession()

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    await invalidateSession(session.id)
    await deleteSessionTokenCookie()

    return NextResponse.json({ message: "Signed out successfully" })
  } catch (error) {
    console.error("SignOut error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
