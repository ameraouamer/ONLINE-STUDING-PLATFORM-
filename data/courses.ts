export interface Course {
  id: string
  title: string
  description: string
  image: string
  students: string
  duration: string
  rating: number
  instructor: string
  price: number
  category: string
  sections: {
    title: string
    videoUrl?: string
  }[]
  requirements?: string[]
  instructorDetails?: {
    bio: string
    expertise: string[]
  }
}

// Update the courses array to be mutable
export let courses: Course[] = [
  {
    id: "frontend-web-dev",
    title: "Frontend Web Development",
    description: "Master modern web development with React, Next.js, and more...",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "5.2k",
    duration: "40h",
    rating: 4.9,
    instructor: "David Miller",
    price: 99.99,
    category: "Web Development",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "graphic-design-masterclass",
    title: "Graphic Design Masterclass",
    description: "Learn the fundamentals of graphic design...",
    image:
      "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "4.7k",
    duration: "30h",
    rating: 4.8,
    instructor: "Laura Smith",
    price: 79.99,
    category: "Design",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "professional-video-editing",
    title: "Professional Video Editing",
    description: "Master video editing with tools like Adobe Premiere Pro and Final Cut Pro...",
    image:
      "https://images.unsplash.com/photo-1592917525540-8a1c0d34a88e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "3.9k",
    duration: "35h",
    rating: 4.75,
    instructor: "John Carter",
    price: 89.99,
    category: "Video Editing",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "ai-prompt-engineering",
    title: "AI Prompt Engineering",
    description: "Learn how to craft effective prompts for AI models like GPT-3 and DALL·E...",
    image:
      "https://images.unsplash.com/photo-1640836019091-86e0d7ac5b73?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "2.5k",
    duration: "20h",
    rating: 4.7,
    instructor: "Alex Johnson",
    price: 69.99,
    category: "AI",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "linux-command-line-essentials",
    title: "Linux Command Line Essentials",
    description: "Master the Linux command line and become proficient in using terminal commands...",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "3.2k",
    duration: "25h",
    rating: 4.85,
    instructor: "Mark Wilson",
    price: 59.99,
    category: "DevOps",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "git-and-github-mastery",
    title: "Git and GitHub Mastery",
    description: "Learn to use Git and GitHub for version control and collaboration...",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "4.0k",
    duration: "15h",
    rating: 4.9,
    instructor: "Emily Davis",
    price: 49.99,
    category: "DevOps",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "social-media-management",
    title: "Social Media Management",
    description: "Learn how to manage and grow social media accounts for businesses and brands...",
    image:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "3.6k",
    duration: "20h",
    rating: 4.7,
    instructor: "Sarah Brown",
    price: 59.99,
    category: "Marketing",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description: "Learn to build mobile apps for iOS and Android using Flutter and React Native...",
    image:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "4.5k",
    duration: "50h",
    rating: 4.8,
    instructor: "Michael Lee",
    price: 109.99,
    category: "Mobile Development",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "ai-and-machine-learning",
    title: "AI and Machine Learning",
    description: "Learn the fundamentals of artificial intelligence and machine learning...",
    image:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "5.0k",
    duration: "45h",
    rating: 4.9,
    instructor: "Dr. Alan Turing",
    price: 119.99,
    category: "AI",
    sections: [{ title: "Introduction" }],
  },
  {
    id: "digital-photography",
    title: "Digital Photography",
    description: "Master the art of digital photography. Learn about composition, lighting, editing...",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    students: "3.3k",
    duration: "25h",
    rating: 4.75,
    instructor: "Emma Watson",
    price: 69.99,
    category: "Photography",
    sections: [{ title: "Introduction" }],
  },
]

// Add function to add new courses
export function addCourse(course: Course) {
  courses = [...courses, course]
  // Also store in localStorage for persistence
  localStorage.setItem("courses", JSON.stringify(courses))
}

