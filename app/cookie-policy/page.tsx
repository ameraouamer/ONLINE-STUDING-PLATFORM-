import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Cookie Policy</h1>
        <p className="text-lg mb-4">
          This Cookie Policy explains how NET3ALMO uses cookies and similar technologies to recognize you when you visit
          our website. It explains what these technologies are and why we use them, as well as your rights to control
          our use of them.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">What are cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website.
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
          as well as to provide reporting information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why do we use cookies?</h2>
        <p className="mb-4">
          We use first party and third party cookies for several reasons. Some cookies are required for technical
          reasons in order for our website to operate, and others are used to enhance your experience while using our
          site. Some cookies are used to remember your preferences and choices, while others are used to track your
          browsing behavior to improve our services and deliver personalized content.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How can you control cookies?</h2>
        <p className="mb-4">
          You have the right to decide whether to accept or reject cookies. You can set or amend your web browser
          controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though
          your access to some functionality and areas of our website may be restricted.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Types of cookies we use</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Essential cookies: These are cookies that are required for the operation of our website.</li>
          <li>
            Analytical/performance cookies: These allow us to recognize and count the number of visitors and to see how
            visitors move around our website when they are using it.
          </li>
          <li>Functionality cookies: These are used to recognize you when you return to our website.</li>
          <li>
            Targeting cookies: These cookies record your visit to our website, the pages you have visited and the links
            you have followed.
          </li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}

