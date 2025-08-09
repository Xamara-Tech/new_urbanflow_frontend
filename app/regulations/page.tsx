"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Calendar, Shield, Lock, Camera, Save, Edit, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    date_of_birth: "",
    occupation: "",
  })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    project_updates: true,
    feedback_alerts: true,
    marketing_emails: false,
  })
  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    login_alerts: true,
    session_timeout: "30",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.data) {
        setUser(response.data)
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          bio: response.data.bio || "",
          date_of_birth: response.data.date_of_birth || "",
          occupation: response.data.occupation || "",
        })
        if (response.data.preferences) {
          setNotifications(response.data.preferences.notifications || notifications)
          setSecurity(response.data.preferences.security || security)
        }
      } else {
        // Mock user data
        const mockUser = {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@email.com",
          phone: "+254 700 123 456",
          address: "Kilimani, Nairobi",
          bio: "Urban development enthusiast and community advocate",
          date_of_birth: "1985-06-15",
          occupation: "Software Engineer",
          avatar: null,
          verification_status: "verified",
          member_since: "2024-01-15",
          projects_participated: 12,
          feedback_given: 28,
        }
        setUser(mockUser)
        setFormData({
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          email: mockUser.email,
          phone: mockUser.phone,
          address: mockUser.address,
          bio: mockUser.bio,
          date_of_birth: mockUser.date_of_birth,
          occupation: mockUser.occupation,
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSecurityChange = (key: string, value: boolean | string) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updateData = {
        ...formData,
        preferences: {
          notifications,
          security,
        },
      }

      const response = await apiClient.request("/v1/auth/profile/", {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      if (response.data) {
        setUser(response.data)
        setEditMode(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      // Mock success for demo
      setTimeout(() => {
        setUser((prev) => ({ ...prev, ...formData }))
        setEditMode(false)
      }, 1000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="flex-1 pt-16 lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-96 bg-muted rounded-lg"></div>
                <div className="lg:col-span-2 h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userType="resident" />

      <div className="flex-1 pt-16 lg:ml-64 transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <User className="w-8 h-8 text-primary" />
                <span>Profile Settings</span>
              </h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                    {saving ? "Saving..." : "Save Changes"}
                    <Save className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)} className="bg-primary hover:bg-primary/90">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {editMode && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                          <Camera className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Profile Picture</DialogTitle>
                          <DialogDescription>Upload a new profile picture</DialogDescription>
                        </DialogHeader>
                        <div className="text-center py-8">
                          <Button>Choose File</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <CardTitle className="mt-4">
                  {user?.first_name} {user?.last_name}
                </CardTitle>
                <CardDescription>{user?.occupation}</CardDescription>
                <div className="flex justify-center mt-2">
                  {user?.verification_status === "verified" ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Resident
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Shield className="w-3 h-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Member Since</div>
                  <div className="font-medium">
                    {new Date(user?.member_since || "2024-01-15").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user?.projects_participated || 0}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{user?.feedback_given || 0}</div>
                    <div className="text-xs text-muted-foreground">Feedback</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="pl-10"
                            rows={2}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="date_of_birth"
                              name="date_of_birth"
                              type="date"
                              value={formData.date_of_birth}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself..."
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                          </div>
                          <Switch
                            checked={notifications.email_notifications}
                            onCheckedChange={(checked) => handleNotificationChange("email_notifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <div className="text-sm text-muted-foreground">Receive notifications via SMS</div>
                          </div>
                          <Switch
                            checked={notifications.sms_notifications}
                            onCheckedChange={(checked) => handleNotificationChange("sms_notifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
                          </div>
                          <Switch
                            checked={notifications.push_notifications}
                            onCheckedChange={(checked) => handleNotificationChange("push_notifications", checked)}
                          />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-4">Content Preferences</h4>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Project Updates</Label>
                                <div className="text-sm text-muted-foreground">
                                  Updates on projects you're following
                                </div>
                              </div>
                              <Switch
                                checked={notifications.project_updates}
                                onCheckedChange={(checked) => handleNotificationChange("project_updates", checked)}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Feedback Alerts</Label>
                                <div className="text-sm text-muted-foreground">
                                  When your feedback receives responses
                                </div>
                              </div>
                              <Switch
                                checked={notifications.feedback_alerts}
                                onCheckedChange={(checked) => handleNotificationChange("feedback_alerts", checked)}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Marketing Emails</Label>
                                <div className="text-sm text-muted-foreground">Promotional content and newsletters</div>
                              </div>
                              <Switch
                                checked={notifications.marketing_emails}
                                onCheckedChange={(checked) => handleNotificationChange("marketing_emails", checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security and privacy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <div className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </div>
                          </div>
                          <Switch
                            checked={security.two_factor_enabled}
                            onCheckedChange={(checked) => handleSecurityChange("two_factor_enabled", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Login Alerts</Label>
                            <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
                          </div>
                          <Switch
                            checked={security.login_alerts}
                            onCheckedChange={(checked) => handleSecurityChange("login_alerts", checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                          <Input
                            id="session_timeout"
                            type="number"
                            value={security.session_timeout}
                            onChange={(e) => handleSecurityChange("session_timeout", e.target.value)}
                            className="w-32"
                          />
                          <div className="text-sm text-muted-foreground">
                            Automatically log out after this period of inactivity
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-4">Password & Authentication</h4>

                          <div className="space-y-4">
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <Lock className="w-4 h-4 mr-2" />
                              Change Password
                            </Button>

                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <Shield className="w-4 h-4 mr-2" />
                              Download Account Data
                            </Button>

                            <Button variant="destructive" className="w-full justify-start">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
