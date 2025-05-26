import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function GET() {
  try {
    const posts = (await redis.get("community:posts")) || []
    return NextResponse.json({ posts: posts.slice(0, 20) }) // Return latest 20 posts
  } catch (error) {
    console.error("Get community posts error:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId, userName, title, content, lifeAreas, mood, goalAchieved } = await request.json()

    if (!userId || !userName || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPost = {
      id: Date.now().toString(),
      userId,
      author: userName,
      avatar: `/placeholder.svg?height=40&width=40`,
      title,
      content,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      lifeAreas: lifeAreas || [],
      goalAchieved: goalAchieved || false,
      mood: mood || 7,
      likedBy: [],
    }

    const existingPosts = (await redis.get("community:posts")) || []
    const updatedPosts = [newPost, ...existingPosts].slice(0, 100) // Keep only latest 100 posts

    await redis.set("community:posts", updatedPosts)
    return NextResponse.json({ success: true, post: newPost })
  } catch (error) {
    console.error("Create community post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
