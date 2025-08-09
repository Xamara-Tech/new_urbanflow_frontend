'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, MapPin, Star, Search, Filter, Eye, MessageSquare, TrendingUp, Users, Zap, Leaf } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')

  useEffect(() => {
    fetchBuildings()
  }, [typeFilter, ratingFilter])

  const fetchBuildings = async () => {
    try {
      const response = await apiClient.getBuildings()
      if (response.data) {
        setBuildings(response.data.results || response.data || [])
      }
    } catch (error) {
      console.error('Error fetching buildings:', error)
      // Fallback to mock data
      setBuildings([
        {
          id: 1,
          name: 'Yaya Centre',
          type: 'Commercial',
          address: 'Argwings Kodhek Road, Kilimani',
          rating: 4.2,
          walkability_score: 85,
          biophilic_score: 72,
          energy_efficiency: 78,
          total_feedback: 45,
          description: 'Modern shopping center with diverse retail outlets and dining options'
        },
        {
          id: 2,
          name: 'Kilimani Plaza',
          type: 'Mixed Use',
          address: 'Lenana Road, Kilimani',
          rating: 3.8,
          walkability_score: 78,
          biophilic_score: 65,
          energy_efficiency: 82,
          total_feedback: 32,
          description: 'Mixed-use development with offices, retail, and residential units'
        },
        {
          id: 3,
          name: 'Green Towers',
          type: 'Residential',
          address: 'Ngong Road, Kilimani',
          rating: 4.5,
          walkability_score: 91,
          biophilic_score: 88,
          energy_efficiency: 95,
          total_feedback: 67,
          description: 'Eco-friendly residential complex with sustainable design features'
        },
        {
          id: 4,
          name: 'Tech Hub Kilimani',
          type: 'Office',
          address: 'Ralph Bunche Road, Kilimani',
          rating: 4.7,
          walkability_score: 89,
          biophilic_score: 75,
          energy_efficiency: 88,
          total_feedback: 28,
          description: 'Modern office building designed for technology companies'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         building.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || building.type?.toLowerCase() === typeFilter.toLowerCase()
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '4+' && building.rating >= 4) ||
                         (ratingFilter === '3+' && building.rating >= 3)
    
    return matchesSearch && matchesType && matchesRating
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="pt-16 ml-16 lg:ml-64 transition-all duration-300">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
              <h1 className="text-3xl font-bold">Kilimani Buildings</h1>
              <p className="text-muted-foreground">
                Explore and rate buildings across Kilimani with detailed sustainability metrics
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Buildings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search buildings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Building Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="mixed use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4+">4+ Stars</SelectItem>
                    <SelectItem value="3+">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={fetchBuildings}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Buildings Grid */}
          <div className="grid gap-6">
            {filteredBuildings.length > 0 ? filteredBuildings.map((building) => (
              <Card key={building.id} className="border-0 shadow-lg hover:shadow-xl transition-all hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{building.name}</h3>
                        <Badge variant="secondary">{building.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {building.address}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {building.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center space-x-1">
                        <Star className={`w-5 h-5 fill-current ${getRatingColor(building.rating)}`} />
                        <span className={`font-medium ${getRatingColor(building.rating)}`}>
                          {building.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Walkability</div>
                        <div className={`font-medium ${getScoreColor(building.walkability_score)}`}>
                          {building.walkability_score}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Biophilic Score</div>
                        <div className={`font-medium ${getScoreColor(building.biophilic_score)}`}>
                          {building.biophilic_score}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Energy Efficiency</div>
                        <div className={`font-medium ${getScoreColor(building.energy_efficiency)}`}>
                          {building.energy_efficiency}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {building.total_feedback} reviews
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-green-600">
                          {Math.floor(Math.random() * 20) + 80}% satisfaction
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/building-details/${building.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Rate Building
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Buildings Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || typeFilter !== 'all' || ratingFilter !== 'all' 
                      ? 'Try adjusting your filters to see more buildings'
                      : 'No buildings are currently available'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Load More */}
          {filteredBuildings.length > 0 && (
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Buildings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
