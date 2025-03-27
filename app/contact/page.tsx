import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg mb-4">
              We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out
              to us.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
            <p className="mb-2">
              <strong>Email:</strong> support@net3almo.com
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> +213 123 456 789
            </p>
            <p className="mb-2">
              <strong>Address:</strong> 123 Education Street, Algiers, Algeria
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input type="text" id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input type="email" id="email" name="email" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea id="message" name="message" rows={4} required />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

