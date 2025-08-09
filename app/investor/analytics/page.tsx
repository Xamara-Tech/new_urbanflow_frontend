"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { apiClient } from "@/lib/api"

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("30d")
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedProject, timeRange])

  const fetchAnalyticsData = async () => {
    try {
      const [projectsResponse, analyticsResponse] = await Promise.all([
        apiClient.getProjects({ my_projects: true }),
        apiClient.request(`/v1/analytics/dashboard/?project=${selectedProject}&range=${timeRange}`),
      ])

      if (projectsResponse.data) {
        setProjects(projectsResponse.data.results || [])
      }

      if (analyticsResponse.data) {
        setAnalytics(analyticsResponse.data)
      } else {
        // Mock analytics data
        setAnalytics({
          sentiment_trends: [
            { date: "2024-01-01", positive: 65, neutral: 25, negative: 10 },
            { date: "2024-01-15", positive: 70, neutral: 22, negative: 8 },
            { date: "2024-02-01", positive: 75, neutral: 20, negative: 5 },
            { date: "2024-02-15", positive: 78, neutral: 18, negative: 4 },
          ],
          engagement_metrics: {
            total_views: 1247,
            total_feedback: 89,
            avg_sentiment: 76,
            response_rate: 12.5,
          },
          demographic_breakdown: {
            age_groups: [
              { range: "18-25", percentage: 15 },
              { range: "26-35", percentage: 35 },
              { range: "36-45", percentage: 28 },
              { range: "46-55", percentage: 15 },
              { range: "55+", percentage: 7 },
            ],
            gender: { male: 52, female: 48 },
            residency_duration: [
              { range: "< 1 year", percentage: 20 },
              { range: "1-3 years", percentage: 35 },
              { range: "3-5 years", percentage: 25 },
              { range: "5+ years", percentage: 20 },
            ],
          },
          financial_projections: {
            estimated_roi: 18.5,
            payback_period: 24,
            revenue_projection: 45000000,
            cost_breakdown: {
              construction: 60,
              permits: 15,
              marketing: 10,
              contingency: 15,
            },
          },
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation userType="investor" />
        <div className="flex-1 pt-16 lg:ml-64">
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

      <div className="flex-1 pt-16 lg:ml-64 transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                <span>Analytics Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Comprehensive insights into your project performance and community engagement
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.engagement_metrics?.total_views || 0}</div>
                <p className="text-xs text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.engagement_metrics?.total_feedback || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.engagement_metrics?.response_rate || 0}% response rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Sentiment</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.engagement_metrics?.avg_sentiment || 0}%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projected ROI</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.financial_projections?.estimated_roi || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.financial_projections?.payback_period || 0} month payback
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="sentiment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Sentiment Trends</CardTitle>
                    <CardDescription>Community sentiment over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Positive Sentiment</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Neutral Sentiment</span>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Negative Sentiment</span>
                        <span className="text-sm font-medium">4%</span>
                      </div>
                      <Progress value={4} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Feedback Summary</CardTitle>
                    <CardDescription>Key themes from community responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Green Spaces</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">85% Positive</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Traffic Impact</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">65% Neutral</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">Parking Concerns</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">45% Concerned</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                    <CardDescription>Feedback by age groups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.demographic_breakdown?.age_groups?.map((group: any) => (
                        <div key={group.range} className="flex justify-between items-center">
                          <span className="text-sm">{group.range}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={group.percentage} className="w-16 h-2" />
                            <span className="text-sm font-medium">{group.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Gender Split</CardTitle>
                    <CardDescription>Response distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Male</span>
                        <span className="text-sm font-medium">
                          {analytics?.demographic_breakdown?.gender?.male || 0}%
                        </span>
                      </div>
                      <Progress value={analytics?.demographic_breakdown?.gender?.male || 0} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Female</span>
                        <span className="text-sm font-medium">
                          {analytics?.demographic_breakdown?.gender?.female || 0}%
                        </span>
                      </div>
                      <Progress value={analytics?.demographic_breakdown?.gender?.female || 0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Residency Duration</CardTitle>
                    <CardDescription>How long respondents have lived in Kilimani</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.demographic_breakdown?.residency_duration?.map((duration: any) => (
                        <div key={duration.range} className="flex justify-between items-center">
                          <span className="text-sm">{duration.range}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={duration.percentage} className="w-16 h-2" />
                            <span className="text-sm font-medium">{duration.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Engagement Timeline</CardTitle>
                    <CardDescription>Views and interactions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">1,247</div>
                        <div className="text-sm text-muted-foreground">Total Project Views</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">89</div>
                          <div className="text-xs text-muted-foreground">Feedback Responses</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">12.5%</div>
                          <div className="text-xs text-muted-foreground">Response Rate</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Peak Engagement Times</CardTitle>
                    <CardDescription>When community is most active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm font-medium">Weekdays 6-9 PM</span>
                        <Badge>Peak Activity</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm font-medium">Weekends 10 AM-2 PM</span>
                        <Badge variant="secondary">High Activity</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm font-medium">Weekdays 9 AM-5 PM</span>
                        <Badge variant="outline">Moderate Activity</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Financial Projections</CardTitle>
                    <CardDescription>ROI and revenue estimates based on sentiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">
                          {analytics?.financial_projections?.estimated_roi || 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">Projected ROI</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">
                            KSh {((analytics?.financial_projections?.revenue_projection || 0) / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-muted-foreground">Est. Revenue</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-lg font-bold">
                            {analytics?.financial_projections?.payback_period || 0} months
                          </div>
                          <div className="text-xs text-muted-foreground">Payback Period</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                    <CardDescription>Budget allocation by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics?.financial_projections?.cost_breakdown || {}).map(
                        ([category, percentage]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{category}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage as number} className="w-20 h-2" />
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
