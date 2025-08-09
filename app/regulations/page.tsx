'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, FileText, Download, ExternalLink, Calendar, Tag, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Regulation {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'pending' | 'archived'
  effective_date: string
  last_updated: string
  document_url?: string
  sections: {
    title: string
    content: string
  }[]
}

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchRegulations()
  }, [])

  const fetchRegulations = async () => {
    try {
      const response = await apiClient.getRegulations()
      if (response.data) {
        setRegulations(response.data)
      }
    } catch (error) {
      // Mock data fallback
      const mockRegulations: Regulation[] = [
        {
          id: '1',
          title: 'Urban Development Standards',
          description: 'Comprehensive guidelines for urban development projects including zoning, building codes, and environmental requirements.',
          category: 'Development',
          status: 'active',
          effective_date: '2024-01-01',
          last_updated: '2024-01-15',
          document_url: '/documents/urban-development-standards.pdf',
          sections: [
            {
              title: 'Zoning Requirements',
              content: 'All urban development projects must comply with local zoning regulations. Mixed-use developments are encouraged in designated areas to promote sustainable urban growth.'
            },
            {
              title: 'Building Height Restrictions',
              content: 'Maximum building heights are determined by zone classification. Residential zones: 4 stories, Commercial zones: 8 stories, Mixed-use zones: 12 stories.'
            },
            {
              title: 'Environmental Impact',
              content: 'All projects must undergo environmental impact assessment. Green building standards are mandatory for projects over 10,000 sq ft.'
            }
          ]
        },
        {
          id: '2',
          title: 'Community Engagement Protocol',
          description: 'Requirements for public consultation and community involvement in urban development projects.',
          category: 'Community',
          status: 'active',
          effective_date: '2023-06-01',
          last_updated: '2024-02-01',
          sections: [
            {
              title: 'Public Notice Requirements',
              content: 'All development projects must provide 30-day public notice before commencement. Notice must be posted in local newspapers and community boards.'
            },
            {
              title: 'Community Meetings',
              content: 'Mandatory community meetings must be held for projects affecting more than 50 residents. Meetings must be accessible and provide translation services.'
            },
            {
              title: 'Feedback Integration',
              content: 'Developer must demonstrate how community feedback has been incorporated into project design and implementation.'
            }
          ]
        },
        {
          id: '3',
          title: 'Affordable Housing Requirements',
          description: 'Mandates for including affordable housing units in new residential developments.',
          category: 'Housing',
          status: 'active',
          effective_date: '2023-09-01',
          last_updated: '2023-12-15',
          sections: [
            {
              title: 'Inclusion Requirements',
              content: 'New residential developments with 20+ units must include minimum 15% affordable housing units or pay in-lieu fees.'
            },
            {
              title: 'Income Eligibility',
              content: 'Affordable units must be available to households earning 80% or less of Area Median Income (AMI).'
            },
            {
              title: 'Long-term Affordability',
              content: 'Affordable units must remain affordable for minimum 30 years through deed restrictions or other legal mechanisms.'
            }
          ]
        },
        {
          id: '4',
          title: 'Infrastructure Impact Fees',
          description: 'Fee structure for development projects to fund necessary infrastructure improvements.',
          category: 'Infrastructure',
          status: 'pending',
          effective_date: '2024-07-01',
          last_updated: '2024-01-30',
          sections: [
            {
              title: 'Fee Calculation',
              content: 'Impact fees calculated based on project size, type, and estimated infrastructure burden. Fees range from $2,000-$15,000 per unit.'
            },
            {
              title: 'Eligible Improvements',
              content: 'Fees fund transportation, water/sewer, parks, and public safety infrastructure improvements directly related to development impact.'
            },
            {
              title: 'Payment Schedule',
              content: 'Fees due at building permit issuance. Payment plans available for projects with 50+ units.'
            }
          ]
        }
      ]
      setRegulations(mockRegulations)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(regulations.map(r => r.category)))]

  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = regulation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         regulation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || regulation.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'archived':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="pt-16 lg:ml-64 transition-all duration-300">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Regulations & Policies</h1>
            <p className="text-muted-foreground">
              Stay informed about urban development regulations, policies, and compliance requirements
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search regulations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Regulations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRegulations.map((regulation) => (
              <Card key={regulation.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{regulation.title}</CardTitle>
                      <CardDescription>{regulation.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(regulation.status)}
                      <Badge className={getStatusColor(regulation.status)}>
                        {regulation.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {regulation.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Effective: {new Date(regulation.effective_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="sections">
                      <AccordionTrigger>View Sections</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {regulation.sections.map((section, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4">
                              <h4 className="font-medium mb-2">{section.title}</h4>
                              <p className="text-sm text-muted-foreground">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Updated: {new Date(regulation.last_updated).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {regulation.document_url && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Full Text
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRegulations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No regulations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
