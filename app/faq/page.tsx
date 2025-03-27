import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I sign up for a course?",
      answer:
        "To sign up for a course, simply navigate to the course page and click on the 'Enroll Now' button. You'll be prompted to create an account or log in if you haven't already. Once you've completed the enrollment process, you'll have immediate access to the course materials.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express) and PayPal. For some courses, we also offer payment plans to make learning more accessible.",
    },
    {
      question: "Are the courses self-paced?",
      answer:
        "Yes, most of our courses are self-paced, allowing you to learn at your own speed and on your own schedule. However, some courses may have specific start and end dates, which will be clearly indicated on the course page.",
    },
    {
      question: "Do I get a certificate upon completion?",
      answer:
        "Yes, upon successful completion of a course, you will receive a digital certificate that you can share on your resume or social media profiles to showcase your new skills.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "We offer a 30-day money-back guarantee for most of our courses. If you're unsatisfied with a course, you can request a full refund within 30 days of your purchase, no questions asked.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-900/20 dark:from-background dark:to-purple-900/20 flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <SiteFooter />
    </div>
  )
}

