"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, TrendingUp, MapPin, Building2, DollarSign, Users, Calendar, Search, Eye, Bookmark } from "lucide-react"
import { apiClient } from "@/lib/api"
import Link from "next/link"

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [sortBy, setSortBy] = useState("roi_desc")

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await apiClient.request("/v1/investment-opportunities/")

      if (response.data) {
        setOpportunities(response.data.results || [])
      } else {
        // Mock opportunities data
        setOpportunities([
          {
            id: "1",
            title: "Kilimani Green Residences",
            description: "Eco-friendly residential complex with modern amenities and green spaces",
            category: "residential",
            location: "Kilimani Road, Nairobi",
            investment_required: 25000000,
            projected_roi: 22.5,
            risk_level: "medium",
            timeline: "18 months",
            market_demand: 88,
            competition_level: "low",
            highlights: ["Prime location", "Eco-friendly design", "High demand area"],
            status: "seeking_investment",
            investor_interest: 15,
            created_date: "2024-01-15",
          },
          {
            id: "2",
            title: "Yaya Centre Expansion",
            description: "Commercial retail expansion with additional office spaces and parking",
            category: "commercial",
            location: "Argwings Kodhek Road, Kilimani",
            investment_required: 45000000,
            projected_roi: 19.8,
            risk_level: "low",
            timeline: "24 months",
            market_demand: 95,
            competition_level: "high",
            highlights: ["Established location", "High foot traffic", "Proven track record"],
            status: "active",
            investor_interest: 28,
            created_date: "2024-01-10",
          },
          {
            id: "3",
            title: "Mixed-Use Development Hub",
            description: "Innovative mixed-use project combining residential, retail, and office spaces",
            category: "mixed_use",
            location: "Lenana Road, Kilimani",
            investment_required: 67000000,
            projected_roi: 24.2,
            risk_level: "high",
            timeline: "36 months",
            market_demand: 82,
            competition_level: "medium",
            highlights: ["Innovative design", "Multiple revenue streams", "Future-ready"],
            status: "planning",
            investor_interest: 12,
            created_date: "2024-01-20",
          },
          {
            id: "4",
            title: "Affordable Housing Initiative",
            description: "Government-backed affordable housing project for middle-income families",
            category: "residential",
            location: "Kilimani Estate, Nairobi",
            investment_required: 35000000,
            projected_roi: 16.5,
            risk_level: "low",
            timeline: "30 months",
            market_demand: 92,
            competition_level: "low",
            highlights: ["Government backing", "Social impact", "Stable returns"],
            status: "seeking_investment",
            investor_interest: 22,
            created_date: "2024-01-25",
          },
          {
            id: "5",
            title: "Tech Hub Office Complex",
            description: "Modern office complex designed for tech companies and startups",
            category: "commercial",
            location: "Galana Road, Kilimani",
            investment_required: 52000000,
            projected_roi: 21.3,
            risk_level: "medium",
            timeline: "28 months",
            market_demand: 85,
            competition_level: "medium",
            highlights: ["Tech-focused design", "Growing sector", "Modern amenities"],
            status: "active",
            investor_interest: 18,
            created_date: "2024-02-01",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "seeking_investment":
        return "bg-blue-100 text-blue-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || opp.category === categoryFilter
    const matchesRisk = riskFilter === "all" || opp.risk_level === riskFilter
    return matchesSearch && matchesCategory && matchesRisk
  })

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case "roi_desc":
        return b.projected_roi - a.projected_roi
      case "roi_asc":
        return a.projected_roi - b.projected_roi
      case "investment_desc":
        return b.investment_required - a.investment_required
      case "investment_asc":
        return a.investment_required - b.investment_required
      case "demand_desc":
        return b.market_demand - a.market_demand
      case "interest_desc":
        return b.investor_interest - a.investor_interest
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
                  <div key={i} className="h-80 bg-muted rounded-lg"></div>
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
                <Zap className="w-8 h-8 text-primary" />
                <span>Investment Opportunities</span>
              </h1>
              <p className="text-muted-foreground">Discover high-potential investment opportunities in Kilimani</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/investor/create-project">
                <Building2 className="w-4 h-4 mr-2" />
                Submit Opportunity
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{opportunities.length}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {opportunities.length > 0
                    ? (opportunities.reduce((sum, opp) => sum + opp.projected_roi, 0) / opportunities.length).toFixed(1)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Expected returns</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KSh {(opportunities.reduce((sum, opp) => sum + opp.investment_required, 0) / 1000000).toFixed(0)}M
                </div>
                <p className="text-xs text-muted-foreground">Required capital</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investor Interest</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {opportunities.reduce((sum, opp) => sum + opp.investor_interest, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total inquiries</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search opportunities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="mixed_use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roi_desc">Highest ROI</SelectItem>
                    <SelectItem value="roi_asc">Lowest ROI</SelectItem>
                    <SelectItem value="investment_desc">Highest Investment</SelectItem>
                    <SelectItem value="investment_asc">Lowest Investment</SelectItem>
                    <SelectItem value="demand_desc">Highest Demand</SelectItem>
                    <SelectItem value="interest_desc">Most Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getStatusColor(opportunity.status)}>
                        {opportunity.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getRiskColor(opportunity.risk_level)}>{opportunity.risk_level} risk</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/10">
                      <div className="text-lg font-bold text-primary">{opportunity.projected_roi}%</div>
                      <div className="text-xs text-muted-foreground">Projected ROI</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/10">
                      <div className="text-lg font-bold text-secondary">
                        KSh {(opportunity.investment_required / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-xs text-muted-foreground">Investment</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Market Demand</span>
                      <span className="text-sm">{opportunity.market_demand}%</span>
                    </div>
                    <Progress value={opportunity.market_demand} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Timeline</span>
                      <span className="text-sm">{opportunity.timeline}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Competition</span>
                      <Badge variant="outline" className="capitalize">
                        {opportunity.competition_level}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key Highlights</div>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.highlights.map((highlight: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{opportunity.investor_interest}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(opportunity.created_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/opportunities/${opportunity.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedOpportunities.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Opportunities Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" || riskFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "New investment opportunities will appear here"}
                </p>
                {!searchTerm && categoryFilter === "all" && riskFilter === "all" && (
                  <Button asChild>
                    <Link href="/investor/create-project">
                      <Building2 className="w-4 h-4 mr-2" />
                      Submit Opportunity
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
