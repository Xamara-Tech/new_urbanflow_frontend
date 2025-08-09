'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, MapPin, Calendar, Users, MessageSquare, TrendingUp, Shield, Star, ThumbsUp, ThumbsDown, Send, BarChart3, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function ProjectDetailsPage() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [sentiment, setSentiment] = useState<any>(null)
  const [feedback, setFeedback] = useState<any[]>([])
  const [userFeedback, setUserFeedback] = useState('')
  const [userRating, setUserRating] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectDetails()
  }, [params.uuid])

  const fetchProjectDetails = async () => {
    try {
      const [projectResponse, sentimentResponse, feedbackResponse] = await Promise.all([
        apiClient.getProject(params.uuid as string),
        apiClient.getProjectSentiment(params.uuid as string),
        apiClient.getProjectFeedback(params.uuid as string)
      ])

      if (projectResponse.data) setProject(projectResponse.data)
      if (sentimentResponse.data) setSentiment(sentimentResponse.data)
      if (feedbackResponse.data) setFeedback(feedbackResponse.data.results || [])
    } catch (error) {
      console.error('Error fetching project details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    try {
      const response = await apiClient.submitFeedback({
        project: params.uuid,
        content: userFeedback,
        rating: userRating
      })

      if (response.data) {
        setUserFeedback('')
        setUserRating(0)
        fetchProjectDetails() // Refresh data
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Mock data for demonstration
  const mockProject = {
    id: params.uuid,
    title: 'Yaya Centre Extension',
    description: 'A comprehensive mixed-use development project featuring retail spaces, office complexes, and recreational facilities. The project aims to enhance the commercial landscape of Kilimani while maintaining environmental sustainability.',
    location: 'Kilimani, Nairobi',
    developer: 'Urban Developers Ltd',
    status: 'Under Review',
    created_at: '2024-01-15',
    project_type: 'Mixed Use',
    estimated_cost: 'KSh 2.5B',
    completion_date: '2026-12-31',
    images: ['/placeholder.svg?height=300&width=400&text=Project+Image+1']
  }

  const mockSentiment = {
    overall_score: 78,
    positive_percentage: 68,
    neutral_percentage: 22,
    negative_percentage: 10,
    total_responses: 145,
    key_themes: ['Parking concerns', 'Green spaces', 'Traffic impact', 'Economic benefits']
  }

  const mockCompliance = [
    { category: 'Building Height', status: 'compliant', score: 95 },
    { category: 'Environmental Impact', status: 'compliant', score: 88 },
    { category: 'Parking Requirements', status: 'pending', score: 75 },
    { category: 'Setback Requirements', status: 'non_compliant', score: 45 }
  ]

  if (loading) {
    return (
      <div className="flex">
        <Navigation userType="resident" />
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentProject = project || mockProject
  const currentSentiment = sentiment || mockSentiment

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userType="resident" />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{currentProject.title}</h1>
              <p className="text-muted-foreground mb-4">{currentProject.description}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {currentProject.project_type}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{currentProject.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {new Date(currentProject.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{currentProject.developer}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`${
                currentProject.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                currentProject.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`}>
                {currentProject.status}
              </Badge>
              <Button className="bg-primary hover:bg-primary/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Project Images */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground">Project visualization would be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Description */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentProject.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                          <h4 className="font-medium mb-2">Key Features</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Modern retail spaces</li>
                            <li>• Office complexes</li>
                            <li>• Recreational facilities</li>
                            <li>• Underground parking</li>
                            <li>• Green spaces</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Sustainability</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Solar energy integration</li>
                            <li>• Rainwater harvesting</li>
                            <li>• Energy-efficient design</li>
                            <li>• Waste management system</li>
                            <li>• Native landscaping</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Stats */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Project Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Cost</span>
                        <span className="font-medium">{currentProject.estimated_cost}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion Date</span>
                        <span className="font-medium">Dec 2026</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Community Interest</span>
                        <span className="font-medium text-green-600">High</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Jobs Created</span>
                        <span className="font-medium">500+</span>
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
                        Support Project
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask Question
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Star className="w-4 h-4 mr-2" />
                        Follow Updates
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span>Overall Sentiment</span>
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of community feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {currentSentiment.overall_score}%
                      </div>
                      <div className="text-muted-foreground">Overall Positive Sentiment</div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Positive</span>
                          <span>{currentSentiment.positive_percentage}%</span>
                        </div>
                        <Progress value={currentSentiment.positive_percentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Neutral</span>
                          <span>{currentSentiment.neutral_percentage}%</span>
                        </div>
                        <Progress value={currentSentiment.neutral_percentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Negative</span>
                          <span>{currentSentiment.negative_percentage}%</span>
                        </div>
                        <Progress value={currentSentiment.negative_percentage} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="text-sm text-muted-foreground">
                        Based on {currentSentiment.total_responses} community responses
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Key Themes</CardTitle>
                    <CardDescription>
                      Most discussed topics in community feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentSentiment.key_themes.map((theme: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="font-medium">{theme}</span>
                          <Badge variant="secondary">
                            {Math.floor(Math.random() * 30) + 10} mentions
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Regulatory Compliance</span>
                  </CardTitle>
                  <CardDescription>
                    Kilimani development regulation compliance status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCompliance.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                        item.status === 'compliant' ? 'bg-green-50 border-green-200' :
                        item.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {item.status === 'compliant' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : item.status === 'pending' ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <div className="font-medium">{item.category}</div>
                            <div className="text-sm text-muted-foreground">
                              Compliance Score: {item.score}%
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          item.status === 'compliant' ? 'bg-green-100 text-green-800 border-green-200' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }>
                          {item.status === 'compliant' ? 'Compliant' :
                           item.status === 'pending' ? 'Pending' : 'Non-Compliant'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              {/* Submit Feedback */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Share Your Feedback</CardTitle>
                  <CardDescription>
                    Help shape this project with your input
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
                      <Label htmlFor="feedback">Your Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your thoughts about this project..."
                        value={userFeedback}
                        onChange={(e) => setUserFeedback(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmitFeedback}
                      disabled={!userFeedback.trim() || userRating === 0}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Feedback */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Community Feedback</CardTitle>
                  <CardDescription>
                    Recent responses from Kilimani residents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        author: 'Sarah M.',
                        rating: 4,
                        content: 'Great to see more green spaces included in the design. This will really benefit the community.',
                        date: '2 hours ago',
                        sentiment: 'positive'
                      },
                      {
                        author: 'John K.',
                        rating: 3,
                        content: 'The parking situation needs to be addressed. Current plans seem insufficient for the expected traffic.',
                        date: '5 hours ago',
                        sentiment: 'neutral'
                      },
                      {
                        author: 'Mary W.',
                        rating: 2,
                        content: 'Worried about the impact on local water pressure. Has this been considered in the planning?',
                        date: '1 day ago',
                        sentiment: 'negative'
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.author}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < item.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              item.sentiment === 'positive' ? 'default' :
                              item.sentiment === 'neutral' ? 'secondary' : 'destructive'
                            }>
                              {item.sentiment}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                        </div>
                        <p className="text-sm">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Project Documents</span>
                  </CardTitle>
                  <CardDescription>
                    Official documents and reports for this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Environmental Impact Assessment', type: 'PDF', size: '2.4 MB', date: '2024-01-10' },
                      { name: 'Architectural Plans', type: 'PDF', size: '15.7 MB', date: '2024-01-08' },
                      { name: 'Traffic Impact Study', type: 'PDF', size: '3.2 MB', date: '2024-01-05' },
                      { name: 'Community Consultation Report', type: 'PDF', size: '1.8 MB', date: '2024-01-03' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.type} • {doc.size} • {doc.date}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
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
