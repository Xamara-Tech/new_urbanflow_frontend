'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, MapPin, Search, Filter, Eye, MessageSquare, Calendar, Users, TrendingUp, Star } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [statusFilter, typeFilter])

  const fetchProjects = async () => {
    try {
      const response = await apiClient.getProjects({ 
        latitude: -1.2921, 
        longitude: 36.7856, 
        radius_km: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        project_type: typeFilter !== 'all' ? typeFilter : undefined
      })
      
      if (response.data) {
        setProjects(response.data.results || response.data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Fallback to mock data
      setProjects([
        {
          id: 1,
          title: 'Yaya Centre Extension',
          description: 'Expansion of the existing shopping center with additional retail and office spaces',
          status: 'Under Review',
          project_type: 'Commercial',
          location: 'Argwings Kodhek Road, Kilimani',
          developer: 'Yaya Towers Ltd',
          estimated_cost: 2500000000,
          start_date: '2024-03-15',
          completion_date: '2025-12-31',
          feedback_count: 45,
          sentiment_score: 78
        },
        {
          id: 2,
          title: 'Green Residences Phase 2',
          description: 'Sustainable residential complex with eco-friendly features and green spaces',
          status: 'Approved',
          project_type: 'Residential',
          location: 'Ngong Road, Kilimani',
          developer: 'EcoHomes Kenya',
          estimated_cost: 1800000000,
          start_date: '2024-01-10',
          completion_date: '2025-08-30',
          feedback_count: 67,
          sentiment_score: 92
        },
        {
          id: 3,
          title: 'Kilimani Tech Hub',
          description: 'Modern office complex designed for technology companies and startups',
          status: 'Planning',
          project_type: 'Office',
          location: 'Ralph Bunche Road, Kilimani',
          developer: 'Innovation Properties',
          estimated_cost: 3200000000,
          start_date: '2024-06-01',
          completion_date: '2026-03-31',
          feedback_count: 28,
          sentiment_score: 85
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentColor = (score: number) => {
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
                {[...Array(3)].map((_, i) => (
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
    <div className="flex min-h-screen bg-background">
      <Navigation userType="resident" />
      <Chatbot />

      <div className="flex-1">
        <div className="p-6 lg:pt-6 pt-20 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">   </h1>
              <h1 className="text-3xl font-bold">Development Projects</h1>
              <p className="text-muted-foreground">
                Explore and provide feedback on Kilimani development proposals
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={fetchProjects}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-6">
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.project_type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Developer</div>
                        <div className="font-medium text-sm">{project.developer}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Timeline</div>
                        <div className="font-medium text-sm">
                          {new Date(project.start_date).getFullYear()} - {new Date(project.completion_date).getFullYear()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Feedback</div>
                        <div className="font-medium text-sm">{project.feedback_count} responses</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sentiment</div>
                        <div className={`font-medium text-sm ${getSentimentColor(project.sentiment_score)}`}>
                          {project.sentiment_score}% positive
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">Estimated Cost</div>
                    <div className="text-lg font-semibold">
                      KSh {(project.estimated_cost / 1000000).toFixed(0)}M
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 100) + 50} community members engaged
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/project-details/${project.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Give Feedback
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'Try adjusting your filters to see more projects'
                      : 'No projects are currently available'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Load More */}
          {filteredProjects.length > 0 && (
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
