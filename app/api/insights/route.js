import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { content, mood, emotions, lifeAreas, challenges, achievements } = await request.json()

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate contextual insights based on input
    const insights = generateInsights({
      content,
      mood,
      emotions,
      lifeAreas,
      challenges,
      achievements,
    })

    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error("Generate insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

function generateInsights({ content, mood, emotions, lifeAreas, challenges, achievements }) {
  const templates = [
    {
      condition: (data) => data.mood >= 8,
      insight:
        "Your high mood score suggests you're in a positive mental state. This is an excellent time to tackle challenging goals and build momentum in your {primaryArea} journey.",
    },
    {
      condition: (data) => data.mood <= 4,
      insight:
        "Your mood indicates you might be going through a difficult period. Remember that this is temporary, and focusing on {primaryArea} activities could help improve your emotional state.",
    },
    {
      condition: (data) => data.emotions.includes("grateful"),
      insight:
        "Your gratitude practice is showing positive effects on your mindset. Research shows that grateful individuals tend to have better {primaryArea} outcomes and stronger resilience.",
    },
    {
      condition: (data) => data.emotions.includes("anxious") || data.emotions.includes("stressed"),
      insight:
        "The anxiety you're experiencing is common during growth periods. Consider incorporating mindfulness practices into your {primaryArea} routine to manage stress more effectively.",
    },
    {
      condition: (data) => data.achievements.length > 0,
      insight:
        "Celebrating your achievements like '{achievement}' is crucial for maintaining motivation. This success in {primaryArea} shows your capability to overcome challenges.",
    },
    {
      condition: (data) => data.challenges.length > 0,
      insight:
        "The challenges you're facing with {challenge} are growth opportunities in disguise. Your awareness of these obstacles is the first step toward overcoming them.",
    },
    {
      condition: (data) => data.lifeAreas.includes("health"),
      insight:
        "Your focus on health is foundational to all other life areas. The mind-body connection means that improvements in physical wellness often lead to enhanced {secondaryArea} performance.",
    },
    {
      condition: (data) => data.lifeAreas.includes("career"),
      insight:
        "Career development requires consistent effort and strategic thinking. Your current emotional state suggests you're {moodState} positioned to make meaningful professional progress.",
    },
  ]

  const data = { content, mood, emotions, lifeAreas, challenges, achievements }
  const primaryArea = lifeAreas[0] || "personal growth"
  const secondaryArea = lifeAreas[1] || "overall well-being"
  const achievement = achievements[0] || "your recent accomplishment"
  const challenge = challenges[0] || "current obstacles"
  const moodState = mood >= 7 ? "well" : mood >= 5 ? "moderately" : "currently challenged but still"

  // Find matching template
  const matchingTemplate = templates.find((template) => template.condition(data))
  const selectedTemplate = matchingTemplate || templates[Math.floor(Math.random() * templates.length)]

  // Replace placeholders
  const insight = selectedTemplate.insight
    .replace(/{primaryArea}/g, primaryArea.replace("-", " "))
    .replace(/{secondaryArea}/g, secondaryArea.replace("-", " "))
    .replace(/{achievement}/g, achievement.replace("-", " "))
    .replace(/{challenge}/g, challenge.replace("-", " "))
    .replace(/{moodState}/g, moodState)

  return insight
}
