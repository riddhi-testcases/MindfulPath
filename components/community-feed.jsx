"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Share2, Target, Calendar, Plus, Send } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function CommunityFeed() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    lifeAreas: [],
    mood: 7,
    goalAchieved: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/community")
      if (response.ok) {
        const { posts } = await response.json()
        setPosts(posts)
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          ...newPost,
        }),
      })

      if (response.ok) {
        const { post } = await response.json()
        setPosts([post, ...posts])
        setNewPost({ title: "", content: "", lifeAreas: [], mood: 7, goalAchieved: false })
        setShowCreatePost(false)
        toast({
          title: "Post shared! 🎉",
          description: "Your story has been shared with the community.",
        })
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to share your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikePost = async (postId) => {
    if (!user) return

    try {
      const response = await fetch("/api/community/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: user.id,
        }),
      })

      if (response.ok) {
        const { liked, likes } = await response.json()
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes,
                  likedBy: liked
                    ? [...(post.likedBy || []), user.id]
                    : (post.likedBy || []).filter((id) => id !== user.id),
                }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

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
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Growth Stories</CardTitle>
          <CardDescription>Share and discover inspiring personal growth journeys from fellow travelers</CardDescription>
        </CardHeader>
      </Card>

      {/* Create Post */}
      {!showCreatePost ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <h3 className="font-semibold mb-2">Share Your Growth Journey</h3>
            <p className="text-gray-600 mb-4">Inspire others by sharing your personal development experiences</p>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Story</CardTitle>
            <CardDescription>Inspire the community with your growth journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's your story about?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Your Story</Label>
                <Textarea
                  id="content"
                  placeholder="Share your experience, insights, or challenges..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Life Areas (select relevant ones)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lifeAreas.map((area) => (
                    <Badge
                      key={area}
                      variant={newPost.lifeAreas.includes(area) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const areas = newPost.lifeAreas.includes(area)
                          ? newPost.lifeAreas.filter((a) => a !== area)
                          : [...newPost.lifeAreas, area]
                        setNewPost({ ...newPost, lifeAreas: areas })
                      }}
                    >
                      {area.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Share Story
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No community posts yet. Be the first to share your story!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.goalAchieved && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Target className="w-3 h-3 mr-1" />
                            Goal
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                          {post.mood}/10
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{post.content}</p>

                    <div className="flex flex-wrap gap-2">
                      {post.lifeAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          #{area.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-gray-500 hover:text-red-500 ${
                            post.likedBy?.includes(user?.id) ? "text-red-500" : ""
                          }`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${post.likedBy?.includes(user?.id) ? "fill-red-500" : ""}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
