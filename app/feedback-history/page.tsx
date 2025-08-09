'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, Search, Filter, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Building2, Star, TrendingUp, Eye } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function FeedbackHistoryPage() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchFeedbackHistory()
  }, [])

  const fetchFeedbackHistory = async () => {
    try {
      // Mock API call - replace with actual API
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching feedback history:', error)
      setLoading(false)
    }
  }

  // Mock feedback data
  const mockFeedback = [
    {
      id: 1,
      project_name: 'Yaya Centre Extension',
      project_id: 'proj_001',
      type: 'structured',
      category: 'Environmental Impact',
      content: 'The project should include more green spaces and better waste management systems. The current design lacks sufficient environmental considerations.',
      rating: 4,
      status: 'approved',
      submitted_date: '2024-01-15',
      reviewed_date: '2024-01-18',
      payment_amount: 500,
      payment_status: 'paid',
      sentiment: 'positive',
      helpful_votes: 12,
      admin_response: 'Thank you for your valuable feedback. The developer has incorporated additional green spaces based on community input.'
    },
    {
      id: 2,
      project_name: 'Green Residences',
      project_id: 'proj_002',
      type: 'general',
      category: 'Overall Design',
      content: 'Love the sustainable approach of this project. The solar panels and rainwater harvesting systems are excellent additions to Kilimani.',
      rating: 5,
      status: 'approved',
      submitted_date: '2024-01-10',
      reviewed_date: '2024-01-12',
      payment_amount: 750,
      payment_status: 'paid',
      sentiment: 'positive',
      helpful_votes: 18,
      admin_response: 'Your positive feedback has been shared with the developer and helps promote sustainable development practices.'
    },
    {
      id: 3,
      project_name: 'Kilimani Plaza Renovation',
      project_id: 'proj_003',
      type: 'structured',
      category: 'Traffic & Parking',
      content: 'The parking allocation seems insufficient for the proposed number of units. This could lead to street parking issues and traffic congestion.',
      rating: 2,
      status: 'under_review',
      submitted_date: '2024-01-08',
      reviewed_date: null,
      payment_amount: 0,
      payment_status: 'pending',
      sentiment: 'negative',
      helpful_votes: 8,
      admin_response: null
    },
    {
      id: 4,
      project_name: 'Tech Hub Kilimani',
      project_id: 'proj_004',
      type: 'general',
      category: 'Community Benefits',
      content: 'This project will bring much-needed tech infrastructure to our area. The co-working spaces and innovation labs are great additions.',
      rating: 5,
      status: 'approved',
      submitted_date: '2024-01-05',
      reviewed_date: '2024-01-07',
      payment_amount: 600,
      payment_status: 'paid',
      sentiment: 'positive',
      helpful_votes: 15,
      admin_response: 'Thank you for highlighting the community benefits. Your feedback supports the project\'s approval process.'
    },
    {
      id: 5,
      project_name: 'Heritage Mall Expansion',
      project_id: 'proj_005',
      type: 'structured',
      category: 'Accessibility',
      content: 'The current design lacks proper accessibility features for people with disabilities. Ramps and elevators need to be better integrated.',
      rating: 3,
      status: 'rejected',
      submitted_date: '2024-01-03',
      reviewed_date: '2024-01-06',
      payment_amount: 0,
      payment_status: 'not_applicable',
      sentiment: 'neutral',
      helpful_votes: 5,
      admin_response: 'While we appreciate your concern, the feedback did not meet our quality guidelines for structured feedback.'
    }
  ]

  const filteredFeedback = mockFeedback.filter(item => {
    const matchesSearch = item.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'under_review': return Clock
      case 'rejected': return AlertCircle
      default: return Clock
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'not_applicable': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'neutral': return 'text-yellow-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const totalEarnings = mockFeedback
    .filter(item => item.payment_status === 'paid')
    .reduce((sum, item) => sum + item.payment_amount, 0)

  const approvedFeedback = mockFeedback.filter(item => item.status === 'approved').length
  const pendingFeedback = mockFeedback.filter(item => item.status === 'under_review').length

  if (loading) {
    return (
      <div className="flex">
        <Navigation userType="resident" />
        <div className="flex-1">
          <div className="p-6 pt-20 lg:pt-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid gap-6">
                {[...Array(5)].map((_, i) => (
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
      <Navigation userType="resident" />
      
      <div className="flex-1">
        <div className="p-6 pt-20 lg:pt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-primary" />
                <span>My Feedback History</span>
              </h1>
              <p className="text-muted-foreground">
                Track your feedback submissions and earnings from community participation
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockFeedback.length}</div>
                <p className="text-xs text-muted-foreground">
                  Submissions to date
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  Quality feedback approved
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">KSh {totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From approved feedback
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="structured">Structured Feedback</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  Export History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="space-y-6">
            {filteredFeedback.map((item) => {
              const StatusIcon = getStatusIcon(item.status)
              
              return (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-lg">{item.project_name}</CardTitle>
                          <Badge className={getStatusColor(item.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {item.type} feedback
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Submitted {new Date(item.submitted_date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{item.category}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className={`w-3 h-3 ${getSentimentColor(item.sentiment)}`} />
                            <span className={getSentimentColor(item.sentiment)}>{item.sentiment}</span>
                          </span>
                        </CardDescription>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < item.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.helpful_votes} helpful votes
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm leading-relaxed">{item.content}</p>
                    </div>

                    {item.admin_response && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Admin Response</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.admin_response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Payment: </span>
                          <span className={`font-medium ${getPaymentStatusColor(item.payment_status)}`}>
                            {item.payment_status === 'paid' ? `KSh ${item.payment_amount}` :
                             item.payment_status === 'pending' ? 'Pending' : 'N/A'}
                          </span>
                        </div>
                        {item.reviewed_date && (
                          <div className="text-sm text-muted-foreground">
                            Reviewed {new Date(item.reviewed_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/project-details/${item.project_id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Project
                          </Link>
                        </Button>
                        {item.status === 'rejected' && (
                          <Button size="sm" variant="outline">
                            Resubmit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* No Results */}
          {filteredFeedback.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your filters to see more feedback'
                    : 'You haven\'t submitted any feedback yet'
                  }
                </p>
                <Button asChild>
                  <Link href="/projects">
                    Browse Projects to Give Feedback
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Chatbot />
    </div>
  )
}
