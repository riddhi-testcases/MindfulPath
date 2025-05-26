"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Settings, LogOut, User, Crown, Menu, X, CreditCard } from "lucide-react"
import Link from "next/link"

export function Navigation({ user, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getPlanBadge = (plan) => {
    switch (plan) {
      case "pro":
        return { text: "Pro", color: "from-emerald-500 to-blue-500" }
      case "premium":
        return { text: "Premium", color: "from-purple-500 to-pink-500" }
      default:
        return { text: "Free", color: "from-gray-400 to-gray-500" }
    }
  }

  const planBadge = getPlanBadge(user?.plan)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              MindfulPath
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/journal/new"
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              New Entry
            </Link>
            <Link
              href="/goals"
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Goals
            </Link>
            <Link
              href="/insights"
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Insights
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Upgrade Button - Only show for free users */}
            {user?.plan === "free" && (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro - ₹299/mo
              </Button>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform duration-300"
                >
                  <Avatar className="h-10 w-10 border-2 border-emerald-200">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-xl border-white/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`px-2 py-1 bg-gradient-to-r ${planBadge.color} rounded-full text-xs font-medium text-white`}
                      >
                        {planBadge.text} Plan
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-emerald-50 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-emerald-50 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-emerald-50 cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing & Plans</span>
                </DropdownMenuItem>
                {user?.plan === "free" && (
                  <DropdownMenuItem className="hover:bg-emerald-50 cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer" onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/journal/new"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Entry
              </Link>
              <Link
                href="/goals"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Goals
              </Link>
              <Link
                href="/insights"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Insights
              </Link>
              {user?.plan === "free" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mx-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade - ₹299/mo
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
