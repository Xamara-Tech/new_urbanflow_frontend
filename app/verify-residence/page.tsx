"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Home, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function VerifyResidencePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    residencyDuration: "",
    additionalInfo: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "under_review" | "approved" | "rejected">(
    "pending",
  )
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.data) {
        const user = response.data
        setFormData((prev) => ({
          ...prev,
          fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        }))

        // Check if user already has verification status
        if (user.verification_status) {
          setVerificationStatus(user.verification_status)
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      // Fallback to mock data
      setFormData((prev) => ({
        ...prev,
        fullName: "John Doe",
        email: "john.doe@email.com",
        phone: "+254 700 123 456",
        address: "Kilimani, Nairobi",
      }))
    } finally {
      setProfileLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileUpload = (type: string) => {
    // Mock file upload
    setUploadedFiles((prev) => [...prev, type])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Try to submit to API
      const verificationData = {
        ...formData,
        documents: uploadedFiles,
        submission_date: new Date().toISOString(),
      }

      const response = await apiClient.request("/v1/auth/verify-residence/", {
        method: "POST",
        body: JSON.stringify(verificationData),
      })

      if (response.data) {
        setVerificationStatus("under_review")
        setShowSuccessDialog(true)
      } else {
        throw new Error("API submission failed")
      }
    } catch (error) {
      console.error("Error submitting verification:", error)
      // Fallback to mock submission
      setTimeout(() => {
        setVerificationStatus("under_review")
        setShowSuccessDialog(true)
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          title: "Verification Pending",
          description: "Please complete the form and upload required documents",
        }
      case "under_review":
        return {
          icon: AlertCircle,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          title: "Under Review",
          description: "Your documents are being reviewed by our team",
        }
      case "approved":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          title: "Verified Resident",
          description: "Your Kilimani residency has been verified",
        }
      case "rejected":
        return {
          icon: AlertCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          title: "Verification Failed",
          description: "Please review and resubmit your documents",
        }
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          title: "Unknown Status",
          description: "",
        }
    }
  }

  const statusInfo = getStatusInfo(verificationStatus)
  const StatusIcon = statusInfo.icon

  const requiredDocuments = [
    { type: "water_bill", name: "Water Bill", description: "Recent water bill showing your Kilimani address" },
    { type: "electricity_bill", name: "Electricity Bill", description: "Recent electricity bill from Kenya Power" },
    { type: "lease_agreement", name: "Lease Agreement", description: "Valid lease agreement or ownership documents" },
  ]

  const completionPercentage = Math.round(
    (Object.values(formData).filter((v) => v.trim() !== "").length / Object.keys(formData).length) * 50 +
      (uploadedFiles.length / requiredDocuments.length) * 50,
  )

  if (profileLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="flex-1 pt-16 lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-96 bg-muted rounded-lg"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
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
                <Home className="w-8 h-8 text-primary" />
                <span>Verify Residence</span>
              </h1>
              <p className="text-muted-foreground">Verify your Kilimani residency to access all platform features</p>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusInfo.title}
            </Badge>
          </div>

          {/* Status Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification Status</CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Provide your personal details for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Kilimani Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete Kilimani address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+254 700 000 000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
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
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residencyDuration">How long have you lived in Kilimani?</Label>
                    <Input
                      id="residencyDuration"
                      name="residencyDuration"
                      placeholder="e.g., 2 years, 6 months"
                      value={formData.residencyDuration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Any additional information that might help with verification"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  <span>Required Documents</span>
                </CardTitle>
                <CardDescription>Upload proof of your Kilimani residency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requiredDocuments.map((doc) => (
                  <div key={doc.type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{doc.name}</h3>
                      {uploadedFiles.includes(doc.type) ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant="outline">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>

                    {!uploadedFiles.includes(doc.type) ? (
                      <Button variant="outline" size="sm" onClick={() => handleFileUpload(doc.type)} className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {doc.name}
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{doc.name.toLowerCase().replace(" ", "_")}.pdf</span>
                      </div>
                    )}
                  </div>
                ))}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    All documents must be recent (within the last 3 months) and clearly show your Kilimani address.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Ready to Submit?</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure all information is accurate and all documents are uploaded
                  </p>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || completionPercentage < 100}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Timeline */}
          {verificationStatus !== "pending" && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Verification Timeline</CardTitle>
                <CardDescription>Track the progress of your residency verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Application Submitted</div>
                      <div className="text-sm text-muted-foreground">Your verification request has been received</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        verificationStatus === "under_review" || verificationStatus === "approved"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 ${
                          verificationStatus === "under_review" || verificationStatus === "approved"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-medium">Document Review</div>
                      <div className="text-sm text-muted-foreground">
                        {verificationStatus === "under_review"
                          ? "Currently reviewing your documents"
                          : "Pending document review"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        verificationStatus === "approved" ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${verificationStatus === "approved" ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium">Verification Complete</div>
                      <div className="text-sm text-muted-foreground">
                        {verificationStatus === "approved"
                          ? "Your residency has been verified"
                          : "Awaiting final verification"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Application Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your residency verification application has been submitted. You will be verified shortly by our team.
              We'll notify you via email once the review is complete.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-primary hover:bg-primary/90">
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
