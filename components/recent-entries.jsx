"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Target, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

export function RecentEntries({ entries, showAll = false, userId }) {
  const displayEntries = showAll ? entries : entries.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {showAll ? "All Journal Entries" : "Recent Entries"}
          </CardTitle>
          <CardDescription>
            {showAll ? "Your complete personal growth journey" : "Your latest reflections"}
          </CardDescription>
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
        {displayEntries.length > 0 ? (
          <div className="space-y-4">
            {displayEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{entry.title}</h3>
                  <div className="flex items-center gap-2">
                    {entry.goalAchieved && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Target className="w-3 h-3 mr-1" />
                        Goal
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                      {entry.mood}/10
                    </Badge>
                    <Badge variant="outline">
                      <TrendingUp className="w-3 h-3 mr-1 fill-blue-500 text-blue-500" />
                      {entry.motivation}/10
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{entry.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {entry.lifeAreas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {entry.insights && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>AI Insights:</strong> {entry.insights}
                    </p>
                  </div>
                )}

                {entry.gratitude && entry.gratitude.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Gratitude:</strong> {entry.gratitude.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No journal entries yet</p>
            <Link href="/journal/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Start Your Journey
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
