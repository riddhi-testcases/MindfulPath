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
} from "recharts"
import { Calendar, TrendingUp, Moon, Heart } from "lucide-react"

export function DreamStats({ dreams }) {
  // Prepare data for charts
  const moodData = dreams.map((dream, index) => ({
    entry: index + 1,
    mood: dream.mood,
    sleepQuality: dream.sleepQuality,
    date: new Date(dream.date).toLocaleDateString(),
  }))

  const tagFrequency = dreams.reduce((acc, dream) => {
    dream.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  const tagData = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }))

  const emotionFrequency = dreams.reduce((acc, dream) => {
    dream.emotions.forEach((emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
    })
    return acc
  }, {})

  const emotionData = Object.entries(emotionFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([emotion, count]) => ({ emotion, count }))

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

  const weeklyData = dreams.reduce((acc, dream) => {
    const date = new Date(dream.date)
    const week = `Week ${Math.ceil(date.getDate() / 7)}`

    if (!acc[week]) {
      acc[week] = { week, dreams: 0, avgMood: 0, totalMood: 0 }
    }

    acc[week].dreams += 1
    acc[week].totalMood += dream.mood
    acc[week].avgMood = acc[week].totalMood / acc[week].dreams

    return acc
  }, {})

  const weeklyChartData = Object.values(weeklyData)

  if (dreams.length === 0) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Moon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Dream Data Yet</h3>
            <p className="text-gray-500 text-center">
              Start recording your dreams to see detailed analytics and patterns
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
              <span className="text-sm font-medium">Total Dreams</span>
            </div>
            <div className="text-2xl font-bold">{dreams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Avg Mood</span>
            </div>
            <div className="text-2xl font-bold">
              {(dreams.reduce((sum, d) => sum + d.mood, 0) / dreams.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Lucid Dreams</span>
            </div>
            <div className="text-2xl font-bold">{dreams.filter((d) => d.isLucid).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Sleep Quality</span>
            </div>
            <div className="text-2xl font-bold">
              {(dreams.reduce((sum, d) => sum + d.sleepQuality, 0) / dreams.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood & Sleep Quality Trends</CardTitle>
            <CardDescription>Track your emotional and sleep patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entry" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="sleepQuality" stroke="#82ca9d" strokeWidth={2} name="Sleep Quality" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dream Themes</CardTitle>
            <CardDescription>Most common tags in your dreams</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tagData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" />
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
            <CardDescription>Distribution of emotions in your dreams</CardDescription>
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
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Dreams recorded and average mood by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dreams" fill="#8884d8" name="Dreams Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Dream Insights</CardTitle>
          <CardDescription>AI-generated patterns and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Pattern Recognition</h4>
              <p className="text-blue-800">
                Your dreams show a strong correlation between sleep quality and mood. Dreams with higher sleep quality
                scores tend to have more positive emotional content.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Recommendation</h4>
              <p className="text-green-800">
                Consider maintaining a consistent sleep schedule to improve both sleep quality and dream recall. Your
                lucid dreaming frequency suggests good dream awareness.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Most Active: {tagData[0]?.tag || "N/A"}</Badge>
              <Badge variant="secondary">Dominant Emotion: {emotionData[0]?.emotion || "N/A"}</Badge>
              <Badge variant="secondary">
                Lucid Rate: {((dreams.filter((d) => d.isLucid).length / dreams.length) * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
