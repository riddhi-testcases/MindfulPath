"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Target, Plus, Edit, Trash2, CheckCircle, Clock } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

export default function GoalsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    targetDate: "",
    progress: 0,
    status: "active",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    loadGoals()
  }, [user, router])

  const loadGoals = async () => {
    try {
      const response = await fetch(`/api/goals?userId=${user.id}`)
      if (response.ok) {
        const { goals } = await response.json()
        setGoals(goals)
      }
    } catch (error) {
      console.error("Error loading goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingGoal ? "/api/goals" : "/api/goals"
      const method = editingGoal ? "PUT" : "POST"
      const body = editingGoal
        ? { goalId: editingGoal.id, userId: user.id, updates: formData }
        : { ...formData, userId: user.id }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const { goal } = await response.json()

        if (editingGoal) {
          setGoals(goals.map((g) => (g.id === goal.id ? goal : g)))
          toast({ title: "Goal updated! 🎯", description: "Your goal has been successfully updated." })
        } else {
          setGoals([goal, ...goals])
          toast({ title: "Goal created! 🎯", description: "Your new goal has been added." })
        }

        resetForm()
      }
    } catch (error) {
      console.error("Error saving goal:", error)
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (goalId) => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      const response = await fetch(`/api/goals?userId=${user.id}&goalId=${goalId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setGoals(goals.filter((g) => g.id !== goalId))
        toast({ title: "Goal deleted", description: "Your goal has been removed." })
      }
    } catch (error) {
      console.error("Error deleting goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProgressUpdate = async (goalId, newProgress) => {
    try {
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          userId: user.id,
          updates: {
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : "active",
          },
        }),
      })

      if (response.ok) {
        const { goal } = await response.json()
        setGoals(goals.map((g) => (g.id === goal.id ? goal : g)))

        if (newProgress >= 100) {
          toast({ title: "Goal completed! 🎉", description: "Congratulations on achieving your goal!" })
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      targetDate: "",
      progress: 0,
      status: "active",
    })
    setShowCreateForm(false)
    setEditingGoal(null)
  }

  const startEdit = (goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate?.split("T")[0] || "",
      progress: goal.progress,
      status: goal.status,
    })
    setEditingGoal(goal)
    setShowCreateForm(true)
  }

  const categories = ["health", "career", "relationships", "personal-growth", "finance", "education", "creativity"]
  const priorities = ["low", "medium", "high"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading your goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100">
      <Navigation user={user} onSignOut={signOut} />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins gradient-text">Your Goals</h1>
              <p className="text-gray-600 mt-1">Track and achieve your personal growth objectives</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</CardTitle>
                <CardDescription>
                  {editingGoal ? "Update your goal details" : "Set a new objective for your growth journey"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Goal Title</Label>
                      <Input
                        id="title"
                        placeholder="What do you want to achieve?"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.replace("-", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your goal in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">{editingGoal ? "Update Goal" : "Create Goal"}</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Goals Yet</h3>
                  <p className="text-gray-500 mb-4">Start your growth journey by setting your first goal</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {goal.category?.replace("-", " ")}
                          </Badge>
                          <Badge
                            variant={
                              goal.priority === "high"
                                ? "destructive"
                                : goal.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {goal.priority}
                          </Badge>
                          <Badge
                            variant={goal.status === "completed" ? "default" : "outline"}
                            className={goal.status === "completed" ? "bg-green-100 text-green-700" : ""}
                          >
                            {goal.status === "completed" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(goal)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{goal.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressUpdate(goal.id, Math.max(0, goal.progress - 10))}
                          disabled={goal.progress <= 0}
                        >
                          -10%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressUpdate(goal.id, Math.min(100, goal.progress + 10))}
                          disabled={goal.progress >= 100}
                        >
                          +10%
                        </Button>
                      </div>
                    </div>

                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
