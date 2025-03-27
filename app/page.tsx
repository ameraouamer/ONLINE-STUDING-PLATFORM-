import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Clock, BookOpen, Target, Zap, Video, History, MessageSquare } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const featuredCourses = [
  {
    title: "Web Development Masterclass",
    category: "Development",
    rating: 4.8,
    students: "2.3k",
    duration: "20h",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    instructor: "Sarah Johnson",
  },
  {
    title: "Data Science Fundamentals",
    category: "Data Science",
    rating: 4.9,
    students: "1.8k",
    duration: "15h",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    instructor: "Michael Chen",
  },
  {
    title: "Digital Marketing Strategy",
    category: "Marketing",
    rating: 4.7,
    students: "3.1k",
    duration: "12h",
    image: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    instructor: "Emma Davis",
  },
  {
    title: "UX/UI Design Principles",
    category: "Design",
    rating: 4.9,
    students: "2.7k",
    duration: "18h",
    image:
      "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    instructor: "Alex Turner",
  },
]

const features = [
  {
    icon: <Video className="h-12 w-12 text-primary" />,
    title: "Interactive Live Sessions",
    description: "Engage in real-time with expert instructors through high-quality video calls",
  },
  {
    icon: <History className="h-12 w-12 text-primary" />,
    title: "Complete Session History",
    description: "Access all your past sessions, materials, and discussions in one organized space",
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    title: "Integrated Chat & Resources",
    description: "All your conversations and course materials saved in one convenient room",
  },
  {
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    title: "Comprehensive Content",
    description: "Access a wide range of courses across multiple disciplines",
  },
  {
    icon: <Target className="h-12 w-12 text-primary" />,
    title: "Practical Projects",
    description: "Apply your knowledge through hands-on projects",
  },
  {
    icon: <Zap className="h-12 w-12 text-primary" />,
    title: "Interactive Learning",
    description: "Engage with dynamic content and real-time feedback",
  },
]

export default function Home() {
  return (
    <div className="bg-background flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[600px] flex items-center"
          style={{
            backgroundImage:
              'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CREATE%20A%20PICTURE%20WITH%20CONTAINS%20A%20CAMERA%20AND%20A%20COMPUTER%20AND%20PROGRAMMING%20THINGS%20AND%20DEIGN%20AND%20LEARNING%20THINGS%20,%20WITHA%20WIHTE%20AND%20PURPLE%20COLOR%20ONLY%20AND%20SOME%20BLACK%20,%20USE%20A%20FULL%20WHITE%20BACKGROUNG%20,%20IT%20FOR%20MY%20WEBSI.jpg-tY5Wdb9ZI7p3irUGThmZeW67JGlIaU.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm dark:bg-background/20"></div>
          <div className="container mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-primary">Learn</span> from the best
            </h1>
            <p className="text-xl text-foreground mb-12 max-w-2xl mx-auto">
              Unlock your potential with expert-led courses and join a community of lifelong learners.
            </p>
            <div className="space-x-4">
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="courses-section py-24 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-bold">Featured Courses</h2>
              <Link href="/courses" className="text-primary hover:underline">
                View all courses
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCourses.map((course, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button size="icon" className="bg-primary hover:bg-primary/90">
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-2">
                      {course.category}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span>{course.rating}</span>
                        <span>({course.students})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose NET3ALMO Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Choose NET3ALMO?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience a new way of learning with interactive live sessions and comprehensive resource management
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-card hover:bg-accent transition-colors duration-300"
                >
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link href="/courses">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Explore Our Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">"Empowering Algerian Youth Through Knowledge"</h2>
            <p className="text-xl mb-8">
              Our mission is to democratize knowledge and empower the next generation of Algerian innovators, creators,
              and entrepreneurs. We believe in the transformative power of accessible education and the unlimited
              potential of our youth.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

