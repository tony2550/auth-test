import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { verifyPassword } from "@/lib/lucia/password"
import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/lucia/session"
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = signInSchema.parse(body)

    // Find user
    const user = await prisma.luciaUser.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      // Log failed login attempt
      await prisma.failedLogin.create({
        data: {
          email: validatedData.email,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || undefined,
          reason: "User not found",
        },
      })

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const validPassword = await verifyPassword(user.password, validatedData.password)

    if (!validPassword) {
      // Log failed login attempt
      await prisma.failedLogin.create({
        data: {
          email: validatedData.email,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || undefined,
          reason: "Invalid password",
        },
      })

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create session
    const token = generateSessionToken()
    const session = await createSession(token, user.id)
    await setSessionTokenCookie(token, session.expiresAt)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Signed in successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("SignIn error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
