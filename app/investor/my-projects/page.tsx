"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Plus,
  Eye,
  BarChart3,
  MessageSquare,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import Link from "next/link"

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_date")

  useEffect(() => {
    fetchMyProjects()
  }, [])

  const fetchMyProjects = async () => {
    try {
      const response = await apiClient.getProjects({ my_projects: true })
      if (response.data) {
        setProjects(response.data.results || [])
      } else {
        // Mock data fallback
        setProjects([
          {
            id: "1",
            title: "Yaya Centre Extension",
            description: "Mixed-use development with retail and office spaces",
            status: "under_review",
            location: "Kilimani, Nairobi",
            budget: 45000000,
            start_date: "2024-03-15",
            completion_date: "2025-12-31",
            sentiment_score: 78,
            feedback_count: 24,
            compliance_score: 92,
            created_date: "2024-01-15",
          },
          {
            id: "2",
            title: "Kilimani Plaza Renovation",
            description: "Modernization of existing commercial complex",
            status: "approved",
            location: "Kilimani, Nairobi",
            budget: 28000000,
            start_date: "2024-02-01",
            completion_date: "2024-11-30",
            sentiment_score: 85,
            feedback_count: 18,
            compliance_score: 96,
            created_date: "2024-01-10",
          },
          {
            id: "3",
            title: "Residential Complex Phase 1",
            description: "Affordable housing development project",
            status: "planning",
            location: "Kilimani, Nairobi",
            budget: 67000000,
            start_date: "2024-06-01",
            completion_date: "2026-03-31",
            sentiment_score: 65,
            feedback_count: 31,
            compliance_score: 88,
            created_date: "2024-01-20",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "planning":
        return { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Planning" }
      case "under_review":
        return { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle, label: "Under Review" }
      case "approved":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" }
      case "in_progress":
        return { color: "bg-purple-100 text-purple-800", icon: TrendingUp, label: "In Progress" }
      case "completed":
        return { color: "bg-gray-100 text-gray-800", icon: CheckCircle, label: "Completed" }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock, label: "Unknown" }
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "status":
        return a.status.localeCompare(b.status)
      case "sentiment":
        return b.sentiment_score - a.sentiment_score
      case "budget":
        return b.budget - a.budget
      default:
        return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    }
  })

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation userType="investor" />
        <div className="flex-1 pt-16 lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                <span>My Projects</span>
              </h1>
              <p className="text-muted-foreground">Manage and monitor your development projects</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/investor/create-project">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Active developments</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KSh {(projects.reduce((sum, p) => sum + (p.budget || 0), 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Sentiment</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.length > 0
                    ? Math.round(projects.reduce((sum, p) => sum + (p.sentiment_score || 0), 0) / projects.length)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Community approval</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + (p.feedback_count || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Community responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_date">Date Created</SelectItem>
                    <SelectItem value="title">Project Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="sentiment">Sentiment Score</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => {
              const statusInfo = getStatusInfo(project.status)
              const StatusIcon = statusInfo.icon

              return (
                <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Budget</span>
                        <span className="text-sm">KSh {(project.budget / 1000000).toFixed(1)}M</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Community Sentiment</span>
                        <span className="text-sm">{project.sentiment_score}%</span>
                      </div>
                      <Progress value={project.sentiment_score} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Compliance Score</span>
                        <span className="text-sm">{project.compliance_score}%</span>
                      </div>
                      <Progress value={project.compliance_score} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{project.feedback_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.start_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/investor/analytics/${project.id}`}>
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/project-details/${project.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {sortedProjects.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by creating your first development project"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button asChild>
                    <Link href="/investor/create-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
