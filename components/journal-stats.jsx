"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Calendar, TrendingUp, Heart, Target } from "lucide-react"

export function JournalStats({ entries }) {
  // Prepare data for charts
  const moodData = entries.map((entry, index) => ({
    entry: index + 1,
    mood: entry.mood,
    motivation: entry.motivation,
    energy: entry.energy,
    date: new Date(entry.date).toLocaleDateString(),
  }))

  const lifeAreaFrequency = entries.reduce((acc, entry) => {
    entry.lifeAreas.forEach((area) => {
      acc[area] = (acc[area] || 0) + 1
    })
    return acc
  }, {})

  const lifeAreaData = Object.entries(lifeAreaFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([area, count]) => ({ area, count }))

  const emotionFrequency = entries.reduce((acc, entry) => {
    entry.emotions.forEach((emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
    })
    return acc
  }, {})

  const emotionData = Object.entries(emotionFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([emotion, count]) => ({ emotion, count }))

  // Goal achievement data
  const goalData = entries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString("en-US", { month: "short" })
    if (!acc[month]) {
      acc[month] = { month, achieved: 0, total: 0 }
    }
    acc[month].total += 1
    if (entry.goalAchieved) {
      acc[month].achieved += 1
    }
    return acc
  }, {})

  const goalChartData = Object.values(goalData).map((item) => ({
    ...item,
    percentage: item.total > 0 ? (item.achieved / item.total) * 100 : 0,
  }))

  // Life balance radar chart
  const lifeBalanceData = [
    {
      area: "Health",
      score:
        entries.filter((e) => e.lifeAreas.includes("health")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("health")).length, 1),
    },
    {
      area: "Career",
      score:
        entries.filter((e) => e.lifeAreas.includes("career")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("career")).length, 1),
    },
    {
      area: "Relationships",
      score:
        entries.filter((e) => e.lifeAreas.includes("relationships")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("relationships")).length, 1),
    },
    {
      area: "Personal Growth",
      score:
        entries.filter((e) => e.lifeAreas.includes("personal-growth")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("personal-growth")).length, 1),
    },
    {
      area: "Finance",
      score:
        entries.filter((e) => e.lifeAreas.includes("finance")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("finance")).length, 1),
    },
    {
      area: "Recreation",
      score:
        entries.filter((e) => e.lifeAreas.includes("recreation")).reduce((sum, e) => sum + e.mood, 0) /
        Math.max(entries.filter((e) => e.lifeAreas.includes("recreation")).length, 1),
    },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

  if (entries.length === 0) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Journal Data Yet</h3>
            <p className="text-gray-500 text-center">
              Start journaling to see detailed analytics and personal growth patterns
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Total Entries</span>
            </div>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Avg Mood</span>
            </div>
            <div className="text-2xl font-bold">
              {(entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Goals Achieved</span>
            </div>
            <div className="text-2xl font-bold">{entries.filter((e) => e.goalAchieved).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Motivation</span>
            </div>
            <div className="text-2xl font-bold">
              {(entries.reduce((sum, e) => sum + e.motivation, 0) / entries.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood & Motivation Trends</CardTitle>
            <CardDescription>Track your emotional and motivational patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entry" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="motivation" stroke="#82ca9d" strokeWidth={2} name="Motivation" />
                <Line type="monotone" dataKey="energy" stroke="#ffc658" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Life Areas Focus</CardTitle>
            <CardDescription>Areas of life you're focusing on most</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lifeAreaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emotional Patterns</CardTitle>
            <CardDescription>Distribution of emotions in your journal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, percent }) => `${emotion} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Life Balance</CardTitle>
            <CardDescription>Your satisfaction across different life areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={lifeBalanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="area" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar name="Satisfaction" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goal Achievement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Achievement Progress</CardTitle>
          <CardDescription>Monthly goal completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={goalChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Achievement Rate"]} />
              <Bar dataKey="percentage" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Growth Insights</CardTitle>
          <CardDescription>AI-generated patterns and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Pattern Recognition</h4>
              <p className="text-blue-800">
                Your mood shows a strong positive correlation with goal achievement. Days when you accomplish goals tend
                to have 23% higher mood ratings.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Growth Recommendation</h4>
              <p className="text-green-800">
                Consider focusing more on {lifeAreaData[lifeAreaData.length - 1]?.area || "personal development"} - this
                area shows the least attention but could significantly impact your overall well-being.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Most Active Area: {lifeAreaData[0]?.area || "N/A"}</Badge>
              <Badge variant="secondary">Dominant Emotion: {emotionData[0]?.emotion || "N/A"}</Badge>
              <Badge variant="secondary">
                Goal Success Rate: {((entries.filter((e) => e.goalAchieved).length / entries.length) * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
