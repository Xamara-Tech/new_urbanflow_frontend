'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, TrendingUp, Users, DollarSign, BarChart3, AlertTriangle, CheckCircle, Clock, Plus, Eye, MessageSquare, Shield } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function InvestorDashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [projectsResponse, statsResponse] = await Promise.all([
        apiClient.getProjects({ my_projects: true }),
        apiClient.getStatistics()
      ])

      if (projectsResponse.data) setProjects(projectsResponse.data.results || [])
      if (statsResponse.data) setStatistics(statsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Navigation userType="investor" />
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
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
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investor Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your projects and community sentiment in real-time
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/projects/create">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Sentiment</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">
                  Total responses
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  Regulatory compliance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Project Portfolio</CardTitle>
                  <CardDescription>
                    Overview of your development projects and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.length > 0 ? projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex-1">
                          <h3 className="font-medium">{project.title || `Project ${index + 1}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.description || 'Mixed-use development project'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={project.status === 'approved' ? 'default' : 'secondary'}>
                              {project.status || 'Under Review'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Sentiment: {Math.floor(Math.random() * 30) + 70}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(Math.random() * 50) + 10} responses
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.id || index}/analytics`}>
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.id || index}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start by creating your first development project
                        </p>
                        <Button asChild>
                          <Link href="/projects/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Project
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Sentiment Trends</CardTitle>
                    <CardDescription>
                      Community sentiment over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Positive Sentiment</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Neutral Sentiment</span>
                        <span className="text-sm font-medium">22%</span>
                      </div>
                      <Progress value={22} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Negative Sentiment</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>ROI Projections</CardTitle>
                    <CardDescription>
                      Expected returns based on community sentiment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">18.5%</div>
                        <div className="text-sm text-muted-foreground">Projected ROI</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">KSh 45M</div>
                          <div className="text-xs text-muted-foreground">Est. Revenue</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">24 months</div>
                          <div className="text-xs text-muted-foreground">Payback Period</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Community Feedback</CardTitle>
                  <CardDescription>
                    Latest responses from Kilimani residents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">Positive</Badge>
                          <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="text-sm font-medium">Yaya Centre Extension</div>
                      </div>
                      <p className="text-sm">
                        "Great to see more green spaces included in the design. This will really benefit the community."
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Neutral</Badge>
                          <span className="text-sm text-muted-foreground">5 hours ago</span>
                        </div>
                        <div className="text-sm font-medium">Kilimani Plaza</div>
                      </div>
                      <p className="text-sm">
                        "The parking situation needs to be addressed. Current plans seem insufficient for the expected traffic."
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">Concern</Badge>
                          <span className="text-sm text-muted-foreground">1 day ago</span>
                        </div>
                        <div className="text-sm font-medium">Residential Complex</div>
                      </div>
                      <p className="text-sm">
                        "Worried about the impact on local water pressure. Has this been considered in the planning?"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Regulatory Compliance</CardTitle>
                  <CardDescription>
                    Kilimani development regulation compliance status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Building Height Regulations</div>
                          <div className="text-sm text-muted-foreground">All projects comply with height limits</div>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-600">Compliant</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Environmental Impact</div>
                          <div className="text-sm text-muted-foreground">EIA reports submitted and approved</div>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-600">Compliant</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">Parking Requirements</div>
                          <div className="text-sm text-muted-foreground">Pending review for 2 projects</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium">Setback Requirements</div>
                          <div className="text-sm text-muted-foreground">1 project needs adjustment</div>
                        </div>
                      </div>
                      <Badge variant="destructive">Action Required</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
