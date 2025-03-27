import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
        <p className="text-lg mb-4">
          Welcome to NET3ALMO. By using our services, you agree to comply with and be bound by the following terms and
          conditions of use.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using NET3ALMO's website and services, you agree to be bound by these Terms of Service and all
          applicable laws and regulations. If you do not agree with any part of these terms, you may not use our
          services.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Services</h2>
        <p className="mb-4">
          You agree to use NET3ALMO's services only for lawful purposes and in a way that does not infringe the rights
          of, restrict or inhibit anyone else's use and enjoyment of the website.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <p className="mb-4">
          To access certain features of the website, you may be required to create a user account. You are responsible
          for maintaining the confidentiality of your account and password and for restricting access to your computer.
        </p>
        {/* Add more sections as needed */}
      </main>
      <SiteFooter />
    </div>
  )
}

