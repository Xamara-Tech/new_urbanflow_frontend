'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Building2, MapPin, MessageSquare, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Star, Users, BarChart3 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function ResidentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [nearbyProjects, setNearbyProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashResponse, statsResponse, projectsResponse] = await Promise.all([
        apiClient.getDashboard({ latitude: -1.2921, longitude: 36.7856, radius_km: 5 }),
        apiClient.getStatistics(),
        apiClient.getProjects({ latitude: -1.2921, longitude: 36.7856, radius_km: 5 })
      ])

      if (dashResponse.data) setDashboardData(dashResponse.data)
      if (statsResponse.data) setStatistics(statsResponse.data)
      if (projectsResponse.data) setNearbyProjects(projectsResponse.data.results || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to mock data
      setStatistics({
        total_feedback: 24,
        total_earnings: 12500,
        active_projects: 8,
        community_rank: 42
      })
      setNearbyProjects([
        {
          id: 1,
          title: 'Yaya Centre Extension',
          description: 'Mixed-use development project',
          status: 'Under Review'
        },
        {
          id: 2,
          title: 'Green Residences',
          description: 'Sustainable residential complex',
          status: 'Approved'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="pt-16 ml-16 lg:ml-64 transition-all duration-300">
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
    <div className="min-h-screen bg-background">
      <Navigation userType="resident" />
      <Chatbot />
      
      <div className="pt-16 ml-16 lg:ml-64 transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-muted-foreground">
                Stay updated on Kilimani development projects and earn rewards for your feedback
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/projects">
                <MessageSquare className="w-4 h-4 mr-2" />
                Give Feedback
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.total_feedback || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {statistics?.total_earnings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  From approved feedback
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nearbyProjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  In your area
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
                <Star className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{statistics?.community_rank || 42}</div>
                <p className="text-xs text-muted-foreground">
                  Top contributor
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>Recent Projects</span>
                </CardTitle>
                <CardDescription>
                  New development proposals in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nearbyProjects.slice(0, 3).map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.title || `Project ${index + 1}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description || 'Mixed-use development project'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {project.status || 'Under Review'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Kilimani
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/project-details/${project.id || index}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/projects">
                    View All Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  <span>Your Impact</span>
                </CardTitle>
                <CardDescription>
                  How your feedback is making a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Feedback Quality Score</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Community Engagement</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Projects Influenced</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/10">
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-xs text-muted-foreground">Changes Implemented</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg hover-lift">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you engage with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2 hover-lift" asChild>
                  <Link href="/projects">
                    <Building2 className="w-6 h-6" />
                    <span>Browse Projects</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col space-y-2 hover-lift" asChild>
                  <Link href="/map">
                    <MapPin className="w-6 h-6" />
                    <span>View Map</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col space-y-2 hover-lift" asChild>
                  <Link href="/feedback-history">
                    <MessageSquare className="w-6 h-6" />
                    <span>My Feedback</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col space-y-2 hover-lift" asChild>
                  <Link href="/payments">
                    <DollarSign className="w-6 h-6" />
                    <span>View Earnings</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Feedback approved for Yaya Centre Extension</p>
                    <p className="text-xs text-muted-foreground">Earned KSh 500 • 2 hours ago</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New project posted: Kilimani Plaza Renovation</p>
                    <p className="text-xs text-muted-foreground">Review and provide feedback • 5 hours ago</p>
                  </div>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Community ranking updated</p>
                    <p className="text-xs text-muted-foreground">Moved up 3 positions • 1 day ago</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
