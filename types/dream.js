// Dream Entry Interface (JavaScript object structure)
export const createDreamEntry = () => ({
  id: "",
  title: "",
  content: "",
  date: "",
  mood: 7, // 1-10 scale
  sleepQuality: 7, // 1-10 scale
  tags: [],
  isLucid: false,
  interpretation: "",
  emotions: [],
  characters: [],
  locations: [],
  isPublic: false,
  likes: 0,
  comments: [],
})

export const createComment = () => ({
  id: "",
  author: "",
  content: "",
  date: "",
})

export const createDreamPattern = () => ({
  theme: "",
  frequency: 0,
  averageMood: 0,
  commonElements: [],
})

// Journal Entry Interface (JavaScript object structure)
export const createJournalEntry = () => ({
  id: "",
  userId: "",
  title: "",
  content: "",
  date: "",
  mood: 7,
  motivation: 7,
  energy: 7,
  lifeAreas: [],
  goalAchieved: false,
  insights: "",
  emotions: [],
  challenges: [],
  achievements: [],
  gratitude: ["", "", ""],
  goals: "",
  isPublic: false,
})
