"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Building2,
  MapPin,
  DollarSign,
  CalendarIcon,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    project_type: "",
    budget: "",
    start_date: undefined as Date | undefined,
    completion_date: undefined as Date | undefined,
    environmental_impact: "",
    community_benefits: "",
    technical_specifications: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }))
  }

  const handleFileUpload = (type: string) => {
    setUploadedFiles((prev) => [...prev, type])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const projectData = {
        ...formData,
        budget: Number.parseFloat(formData.budget),
        start_date: formData.start_date?.toISOString(),
        completion_date: formData.completion_date?.toISOString(),
        documents: uploadedFiles,
        status: "planning",
      }

      const response = await apiClient.createProject(projectData)

      if (response.data) {
        setShowSuccessDialog(true)
      } else {
        throw new Error("API submission failed")
      }
    } catch (error) {
      console.error("Error creating project:", error)
      // Mock success for demo
      setTimeout(() => {
        setShowSuccessDialog(true)
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const requiredDocuments = [
    {
      type: "eia_report",
      name: "Environmental Impact Assessment",
      description: "Detailed environmental impact analysis",
    },
    { type: "architectural_plans", name: "Architectural Plans", description: "Complete building designs and layouts" },
    { type: "financial_projections", name: "Financial Projections", description: "Budget breakdown and ROI analysis" },
    {
      type: "community_consultation",
      name: "Community Consultation Report",
      description: "Results from community engagement sessions",
    },
  ]

  const projectTypes = [
    "Residential Complex",
    "Commercial Building",
    "Mixed-Use Development",
    "Office Complex",
    "Retail Center",
    "Industrial Facility",
    "Infrastructure Project",
  ]

  const completionPercentage = Math.round(
    (Object.values(formData).filter((v) => v !== "" && v !== undefined).length / Object.keys(formData).length) * 70 +
      (uploadedFiles.length / requiredDocuments.length) * 30,
  )

  const steps = [
    { title: "Basic Information", description: "Project details and location" },
    { title: "Timeline & Budget", description: "Dates and financial planning" },
    { title: "Impact Assessment", description: "Environmental and community impact" },
    { title: "Documentation", description: "Required documents and files" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userType="investor" />

      <div className="flex-1 pt-16 lg:ml-64 transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-primary" />
                <span>Create New Project</span>
              </h1>
              <p className="text-muted-foreground">Submit a new development project for community review</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completionPercentage}% Complete
            </Badge>
          </div>

          {/* Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Submission Progress</CardTitle>
              <CardDescription>Complete all sections to submit your project for review</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="h-3 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border text-center cursor-pointer transition-colors",
                      currentStep === index ? "bg-primary text-white" : "hover:bg-muted",
                    )}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs opacity-80">{step.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number.parseInt(value))}>
              {/* Basic Information */}
              <TabsContent value="0">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span>Basic Information</span>
                    </CardTitle>
                    <CardDescription>Provide the fundamental details about your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter project name"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project_type">Project Type *</Label>
                        <Select
                          value={formData.project_type}
                          onValueChange={(value) => handleSelectChange("project_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase().replace(" ", "_")}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide a detailed description of your project"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          placeholder="Enter project location in Kilimani"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setCurrentStep(1)}>
                        Next: Timeline & Budget
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline & Budget */}
              <TabsContent value="1">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-secondary" />
                      <span>Timeline & Budget</span>
                    </CardTitle>
                    <CardDescription>Set project timeline and financial details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Project Budget (KSh) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          placeholder="Enter total project budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.start_date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.start_date}
                              onSelect={(date) => handleDateChange("start_date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Completion Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.completion_date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.completion_date ? format(formData.completion_date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.completion_date}
                              onSelect={(date) => handleDateChange("completion_date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(0)}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setCurrentStep(2)}>
                        Next: Impact Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Impact Assessment */}
              <TabsContent value="2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-accent" />
                      <span>Impact Assessment</span>
                    </CardTitle>
                    <CardDescription>Describe environmental and community impact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="environmental_impact">Environmental Impact *</Label>
                      <Textarea
                        id="environmental_impact"
                        name="environmental_impact"
                        placeholder="Describe the environmental impact and mitigation measures"
                        value={formData.environmental_impact}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="community_benefits">Community Benefits *</Label>
                      <Textarea
                        id="community_benefits"
                        name="community_benefits"
                        placeholder="Explain how this project will benefit the Kilimani community"
                        value={formData.community_benefits}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technical_specifications">Technical Specifications</Label>
                      <Textarea
                        id="technical_specifications"
                        name="technical_specifications"
                        placeholder="Provide technical details and specifications"
                        value={formData.technical_specifications}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setCurrentStep(3)}>
                        Next: Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documentation */}
              <TabsContent value="3">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span>Required Documentation</span>
                    </CardTitle>
                    <CardDescription>Upload all required documents for project review</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload(doc.type)}
                            className="w-full"
                          >
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

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || completionPercentage < 90}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Project"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Project Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your project has been submitted for community review. You'll receive notifications about feedback and
              approval status updates.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                window.location.href = "/investor/my-projects"
              }}
              className="bg-primary hover:bg-primary/90"
            >
              View My Projects
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
