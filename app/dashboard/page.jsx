"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, TrendingUp, Plus, Brain, Bell, Sparkles, Flame } from "lucide-react"
import Link from "next/link"
import { JournalStats } from "@/components/journal-stats"
import { RecentEntries } from "@/components/recent-entries"
import { CommunityFeed } from "@/components/community-feed"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    loadEntries()
  }, [user, router])

  const loadEntries = async () => {
    try {
      // Load user-specific entries
      const userKey = `journal-entries-${user.id}`
      const response = await fetch(`/api/entries?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      } else {
        // Fallback to localStorage with user-specific key
        const savedEntries = localStorage.getItem(userKey)
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries))
        }
      }
    } catch (error) {
      console.error("Error loading entries:", error)
      // Fallback to localStorage
      const userKey = `journal-entries-${user.id}`
      const savedEntries = localStorage.getItem(userKey)
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries))
      }
    }
    setLoading(false)
  }

  const totalEntries = entries.length
  const thisWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  }).length

  const averageMood = entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length : 0
  const averageMotivation =
    entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.motivation, 0) / entries.length : 0
  const currentStreak = calculateStreak(entries)

  function calculateStreak(entries) {
    if (entries.length === 0) return 0

    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date))
    let streak = 0
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100">
      <Navigation user={user} onSignOut={signOut} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-poppins text-gray-900">Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-600 mt-1">Ready to continue your growth journey today?</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/journal/new">
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <div className="text-2xl font-bold">{totalEntries}</div>
                <div className="text-sm opacity-90">Total Entries</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <div className="text-2xl font-bold">{thisWeekEntries}</div>
                <div className="text-sm opacity-90">This Week</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <div className="text-2xl font-bold">{averageMood.toFixed(1)}</div>
                <div className="text-sm opacity-90">Avg Mood</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Journal
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    Quick Journal Entry
                  </CardTitle>
                  <CardDescription>Reflect on your day and track your personal growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/journal/new">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Entry
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Personal Insights
                  </CardTitle>
                  <CardDescription>AI-powered analysis of your emotional patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  {entries.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          Dominant Emotion
                        </Badge>
                        <span className="text-sm">Optimistic</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Growth Area
                        </Badge>
                        <span className="text-sm">Career Development</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Motivation Trend
                        </Badge>
                        <span className="text-sm">Increasing</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Start journaling to see insights</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <RecentEntries entries={entries.slice(0, 3)} userId={user.id} />
          </TabsContent>

          <TabsContent value="journal">
            <RecentEntries entries={entries} showAll userId={user.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <JournalStats entries={entries} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityFeed />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
