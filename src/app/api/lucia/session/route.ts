import { NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/lucia/session"

export async function GET() {
  try {
    const { session, user } = await getCurrentSession()

    if (!session) {
      return NextResponse.json(
        { session: null, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
