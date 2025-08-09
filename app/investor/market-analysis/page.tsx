"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react"
import { apiClient } from "@/lib/api"

export default function MarketAnalysisPage() {
  const [marketData, setMarketData] = useState<any>(null)
  const [selectedArea, setSelectedArea] = useState<string>("kilimani")
  const [timeframe, setTimeframe] = useState<string>("1y")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarketData()
  }, [selectedArea, timeframe])

  const fetchMarketData = async () => {
    try {
      const response = await apiClient.request(`/v1/market-analysis/?area=${selectedArea}&timeframe=${timeframe}`)

      if (response.data) {
        setMarketData(response.data)
      } else {
        // Mock market data
        setMarketData({
          market_overview: {
            total_value: 2400000000,
            growth_rate: 12.5,
            active_projects: 34,
            completed_projects: 18,
            market_sentiment: 78,
          },
          property_trends: {
            residential: { value: 850000000, growth: 15.2, trend: "up" },
            commercial: { value: 1200000000, growth: 8.7, trend: "up" },
            mixed_use: { value: 350000000, growth: 22.1, trend: "up" },
          },
          demographic_insights: {
            population_growth: 8.3,
            income_levels: {
              high: 35,
              middle: 45,
              low: 20,
            },
            age_distribution: {
              young_professionals: 40,
              families: 35,
              seniors: 25,
            },
          },
          investment_opportunities: [
            {
              type: "Affordable Housing",
              potential_roi: 18.5,
              risk_level: "medium",
              market_demand: 85,
              competition: "moderate",
            },
            {
              type: "Commercial Retail",
              potential_roi: 22.3,
              risk_level: "low",
              market_demand: 92,
              competition: "high",
            },
            {
              type: "Mixed-Use Development",
              potential_roi: 16.8,
              risk_level: "medium",
              market_demand: 78,
              competition: "low",
            },
          ],
          risk_factors: [
            { factor: "Infrastructure Development", impact: "positive", probability: "high" },
            { factor: "Regulatory Changes", impact: "neutral", probability: "medium" },
            { factor: "Economic Fluctuations", impact: "negative", probability: "low" },
          ],
        })
      }
    } catch (error) {
      console.error("Error fetching market data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-yellow-600" />
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
                <span>Market Analysis</span>
              </h1>
              <p className="text-muted-foreground">
                Comprehensive market insights and investment opportunities in Kilimani
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kilimani">Kilimani</SelectItem>
                  <SelectItem value="westlands">Westlands</SelectItem>
                  <SelectItem value="upperhill">Upper Hill</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="3y">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Value</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KSh {(marketData?.market_overview?.total_value / 1000000000).toFixed(1)}B
                </div>
                <p className="text-xs text-muted-foreground">Total market value</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{marketData?.market_overview?.growth_rate || 0}%
                </div>
                <p className="text-xs text-muted-foreground">Year over year</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData?.market_overview?.active_projects || 0}</div>
                <p className="text-xs text-muted-foreground">Currently in development</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData?.market_overview?.completed_projects || 0}</div>
                <p className="text-xs text-muted-foreground">Projects delivered</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData?.market_overview?.market_sentiment || 0}%</div>
                <p className="text-xs text-muted-foreground">Positive outlook</p>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Tabs */}
          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Property Trends</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(marketData?.property_trends || {}).map(([type, data]: [string, any]) => (
                  <Card key={type} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center justify-between">
                        {type.replace("_", " ")}
                        {data.trend === "up" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </CardTitle>
                      <CardDescription>Market performance and growth</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">
                          KSh {(data.value / 1000000000).toFixed(1)}B
                        </div>
                        <div className="text-sm text-muted-foreground">Market Value</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Growth Rate</span>
                        <Badge className={data.growth > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {data.growth > 0 ? "+" : ""}
                          {data.growth}%
                        </Badge>
                      </div>

                      <Progress value={Math.abs(data.growth) * 5} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Income Distribution</CardTitle>
                    <CardDescription>Household income levels in the area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(marketData?.demographic_insights?.income_levels || {}).map(
                        ([level, percentage]: [string, any]) => (
                          <div key={level} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{level} Income</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Age Demographics</CardTitle>
                    <CardDescription>Population distribution by age groups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(marketData?.demographic_insights?.age_distribution || {}).map(
                        ([group, percentage]: [string, any]) => (
                          <div key={group} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{group.replace("_", " ")}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Population Growth</CardTitle>
                  <CardDescription>Annual population growth rate and projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 rounded-lg bg-secondary/10">
                    <div className="text-3xl font-bold text-secondary mb-2">
                      +{marketData?.demographic_insights?.population_growth || 0}%
                    </div>
                    <div className="text-muted-foreground">Annual Growth Rate</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Indicating strong demand for housing and commercial spaces
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {marketData?.investment_opportunities?.map((opportunity: any, index: number) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {opportunity.type}
                        <Badge className={getRiskColor(opportunity.risk_level)}>{opportunity.risk_level} risk</Badge>
                      </CardTitle>
                      <CardDescription>Investment opportunity analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-accent/10">
                        <div className="text-2xl font-bold text-accent">{opportunity.potential_roi}%</div>
                        <div className="text-sm text-muted-foreground">Potential ROI</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Market Demand</span>
                          <span className="text-sm">{opportunity.market_demand}%</span>
                        </div>
                        <Progress value={opportunity.market_demand} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Competition Level</span>
                          <Badge variant="outline" className="capitalize">
                            {opportunity.competition}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Key factors that could impact investment returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData?.risk_factors?.map((risk: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          {getImpactIcon(risk.impact)}
                          <div>
                            <div className="font-medium">{risk.factor}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {risk.impact} impact • {risk.probability} probability
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            risk.impact === "positive"
                              ? "bg-green-100 text-green-800"
                              : risk.impact === "negative"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {risk.probability}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Market Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Strong population growth driving demand</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Established infrastructure and amenities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>High-income demographic concentration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Government support for development</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span>Areas of Concern</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span>Traffic congestion during peak hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span>Limited parking availability</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span>Rising construction costs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span>Regulatory approval timelines</span>
                      </li>
                    </ul>
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
