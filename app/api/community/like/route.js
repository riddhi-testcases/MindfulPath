import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function POST(request) {
  try {
    const { postId, userId } = await request.json()

    if (!postId || !userId) {
      return NextResponse.json({ error: "Post ID and User ID required" }, { status: 400 })
    }

    const posts = (await redis.get("community:posts")) || []
    const postIndex = posts.findIndex((p) => p.id === postId)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = posts[postIndex]
    const likedBy = post.likedBy || []
    const hasLiked = likedBy.includes(userId)

    if (hasLiked) {
      // Unlike
      post.likedBy = likedBy.filter((id) => id !== userId)
      post.likes = Math.max(0, post.likes - 1)
    } else {
      // Like
      post.likedBy = [...likedBy, userId]
      post.likes = post.likes + 1
    }

    posts[postIndex] = post
    await redis.set("community:posts", posts)

    return NextResponse.json({ success: true, liked: !hasLiked, likes: post.likes })
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}
