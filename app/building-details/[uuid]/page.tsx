'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, MapPin, Calendar, Star, Users, Leaf, Accessibility, Car, Wifi, Shield, ThumbsUp, ThumbsDown, MessageSquare, BarChart3, History, Award } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function BuildingDetailsPage() {
  const params = useParams()
  const [building, setBuilding] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [userReview, setUserReview] = useState('')
  const [userRating, setUserRating] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuildingDetails()
  }, [params.uuid])

  const fetchBuildingDetails = async () => {
    try {
      const response = await apiClient.getBuilding(params.uuid as string)
      if (response.data) {
        setBuilding(response.data)
      }
    } catch (error) {
      console.error('Error fetching building details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock building data
  const mockBuilding = {
    id: params.uuid,
    name: 'Yaya Centre',
    type: 'Commercial',
    address: 'Argwings Kodhek Road, Kilimani',
    developer: 'Yaya Towers Ltd',
    completion_year: 2018,
    floors: 8,
    units: 120,
    rating: 4.2,
    total_reviews: 156,
    walkability_score: 85,
    biophilic_score: 72,
    accessibility_score: 90,
    parking_score: 78,
    description: 'A modern commercial complex featuring retail spaces, offices, and dining establishments. The building incorporates sustainable design elements and provides excellent accessibility features.',
    amenities: ['24/7 Security', 'Parking', 'WiFi', 'Elevators', 'CCTV', 'Backup Power', 'Water Storage', 'Fire Safety'],
    sustainability_features: ['Solar panels', 'Rainwater harvesting', 'Energy-efficient lighting', 'Waste management system', 'Green roof areas'],
    awards: ['Green Building Award 2019', 'Best Commercial Development 2018', 'Accessibility Excellence 2020']
  }

  const mockReviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      content: 'Excellent building with great accessibility features. The parking is adequate and the security is top-notch.',
      date: '2024-01-15',
      helpful_votes: 12,
      category: 'Overall Experience'
    },
    {
      id: 2,
      author: 'John K.',
      rating: 4,
      content: 'Good location and well-maintained facilities. Could use more green spaces around the building.',
      date: '2024-01-10',
      helpful_votes: 8,
      category: 'Environment'
    },
    {
      id: 3,
      author: 'Mary W.',
      rating: 3,
      content: 'The building is functional but the parking can get crowded during peak hours.',
      date: '2024-01-05',
      helpful_votes: 5,
      category: 'Parking & Access'
    }
  ]

  const handleSubmitReview = async () => {
    // Mock review submission
    console.log('Submitting review:', { rating: userRating, content: userReview })
    setUserReview('')
    setUserRating(0)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="flex">
        <Navigation userType="resident" />
        <div className="flex-1">
          <div className="p-6 pt-20 lg:pt-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentBuilding = building || mockBuilding

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userType="resident" />
      
      <div className="flex-1">
        <div className="p-6 pt-20 lg:pt-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{currentBuilding.name}</h1>
              <p className="text-muted-foreground mb-4">{currentBuilding.description}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {currentBuilding.type}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{currentBuilding.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Completed {currentBuilding.completion_year}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{currentBuilding.developer}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold">{currentBuilding.rating}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentBuilding.total_reviews} reviews
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Star className="w-4 h-4 mr-2" />
                Rate Building
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scores">Scores</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Building Image */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground">Building image would be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Building Description */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>About This Building</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {currentBuilding.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Building Specifications</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Floors:</span>
                              <span className="font-medium">{currentBuilding.floors}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Units:</span>
                              <span className="font-medium">{currentBuilding.units}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Year Built:</span>
                              <span className="font-medium">{currentBuilding.completion_year}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Building Type:</span>
                              <span className="font-medium">{currentBuilding.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Awards & Recognition</h4>
                          <div className="space-y-2">
                            {currentBuilding.awards.map((award: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">{award}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Overall Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{currentBuilding.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Reviews</span>
                        <span className="font-medium">{currentBuilding.total_reviews}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                        <span className="font-medium text-green-600">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Maintenance Score</span>
                        <span className="font-medium text-green-600">Excellent</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Recommend Building
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask Question
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scores" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <span>Performance Scores</span>
                    </CardTitle>
                    <CardDescription>
                      Community-rated building performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Walkability</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getScoreColor(currentBuilding.walkability_score)}`}>
                            {currentBuilding.walkability_score}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {getScoreLabel(currentBuilding.walkability_score)}
                          </div>
                        </div>
                      </div>
                      <Progress value={currentBuilding.walkability_score} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Biophilic Design</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getScoreColor(currentBuilding.biophilic_score)}`}>
                            {currentBuilding.biophilic_score}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {getScoreLabel(currentBuilding.biophilic_score)}
                          </div>
                        </div>
                      </div>
                      <Progress value={currentBuilding.biophilic_score} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Accessibility className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Accessibility</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getScoreColor(currentBuilding.accessibility_score)}`}>
                            {currentBuilding.accessibility_score}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {getScoreLabel(currentBuilding.accessibility_score)}
                          </div>
                        </div>
                      </div>
                      <Progress value={currentBuilding.accessibility_score} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">Parking & Transport</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getScoreColor(currentBuilding.parking_score)}`}>
                            {currentBuilding.parking_score}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {getScoreLabel(currentBuilding.parking_score)}
                          </div>
                        </div>
                      </div>
                      <Progress value={currentBuilding.parking_score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Sustainability Features</CardTitle>
                    <CardDescription>
                      Environmental and green building features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentBuilding.sustainability_features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {/* Submit Review */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Share Your Experience</CardTitle>
                  <CardDescription>
                    Help others by sharing your experience with this building
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Your Rating</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className={`w-8 h-8 ${
                              star <= userRating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            <Star className="w-full h-full fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        placeholder="Share your thoughts about this building..."
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={!userReview.trim() || userRating === 0}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Submit Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Community Reviews</CardTitle>
                  <CardDescription>
                    What residents and visitors are saying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {review.author.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{review.author}</div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {review.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{review.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Helpful ({review.helpful_votes})
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-primary" />
                    <span>Building History</span>
                  </CardTitle>
                  <CardDescription>
                    Timeline of major events and developments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        year: '2024',
                        event: 'Accessibility Upgrade',
                        description: 'Added new ramps and improved elevator systems for better accessibility'
                      },
                      {
                        year: '2022',
                        event: 'Sustainability Certification',
                        description: 'Received Green Building certification for environmental initiatives'
                      },
                      {
                        year: '2020',
                        event: 'Major Renovation',
                        description: 'Comprehensive renovation of common areas and building systems'
                      },
                      {
                        year: '2018',
                        event: 'Building Completion',
                        description: 'Official opening and first occupancy of the building'
                      },
                      {
                        year: '2016',
                        event: 'Construction Started',
                        description: 'Groundbreaking ceremony and beginning of construction phase'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{item.year}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.event}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Building Amenities</CardTitle>
                  <CardDescription>
                    Available facilities and services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentBuilding.amenities.map((amenity: string, index: number) => {
                      const getAmenityIcon = (amenity: string) => {
                        if (amenity.toLowerCase().includes('security')) return Shield
                        if (amenity.toLowerCase().includes('parking')) return Car
                        if (amenity.toLowerCase().includes('wifi')) return Wifi
                        if (amenity.toLowerCase().includes('elevator')) return Building2
                        return Star
                      }
                      
                      const Icon = getAmenityIcon(amenity)
                      
                      return (
                        <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Chatbot />
    </div>
  )
}
