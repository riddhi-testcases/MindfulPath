"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Sparkles, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const lifeAreas = [
  "health",
  "career",
  "relationships",
  "personal-growth",
  "finance",
  "recreation",
  "family",
  "education",
  "spirituality",
  "creativity",
  "travel",
  "community",
]

const emotions = [
  "grateful",
  "happy",
  "excited",
  "peaceful",
  "confident",
  "motivated",
  "anxious",
  "frustrated",
  "sad",
  "overwhelmed",
  "hopeful",
  "inspired",
  "content",
  "energetic",
  "calm",
  "stressed",
]

const challenges = [
  "time-management",
  "work-stress",
  "relationship-issues",
  "health-concerns",
  "financial-pressure",
  "self-doubt",
  "procrastination",
  "communication",
  "work-life-balance",
  "decision-making",
]

const achievements = [
  "completed-task",
  "learned-something",
  "helped-someone",
  "exercised",
  "ate-healthy",
  "meditated",
  "connected-with-friend",
  "made-progress",
  "overcame-fear",
  "practiced-gratitude",
]

export default function NewJournalPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: [7],
    motivation: [7],
    energy: [7],
    goalAchieved: false,
    isPublic: false,
    lifeAreas: [],
    emotions: [],
    challenges: [],
    achievements: [],
    gratitude: ["", "", ""],
    goals: "",
  })
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [insights, setInsights] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const journalEntry = {
      id: Date.now().toString(),
      userId: user.id,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString(),
      mood: formData.mood[0],
      motivation: formData.motivation[0],
      energy: formData.energy[0],
      lifeAreas: formData.lifeAreas,
      goalAchieved: formData.goalAchieved,
      insights: insights,
      emotions: formData.emotions,
      challenges: formData.challenges,
      achievements: formData.achievements,
      gratitude: formData.gratitude.filter((item) => item.trim() !== ""),
      goals: formData.goals,
      isPublic: formData.isPublic,
    }

    try {
      // Try to save to Redis first
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journalEntry),
      })

      if (!response.ok) {
        throw new Error("Failed to save to Redis")
      }

      toast({
        title: "Entry saved successfully! 🎉",
        description: "Your journal entry has been recorded.",
      })
    } catch (error) {
      console.error("Error saving to Redis, falling back to localStorage:", error)
      // Fallback to localStorage with user-specific key
      const userKey = `journal-entries-${user.id}`
      const existingEntries = JSON.parse(localStorage.getItem(userKey) || "[]")
      existingEntries.unshift(journalEntry)
      localStorage.setItem(userKey, JSON.stringify(existingEntries))

      toast({
        title: "Entry saved locally! 📝",
        description: "Your journal entry has been saved to your device.",
      })
    } finally {
      setSaving(false)
      router.push("/dashboard")
    }
  }

  const generateInsights = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Content required",
        description: "Please write some content before generating insights.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingInsights(true)

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formData.content,
          mood: formData.mood[0],
          emotions: formData.emotions,
          lifeAreas: formData.lifeAreas,
          challenges: formData.challenges,
          achievements: formData.achievements,
        }),
      })

      if (response.ok) {
        const { insights: generatedInsights } = await response.json()
        setInsights(generatedInsights)
        toast({
          title: "Insights generated! ✨",
          description: "AI has analyzed your entry and provided personalized insights.",
        })
      } else {
        throw new Error("Failed to generate insights")
      }
    } catch (error) {
      console.error("Error generating insights:", error)
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const toggleArrayItem = (array, item, setter) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const updateGratitude = (index, value) => {
    const newGratitude = [...formData.gratitude]
    newGratitude[index] = value
    setFormData({ ...formData, gratitude: newGratitude })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100">
      <Navigation user={user} onSignOut={signOut} />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-white/60 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-poppins gradient-text">New Journal Entry</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Daily Reflection</CardTitle>
                <CardDescription>Take a moment to reflect on your day, feelings, and personal growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Entry Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="How would you summarize today?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">
                    Your Thoughts & Feelings
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind? How are you feeling? What happened today that was meaningful?"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="mt-1 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Mood: {formData.mood[0]}/10</Label>
                    <Slider
                      value={formData.mood}
                      onValueChange={(value) => setFormData({ ...formData, mood: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Motivation: {formData.motivation[0]}/10</Label>
                    <Slider
                      value={formData.motivation}
                      onValueChange={(value) => setFormData({ ...formData, motivation: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Energy: {formData.energy[0]}/10</Label>
                    <Slider
                      value={formData.energy}
                      onValueChange={(value) => setFormData({ ...formData, energy: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="goal"
                      checked={formData.goalAchieved}
                      onCheckedChange={(checked) => setFormData({ ...formData, goalAchieved: checked })}
                    />
                    <Label htmlFor="goal" className="text-sm font-medium">
                      I achieved a goal today
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    />
                    <Label htmlFor="public" className="text-sm font-medium">
                      Share with community
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Gratitude Practice</CardTitle>
                <CardDescription>List three things you're grateful for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.gratitude.map((item, index) => (
                  <div key={index}>
                    <Label htmlFor={`gratitude-${index}`} className="text-sm font-medium">
                      Grateful for #{index + 1}
                    </Label>
                    <Input
                      id={`gratitude-${index}`}
                      placeholder="What are you grateful for?"
                      value={item}
                      onChange={(e) => updateGratitude(index, e.target.value)}
                      className="mt-1 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Goals & Aspirations</CardTitle>
                <CardDescription>What are you working towards?</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="goals" className="text-sm font-medium">
                    Today's Goals or Tomorrow's Intentions
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you want to accomplish? What are you working towards?"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    rows={3}
                    className="mt-1 bg-white/50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Life Elements</CardTitle>
                <CardDescription>Tag the areas of life and experiences from today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Life Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lifeAreas.map((area) => (
                      <Badge
                        key={area}
                        variant={formData.lifeAreas.includes(area) ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() =>
                          toggleArrayItem(formData.lifeAreas, area, (areas) =>
                            setFormData({ ...formData, lifeAreas: areas }),
                          )
                        }
                      >
                        {area.replace("-", " ")}
                        {formData.lifeAreas.includes(area) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Emotions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emotions.map((emotion) => (
                      <Badge
                        key={emotion}
                        variant={formData.emotions.includes(emotion) ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() =>
                          toggleArrayItem(formData.emotions, emotion, (emotions) =>
                            setFormData({ ...formData, emotions }),
                          )
                        }
                      >
                        {emotion}
                        {formData.emotions.includes(emotion) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Challenges</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {challenges.map((challenge) => (
                      <Badge
                        key={challenge}
                        variant={formData.challenges.includes(challenge) ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() =>
                          toggleArrayItem(formData.challenges, challenge, (challenges) =>
                            setFormData({ ...formData, challenges }),
                          )
                        }
                      >
                        {challenge.replace("-", " ")}
                        {formData.challenges.includes(challenge) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Achievements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {achievements.map((achievement) => (
                      <Badge
                        key={achievement}
                        variant={formData.achievements.includes(achievement) ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() =>
                          toggleArrayItem(formData.achievements, achievement, (achievements) =>
                            setFormData({ ...formData, achievements }),
                          )
                        }
                      >
                        {achievement.replace("-", " ")}
                        {formData.achievements.includes(achievement) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-poppins">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Personal Insights
                </CardTitle>
                <CardDescription>Get personalized insights about your emotional patterns and growth</CardDescription>
              </CardHeader>
              <CardContent>
                {!insights ? (
                  <Button
                    type="button"
                    onClick={generateInsights}
                    disabled={isGeneratingInsights || !formData.content.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {isGeneratingInsights ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing your patterns...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Personal Insights
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Personal Insights</h4>
                    <p className="text-blue-800">{insights}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInsights("")}
                      className="mt-3 hover:bg-blue-50 transition-all duration-300"
                    >
                      Generate New Insights
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving Entry...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline" className="hover:bg-white/60 transition-all duration-300">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
