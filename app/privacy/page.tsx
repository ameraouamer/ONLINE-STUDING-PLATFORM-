import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
        <p className="text-lg mb-4">
          At NET3ALMO, we are committed to protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, enroll in a course, or
          contact us for support. This may include your name, email address, and payment information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, to process your
          transactions, to send you administrative information, and to respond to your inquiries.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell or rent your personal information to third parties. We may share your information with service
          providers who assist us in operating our website and conducting our business.
        </p>
        {/* Add more sections as needed */}
      </main>
      <SiteFooter />
    </div>
  )
}

