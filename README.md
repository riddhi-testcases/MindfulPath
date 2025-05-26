# 🧘‍♀️ MindfulPath

> **AI-powered journaling, goal tracking & wellness analytics**

**MindfulPath** is a modern personal growth platform built with **Next.js 15**, offering intelligent journaling, emotional tracking, and community features—all designed with affordability and local payments in mind.

---

## ✨ Features

- 📝 **Smart Journaling** with AI insights  
- 📈 **Mood, Energy & Motivation** tracking with Recharts  
- 🎯 **Goal Milestones** and life area balance tracking  
- 🤝 **Growth Community** with sharing & privacy controls  
- 🔐 **Secure Auth** (email-based) with Redis-powered storage  
- 💡 **AI Pattern Recognition** for emotional trends  
- 📊 **Advanced Analytics** & gamified streaks  
- 📱 **Responsive UI** with dark mode & animations  

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS, shadcn/ui  
- **Backend**: API Routes, Server Actions, Upstash Redis  
- **Charts**: Recharts, custom visualizations  
- **UX**: Mobile-first, glass morphism, smooth animations  

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/mindfulpath.git
cd mindfulpath
npm install
cp .env.example .env.local
# Add your Redis credentials
npm run dev
```
---

## 🧱 Project Structure

mindfulpath/
├── app/          # App routes (dashboard, journal, auth, pricing)
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
└── types/        # Type definitions

## 🧪 Redis Schema (Example)

journal-entries-${userId}: [
  {
    id, userId, title, content,
    mood, motivation, energy,
    // ...
  }
]

## 📦 Deployment

Done on Vercel (Recommended) — GitHub auto-deploy

🛠️ Also works with: Netlify, Railway, DigitalOcean

