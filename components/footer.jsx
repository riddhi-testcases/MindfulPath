"use client"

import { Heart, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-white/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Heart className="w-6 h-6 text-emerald-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-lg font-bold font-poppins bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                MindfulPath
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Unlock your best self with AI-driven insights, smart goal tracking, and mindful journaling — crafted by Riddhi Chakraborty to empower the world.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/riddhi-testcases"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/riddhi-chakraborty-334069279"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:riddhi.bbghs@gmail.com"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Product</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/journal/new"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Journal
              </Link>
              <Link
                href="/pricing"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Pricing
              </Link>
              <Link
                href="/features"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Features
              </Link>
            </div>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Support</h3>
            <div className="space-y-2">
              <Link
                href="/help"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                Contact Support
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 text-center md:text-left">
              © 2025 MindfulPath, Inc. Made by{" "}
              <Link
                href="https://github.com/riddhi-testcases"
                className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Riddhi Chakraborty
              </Link>
              . All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-emerald-600 transition-colors duration-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-emerald-600 transition-colors duration-300">
                Terms
              </Link>
              <Link href="/refund" className="hover:text-emerald-600 transition-colors duration-300">
                Refunds
              </Link>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🇮🇳 Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
