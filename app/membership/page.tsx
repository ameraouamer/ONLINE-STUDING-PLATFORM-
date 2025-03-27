"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["Access to basic courses", "Limited project submissions", "Community forum access", "Email support"],
    recommended: false,
    icon: null,
  },
  {
    name: "VIP",
    price: 19.99,
    features: [
      "Access to all courses",
      "Unlimited project submissions",
      "Priority email support",
      "Course certificates",
      "Downloadable resources",
      "Access to live Q&A sessions",
    ],
    recommended: true,
    icon: <Star className="h-5 w-5 text-yellow-400" />,
  },
  {
    name: "VVIP",
    price: 49.99,
    features: [
      "All VIP features",
      "1-on-1 mentoring sessions",
      "Custom learning path",
      "Priority access to new courses",
      "Dedicated account manager",
      "Team management tools",
      "API access",
    ],
    recommended: false,
    icon: <Crown className="h-5 w-5 text-purple-400" />,
  },
]

export default function MembershipPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("Free")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would process the payment and update the user's membership
    console.log(`Upgraded to ${selectedPlan} plan`)
    router.push("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Membership</CardTitle>
          <p className="text-muted-foreground mt-2">Unlock premium features and enhance your learning experience</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`cursor-pointer transition-all duration-300 relative overflow-hidden
                    ${selectedPlan === plan.name ? "ring-2 ring-[#9333EA] shadow-lg" : "hover:shadow-md"}
                    ${plan.recommended ? "md:scale-105" : ""}`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {plan.icon}
                        {plan.name}
                      </div>
                      <Badge variant={selectedPlan === plan.name ? "default" : "outline"}>
                        {selectedPlan === plan.name ? "Selected" : "Select"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal">/month</span>
                      </p>
                      {plan.price === 0 && <p className="text-sm text-muted-foreground">No credit card required</p>}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.recommended && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-center font-medium text-[#9333EA]">Recommended for most users</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" className="w-full bg-[#9333EA] hover:bg-[#7928CA] text-white">
              {selectedPlan === "Free" ? "Continue with Free Plan" : `Upgrade to ${selectedPlan}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By upgrading, you agree to our Terms of Service and Privacy Policy. You can cancel or change your
              subscription at any time.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

