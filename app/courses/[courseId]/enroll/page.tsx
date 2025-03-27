"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, CheckCircle2, ArrowRight, CreditCard, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { getCourseById } from "@/lib/courses"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define the steps in the enrollment process
const STEPS = {
  COURSE_DETAILS: 0,
  PAYMENT_INFO: 1,
  CONFIRMATION: 2,
}

export default function EnrollmentPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [currentStep, setCurrentStep] = useState(STEPS.COURSE_DETAILS)

  // Form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    paymentMethod: "credit-card",
  })

  const [billingInfo, setBillingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    sameAsShipping: true,
  })

  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(isAuth)

    if (!isAuth) {
      // Redirect to sign in page if not authenticated
      router.push(`/sign-in?redirect=/courses/${params.courseId}/enroll`)
      return
    }

    // Get the course details
    const foundCourse = getCourseById(params.courseId)
    setCourse(foundCourse)
    setIsLoading(false)

    // Check if already enrolled
    const userProfileString = localStorage.getItem("userProfile")
    if (userProfileString) {
      const userProfile = JSON.parse(userProfileString)
      if (userProfile.enrolledCourses?.includes(params.courseId)) {
        // Already enrolled, redirect to course page
        router.push(`/courses/${params.courseId}`)
      }
    }
  }, [params.courseId, router])

  const nextStep = () => {
    if (currentStep === STEPS.COURSE_DETAILS) {
      setCurrentStep(STEPS.PAYMENT_INFO)
    } else if (currentStep === STEPS.PAYMENT_INFO) {
      // Validate payment info
      if (!validatePaymentInfo()) {
        toast.error("Please fill in all required payment information")
        return
      }
      setCurrentStep(STEPS.CONFIRMATION)
    }
  }

  const prevStep = () => {
    if (currentStep === STEPS.PAYMENT_INFO) {
      setCurrentStep(STEPS.COURSE_DETAILS)
    } else if (currentStep === STEPS.CONFIRMATION) {
      setCurrentStep(STEPS.PAYMENT_INFO)
    }
  }

  const validatePaymentInfo = () => {
    if (paymentInfo.paymentMethod === "credit-card") {
      return (
        paymentInfo.cardNumber.length >= 16 &&
        paymentInfo.cardName.trim() !== "" &&
        paymentInfo.expiryDate.trim() !== "" &&
        paymentInfo.cvv.length >= 3
      )
    }
    return true // Other payment methods don't need validation for this demo
  }

  const handleEnrollment = () => {
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsEnrolling(true)

    // Simulate API call with timeout
    setTimeout(() => {
      try {
        const userProfileString = localStorage.getItem("userProfile")
        if (userProfileString) {
          const userProfile = JSON.parse(userProfileString)
          userProfile.enrolledCourses = userProfile.enrolledCourses || []

          if (!userProfile.enrolledCourses.includes(params.courseId)) {
            userProfile.enrolledCourses.push(params.courseId)
            localStorage.setItem("userProfile", JSON.stringify(userProfile))
          }

          toast.success("Successfully enrolled in the course!")
          // Redirect to customer page instead of my-courses
          router.push("/customer")
        }
      } catch (error) {
        console.error("Error during enrollment:", error)
        toast.error("Failed to enroll in the course. Please try again.")
      } finally {
        setIsEnrolling(false)
      }
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Course Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button className="w-full" onClick={() => router.push("/courses")}>
              Browse All Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <CardTitle className="text-2xl">
            {currentStep === STEPS.COURSE_DETAILS && "Complete Your Enrollment"}
            {currentStep === STEPS.PAYMENT_INFO && "Payment Information"}
            {currentStep === STEPS.CONFIRMATION && "Confirm Your Order"}
          </CardTitle>
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= STEPS.COURSE_DETAILS ? "bg-white text-purple-700" : "bg-purple-400 text-white"}`}
              >
                1
              </div>
              <span className={currentStep >= STEPS.COURSE_DETAILS ? "text-white" : "text-purple-300"}>
                Course Details
              </span>
            </div>
            <div className="h-[2px] flex-1 bg-purple-400 self-center mx-2"></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= STEPS.PAYMENT_INFO ? "bg-white text-purple-700" : "bg-purple-400 text-white"}`}
              >
                2
              </div>
              <span className={currentStep >= STEPS.PAYMENT_INFO ? "text-white" : "text-purple-300"}>Payment</span>
            </div>
            <div className="h-[2px] flex-1 bg-purple-400 self-center mx-2"></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= STEPS.CONFIRMATION ? "bg-white text-purple-700" : "bg-purple-400 text-white"}`}
              >
                3
              </div>
              <span className={currentStep >= STEPS.CONFIRMATION ? "text-white" : "text-purple-300"}>Confirmation</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Step 1: Course Details */}
          {currentStep === STEPS.COURSE_DETAILS && (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{course.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">What You'll Get</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{course.sections.length} course sections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price:</p>
                  <p className="text-3xl font-bold">${course.price}</p>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={nextStep}>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === STEPS.PAYMENT_INFO && (
            <>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <RadioGroup
                    value={paymentInfo.paymentMethod}
                    onValueChange={(value) => setPaymentInfo({ ...paymentInfo, paymentMethod: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer" className="cursor-pointer">
                        Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentInfo.paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Card Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <div className="relative">
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveCard"
                          checked={paymentInfo.saveCard}
                          onCheckedChange={(checked) => setPaymentInfo({ ...paymentInfo, saveCard: checked === true })}
                        />
                        <label
                          htmlFor="saveCard"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Save card for future payments
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={billingInfo.zipCode}
                        onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={nextStep}>
                  Review Order
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === STEPS.CONFIRMATION && (
            <>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                        <Badge variant="secondary" className="mt-2">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium">
                        {paymentInfo.paymentMethod === "credit-card" && "Credit/Debit Card"}
                        {paymentInfo.paymentMethod === "paypal" && "PayPal"}
                        {paymentInfo.paymentMethod === "bank-transfer" && "Bank Transfer"}
                      </span>
                    </div>
                    {paymentInfo.paymentMethod === "credit-card" && (
                      <div className="flex justify-between">
                        <span>Card Number:</span>
                        <span className="font-medium">**** **** **** {paymentInfo.cardNumber.slice(-4)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Billing Address:</span>
                      <span className="font-medium text-right">
                        {billingInfo.address}, {billingInfo.city}
                        <br />
                        {billingInfo.state}, {billingInfo.zipCode}
                        <br />
                        {billingInfo.country}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Price Details</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Course Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span className="font-medium">${(course.price * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${(course.price * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleEnrollment}
                  disabled={isEnrolling || !agreeToTerms}
                >
                  {isEnrolling ? "Processing..." : "Complete Purchase"}
                  {!isEnrolling && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="bg-muted/50 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="#" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

