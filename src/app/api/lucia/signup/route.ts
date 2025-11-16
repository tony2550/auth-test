import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { hashPassword } from "@/lib/lucia/password"
import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/lucia/session"
import { z } from "zod"

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.luciaUser.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.luciaUser.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: passwordHash,
        role: "USER",
      },
    })

    // Create session
    const token = generateSessionToken()
    const session = await createSession(token, user.id)
    await setSessionTokenCookie(token, session.expiresAt)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "User created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("SignUp error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
