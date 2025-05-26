import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const userKey = `journal-entries-${userId}`
    const entries = (await redis.get(userKey)) || []
    return Response.json({ entries })
  } catch (error) {
    console.error("Redis GET error:", error)
    return Response.json({ entries: [] }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const entry = await request.json()
    const userId = entry.userId

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const userKey = `journal-entries-${userId}`

    // Get existing entries for this user
    const existingEntries = (await redis.get(userKey)) || []

    // Add new entry to the beginning
    const updatedEntries = [entry, ...existingEntries]

    // Store back to Redis with user-specific key
    await redis.set(userKey, updatedEntries)

    return Response.json({ success: true, entry })
  } catch (error) {
    console.error("Redis POST error:", error)
    return Response.json({ error: "Failed to save entry" }, { status: 500 })
  }
}
