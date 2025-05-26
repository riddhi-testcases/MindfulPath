import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function POST(request) {
  try {
    const { action, email, password, name } = await request.json()

    if (action === "signin") {
      // Get user from Redis
      const user = await redis.get(`user:${email}`)

      if (!user || user.password !== password) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({ success: true, user: userWithoutPassword })
    }

    if (action === "signup") {
      // Check if user already exists
      const existingUser = await redis.get(`user:${email}`)
      if (existingUser) {
        return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 })
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        password,
        avatar: `/placeholder.svg?height=40&width=40`,
        joinDate: new Date().toISOString(),
        plan: "free",
        settings: {
          notifications: true,
          publicProfile: false,
          emailUpdates: true,
        },
      }

      // Save user to Redis
      await redis.set(`user:${email}`, newUser)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser
      return NextResponse.json({ success: true, user: userWithoutPassword })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
