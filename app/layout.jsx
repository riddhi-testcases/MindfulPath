import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "MindfulPath - Personal Growth & Wellness Journal | Made in India",
  description:
    "Transform your life with AI-powered insights, goal tracking, and mindful journaling. Affordable pricing for Indian users. Start your growth journey today.",
  keywords:
    "personal growth, mindfulness, goal tracking, journaling, wellness, self-improvement, India, mental health, AI insights",
  authors: [{ name: "Riddhi Chakraborty" }],
  creator: "Riddhi Chakraborty",
  openGraph: {
    title: "MindfulPath - Personal Growth & Wellness Journal",
    description: "Transform your life with AI-powered insights and mindful journaling. Made in India.",
    type: "website",
    locale: "en_IN",
    siteName: "MindfulPath",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindfulPath" />
      </head>
      <body className="font-inter antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
