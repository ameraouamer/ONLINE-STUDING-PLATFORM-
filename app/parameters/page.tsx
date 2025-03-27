"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Lock,
  CreditCard,
  UserCircle,
  Laptop,
  Shield,
  Mail,
  BellRing,
  CreditCardIcon,
  Smartphone,
  ComputerIcon as Desktop,
} from "lucide-react"
import { useTheme } from "@/lib/theme"
import { Switch } from "@/components/ui/switch"

export default function ParametersPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "/placeholder.svg",
  })
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("english")
  const [twoFactor, setTwoFactor] = useState(false)
  const { theme, setTheme } = useTheme()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [sessionAlerts, setSessionAlerts] = useState(true)

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      setProfile({
        firstName: parsedProfile.firstName || "",
        lastName: parsedProfile.lastName || "",
        email: parsedProfile.email || "",
        image: parsedProfile.image || "/placeholder.svg",
      })
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage = reader.result as string
        setProfile((prev) => ({ ...prev, image: newImage }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const existingProfile = JSON.parse(storedProfile)
      const updatedProfile = {
        ...existingProfile,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        image: profile.image,
      }
      // Ensure enrolledCourses is preserved
      updatedProfile.enrolledCourses = existingProfile.enrolledCourses || []
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))
      console.log("Profile updated:", updatedProfile)
    }
    console.log("Parameters updated")
    router.push("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Account Settings</h1>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account" className="flex items-center">
              <UserCircle className="mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <Lock className="mr-2" />
              Privacy & Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <CreditCard className="mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center">
              <Laptop className="mr-2" />
              Devices
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src={profile.image || "/placeholder.svg"}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      variant="outline"
                      as="span"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Change Profile Picture
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Your First Name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Your Last Name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    aria-label="Toggle email notifications"
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <BellRing className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    aria-label="Toggle push notifications"
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    aria-label="Toggle marketing emails"
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Session Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming sessions</p>
                    </div>
                  </div>
                  <Switch
                    checked={sessionAlerts}
                    onCheckedChange={setSessionAlerts}
                    aria-label="Toggle session alerts"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                    aria-label="Toggle two factor authentication"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your password regularly to keep your account secure
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Account Activity</h4>
                    <p className="text-sm text-muted-foreground">View and manage your login sessions</p>
                  </div>
                  <Button variant="outline">View Activity Log</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Data & Privacy</h4>
                    <p className="text-sm text-muted-foreground">Manage your data and privacy preferences</p>
                  </div>
                  <Button variant="outline">Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>Manage your billing information and view payment history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CreditCardIcon className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-muted-foreground">Add or remove payment methods</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage Payment Methods</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Billing History</h4>
                    <p className="text-sm text-muted-foreground">View your past invoices and payments</p>
                  </div>
                  <Button variant="outline">View Billing History</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Subscription Plan</h4>
                    <p className="text-sm text-muted-foreground">View and manage your subscription</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Manage your connected devices and sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Desktop className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Windows PC</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-sm text-muted-foreground">Last active: 5 hours ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Laptop className="h-5 w-5" />
                      <div>
                        <p className="font-medium">MacBook Pro</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Sign Out All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSubmit}
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

