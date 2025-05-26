"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Moon, Plus, Eye } from "lucide-react"
import Link from "next/link"

export function RecentDreams({ dreams, showAll = false }) {
  const displayDreams = showAll ? dreams : dreams.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            {showAll ? "All Dreams" : "Recent Dreams"}
          </CardTitle>
          <CardDescription>{showAll ? "Your complete dream journal" : "Your latest dream entries"}</CardDescription>
        </div>
        {!showAll && (
          <Link href="/journal">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {displayDreams.length > 0 ? (
          <div className="space-y-4">
            {displayDreams.map((dream) => (
              <div key={dream.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{dream.title}</h3>
                  <div className="flex items-center gap-2">
                    {dream.isLucid && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Lucid
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                      {dream.mood}/10
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{dream.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(dream.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {dream.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {dream.interpretation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>AI Interpretation:</strong> {dream.interpretation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Moon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No dreams recorded yet</p>
            <Link href="/journal/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Your First Dream
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
