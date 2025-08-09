'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, TrendingDown, Users, Building2, DollarSign, MapPin, Calendar, Download, RefreshCw } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'
import { apiClient } from '@/lib/api'

interface StatisticsData {
  overview: {
    total_projects: number
    active_projects: number
    completed_projects: number
    total_investment: number
    total_residents: number
    total_investors: number
  }
  project_stats: {
    by_category: { category: string; count: number; percentage: number }[]
    by_status: { status: string; count: number; percentage: number }[]
    by_region: { region: string; count: number; investment: number }[]
  }
  financial_stats: {
    total_funding: number
    average_project_cost: number
    funding_by_source: { source: string; amount: number; percentage: number }[]
    monthly_investment: { month: string; amount: number }[]
  }
  community_stats: {
    resident_satisfaction: number
    community_engagement: number
    feedback_response_rate: number
    active_community_members: number
  }
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('12months')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchStatistics()
  }, [timeRange])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getStatistics({ timeRange })
      if (response.data) {
        setStatistics(response.data)
      }
    } catch (error) {
      // Mock data fallback
      const mockStatistics: StatisticsData = {
        overview: {
          total_projects: 156,
          active_projects: 42,
          completed_projects: 89,
          total_investment: 125000000,
          total_residents: 8420,
          total_investors: 234
        },
        project_stats: {
          by_category: [
            { category: 'Residential', count: 68, percentage: 43.6 },
            { category: 'Commercial', count: 34, percentage: 21.8 },
            { category: 'Mixed-Use', count: 28, percentage: 17.9 },
            { category: 'Infrastructure', count: 26, percentage: 16.7 }
          ],
          by_status: [
            { status: 'Completed', count: 89, percentage: 57.1 },
            { status: 'In Progress', count: 42, percentage: 26.9 },
            { status: 'Planning', count: 18, percentage: 11.5 },
            { status: 'On Hold', count: 7, percentage: 4.5 }
          ],
          by_region: [
            { region: 'Downtown', count: 45, investment: 45000000 },
            { region: 'Midtown', count: 38, investment: 32000000 },
            { region: 'Uptown', count: 31, investment: 28000000 },
            { region: 'Suburbs', count: 42, investment: 20000000 }
          ]
        },
        financial_stats: {
          total_funding: 125000000,
          average_project_cost: 801282,
          funding_by_source: [
            { source: 'Private Investment', amount: 62500000, percentage: 50 },
            { source: 'Government Grants', amount: 37500000, percentage: 30 },
            { source: 'Community Funding', amount: 18750000, percentage: 15 },
            { source: 'Other', amount: 6250000, percentage: 5 }
          ],
          monthly_investment: [
            { month: 'Jan', amount: 8500000 },
            { month: 'Feb', amount: 9200000 },
            { month: 'Mar', amount: 11800000 },
            { month: 'Apr', amount: 10300000 },
            { month: 'May', amount: 12100000 },
            { month: 'Jun', amount: 13500000 }
          ]
        },
        community_stats: {
          resident_satisfaction: 87,
          community_engagement: 73,
          feedback_response_rate: 68,
          active_community_members: 2847
        }
      }
      setStatistics(mockStatistics)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading && !statistics) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="pt-16 lg:ml-64 transition-all duration-300">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
      <div className="pt-16 lg:ml-64 transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Statistics & Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive insights into urban development projects and community engagement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchStatistics} disabled={loading} size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleString()}
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedCounter end={statistics?.overview.total_projects || 0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last period
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedCounter end={statistics?.overview.active_projects || 0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last period
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(statistics?.overview.total_investment || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% from last period
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedCounter end={statistics?.overview.total_residents || 0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +23% from last period
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="regional">Regional</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects by Category</CardTitle>
                    <CardDescription>Distribution of projects across different categories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statistics?.project_stats.by_category.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{item.count}</span>
                            <Badge variant="secondary">{item.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projects by Status</CardTitle>
                    <CardDescription>Current status distribution of all projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statistics?.project_stats.by_status.map((item) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.status}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{item.count}</span>
                            <Badge variant="secondary">{item.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Funding Sources</CardTitle>
                    <CardDescription>Breakdown of funding by source</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statistics?.financial_stats.funding_by_source.map((item) => (
                      <div key={item.source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{formatCurrency(item.amount)}</span>
                            <Badge variant="secondary">{item.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Key financial metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Funding</span>
                        <span className="text-2xl font-bold">{formatCurrency(statistics?.financial_stats.total_funding || 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Project Cost</span>
                        <span className="text-xl font-semibold">{formatCurrency(statistics?.financial_stats.average_project_cost || 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Investors</span>
                        <span className="text-xl font-semibold">{formatNumber(statistics?.overview.total_investors || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Engagement</CardTitle>
                    <CardDescription>Metrics showing community participation and satisfaction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Resident Satisfaction</span>
                        <Badge variant="default">{statistics?.community_stats.resident_satisfaction}%</Badge>
                      </div>
                      <Progress value={statistics?.community_stats.resident_satisfaction} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Community Engagement</span>
                        <Badge variant="default">{statistics?.community_stats.community_engagement}%</Badge>
                      </div>
                      <Progress value={statistics?.community_stats.community_engagement} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Feedback Response Rate</span>
                        <Badge variant="default">{statistics?.community_stats.feedback_response_rate}%</Badge>
                      </div>
                      <Progress value={statistics?.community_stats.feedback_response_rate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Community Members</CardTitle>
                    <CardDescription>Breakdown of community participation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">
                        <AnimatedCounter end={statistics?.community_stats.active_community_members || 0} />
                      </div>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Residents</span>
                        <span className="font-medium">{formatNumber(statistics?.overview.total_residents || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Investors</span>
                        <span className="font-medium">{formatNumber(statistics?.overview.total_investors || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engagement Rate</span>
                        <Badge variant="secondary">{statistics?.community_stats.community_engagement}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="regional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>Projects and investment by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {statistics?.project_stats.by_region.map((region) => (
                      <div key={region.region} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{region.region}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{region.count} projects</div>
                            <div className="text-sm text-muted-foreground">{formatCurrency(region.investment)}</div>
                          </div>
                        </div>
                        <Progress 
                          value={(region.count / (statistics?.overview.total_projects || 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Export Options */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download statistics and reports for further analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
