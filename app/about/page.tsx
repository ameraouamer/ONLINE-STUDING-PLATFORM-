import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-8 text-purple-600">About NET3ALMO</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-4">
            Founded in the heart of Algeria, NET3ALMO is pioneering the future of skill-sharing in North Africa. As
            Algeria's first comprehensive skill-sharing platform, we're bridging the gap between traditional education
            and the dynamic needs of the digital age.
          </p>
          <p className="text-lg mb-4">
            Our mission is to democratize knowledge and empower the next generation of Algerian innovators, creators,
            and entrepreneurs. We believe in the transformative power of accessible education and the unlimited
            potential of our youth.
          </p>
          <p className="text-lg mb-4">
            Based in Algiers, our platform connects learners with expert instructors across various fields, from
            technology and design to business and creative arts. We're building a community where knowledge flows freely
            and opportunities are boundless.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-600">Our Vision</h2>
          <p className="text-lg mb-4">
            To create a knowledge-driven society where every Algerian has the opportunity to learn, grow, and succeed in
            their chosen field.
          </p>
        </div>
        <div className="mt-16 relative">
          <div className="relative h-[400px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CREATE%20A%20PICTURE%20WITH%20CONTAINS%20A%20CAMERA%20AND%20A%20COMPUTER%20AND%20PROGRAMMING%20THINGS%20AND%20DEIGN%20AND%20LEARNING%20THINGS%20,%20WITHA%20WIHTE%20AND%20PURPLE%20COLOR%20ONLY%20AND%20SOME%20BLACK%20,%20USE%20A%20FULL%20WHITE%20BACKGROUNG%20,%20IT%20FOR%20MY%20WEBSI.jpg-tY5Wdb9ZI7p3irUGThmZeW67JGlIaU.jpeg"
              alt="NET3ALMO Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white text-3xl font-bold text-center px-4">
                LEARN ANYTHING, EVERYWHERE YOU WANT, ANYTIME.
                <br />
                ALL YOU NEED IS <span className="text-purple-400">NET</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

