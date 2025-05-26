import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const goals = (await redis.get(`goals:${userId}`)) || []
    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Get goals error:", error)
    return NextResponse.json({ goals: [] }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const goal = await request.json()
    const userId = goal.userId

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const existingGoals = (await redis.get(`goals:${userId}`)) || []
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedGoals = [newGoal, ...existingGoals]
    await redis.set(`goals:${userId}`, updatedGoals)

    return NextResponse.json({ success: true, goal: newGoal })
  } catch (error) {
    console.error("Create goal error:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { goalId, userId, updates } = await request.json()

    if (!userId || !goalId) {
      return NextResponse.json({ error: "User ID and Goal ID required" }, { status: 400 })
    }

    const goals = (await redis.get(`goals:${userId}`)) || []
    const goalIndex = goals.findIndex((g) => g.id === goalId)

    if (goalIndex === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await redis.set(`goals:${userId}`, goals)
    return NextResponse.json({ success: true, goal: goals[goalIndex] })
  } catch (error) {
    console.error("Update goal error:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const goalId = searchParams.get("goalId")

    if (!userId || !goalId) {
      return NextResponse.json({ error: "User ID and Goal ID required" }, { status: 400 })
    }

    const goals = (await redis.get(`goals:${userId}`)) || []
    const filteredGoals = goals.filter((g) => g.id !== goalId)

    await redis.set(`goals:${userId}`, filteredGoals)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete goal error:", error)
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 })
  }
}
