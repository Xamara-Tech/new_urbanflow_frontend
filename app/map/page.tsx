'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Building2, Eye, MessageSquare, Star, NavigationIcon, Layers, Maximize2, Download } from 'lucide-react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function MapPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [buildings, setBuildings] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedArea, setSelectedArea] = useState<any>(null)
  const [mapLayers, setMapLayers] = useState({
    trafficDensity: true,
    greenSpaces: true,
    noiseLevels: false,
    pedestrianActivity: false,
    zoning: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMapData()
  }, [])

  const fetchMapData = async () => {
    try {
      const [projectsResponse, buildingsResponse] = await Promise.all([
        apiClient.getProjects({ latitude: -1.2921, longitude: 36.7856, radius_km: 10 }),
        apiClient.getBuildings()
      ])

      if (projectsResponse.data) setProjects(projectsResponse.data.results || [])
      if (buildingsResponse.data) setBuildings(buildingsResponse.data.results || [])
    } catch (error) {
      console.error('Error fetching map data:', error)
      // Fallback to mock data
      setProjects([
        { id: 1, title: 'Yaya Centre Extension', type: 'project', status: 'Under Review' },
        { id: 2, title: 'Green Residences', type: 'project', status: 'Approved' }
      ])
      setBuildings([
        { id: 1, title: 'Kilimani Plaza', type: 'building', rating: 4.2 },
        { id: 2, title: 'Tech Hub Kilimani', type: 'building', rating: 4.7 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const mockMapItems = [
    {
      id: 'yaya',
      title: 'Yaya',
      type: 'commercial',
      position: { top: '35%', left: '55%' },
      count: 12,
      color: 'bg-blue-500'
    },
    {
      id: 'green',
      title: 'Green',
      type: 'residential',
      position: { top: '25%', right: '15%' },
      count: 15,
      color: 'bg-green-500'
    },
    {
      id: 'lenana',
      title: 'Lenana',
      type: 'mixed',
      position: { bottom: '35%', left: '60%' },
      count: 8,
      color: 'bg-purple-500'
    },
    {
      id: 'plaza',
      title: 'Plaza',
      type: 'commercial',
      position: { bottom: '25%', left: '45%' },
      count: 5,
      color: 'bg-orange-500'
    },
    {
      id: 'office',
      title: 'Office',
      type: 'office',
      position: { top: '45%', right: '10%' },
      count: 23,
      color: 'bg-gray-500'
    }
  ]

  const areaInfo = {
    name: 'Lenana Road Block 7',
    footTraffic: 'High',
    noiseLevel: '78 dB',
    greenCoverage: '12%'
  }

  const userReports = [
    { type: 'Uber Congestion', location: 'Lenana Rd', count: 23 }
  ]

  const mapStats = {
    walkabilityScore: 8.2,
    greenCoverage: 23,
    avgNoiseLevel: 67,
    congestionPoints: 156
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="resident" />
        <div className="pt-16 ml-16 lg:ml-64 transition-all duration-300">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
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
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <span>Interactive Kilimani Map</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select defaultValue="current">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current State</SelectItem>
                  <SelectItem value="planned">Planned State</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Map Layers */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Map Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="traffic" 
                      checked={mapLayers.trafficDensity}
                      onCheckedChange={(checked) => setMapLayers(prev => ({ ...prev, trafficDensity: !!checked }))}
                    />
                    <label htmlFor="traffic" className="text-sm font-medium">Traffic Density</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="green" 
                      checked={mapLayers.greenSpaces}
                      onCheckedChange={(checked) => setMapLayers(prev => ({ ...prev, greenSpaces: !!checked }))}
                    />
                    <label htmlFor="green" className="text-sm font-medium">Green Spaces</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="noise" 
                      checked={mapLayers.noiseLevels}
                      onCheckedChange={(checked) => setMapLayers(prev => ({ ...prev, noiseLevels: !!checked }))}
                    />
                    <label htmlFor="noise" className="text-sm font-medium">Noise Levels</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pedestrian" 
                      checked={mapLayers.pedestrianActivity}
                      onCheckedChange={(checked) => setMapLayers(prev => ({ ...prev, pedestrianActivity: !!checked }))}
                    />
                    <label htmlFor="pedestrian" className="text-sm font-medium">Pedestrian Activity</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="zoning" 
                      checked={mapLayers.zoning}
                      onCheckedChange={(checked) => setMapLayers(prev => ({ ...prev, zoning: !!checked }))}
                    />
                    <label htmlFor="zoning" className="text-sm font-medium">Zoning</label>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Area Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Area Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">{areaInfo.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Foot Traffic:</span>
                      <span className="text-sm font-medium text-red-600">{areaInfo.footTraffic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Noise Level:</span>
                      <span className="text-sm font-medium text-red-600">{areaInfo.noiseLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Green Coverage:</span>
                      <span className="text-sm font-medium text-green-600">{areaInfo.greenCoverage}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Reports */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">User Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {userReports.map((report, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-3">
                      <div className="font-medium text-red-600">{report.type}</div>
                      <div className="text-sm text-muted-foreground">{report.location} - {report.count} reports</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Map Area */}
            <div className="col-span-6">
              <Card className="border-0 shadow-lg h-full">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full bg-gradient-to-br from-green-100 via-blue-50 to-green-50 rounded-lg overflow-hidden">
                    {/* Street Grid */}
                    <div className="absolute inset-0">
                      {/* Horizontal streets */}
                      <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300"></div>
                      <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-gray-300"></div>
                      <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300"></div>
                      
                      {/* Vertical streets */}
                      <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      {/* Street Labels */}
                      <div className="absolute top-2 left-4 text-xs text-gray-600 transform -rotate-90">Argwings Kodhek</div>
                      <div className="absolute bottom-2 left-1/4 text-xs text-gray-600">Lenana Rd</div>
                      <div className="absolute bottom-2 left-3/4 text-xs text-gray-600">Ngong Rd</div>
                    </div>

                    {/* Map Items */}
                    {mockMapItems.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute cursor-pointer transition-all hover:scale-110 ${item.color} text-white rounded-lg px-3 py-2 shadow-lg`}
                        style={item.position}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="text-center">
                          <div className="font-bold text-sm">{item.title}</div>
                          <div className="text-xs bg-white/20 rounded-full px-2 py-0.5 mt-1">
                            {item.count}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Small markers */}
                    <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-pink-500 rounded-full"></div>
                    <div className="absolute top-2/3 left-1/5 w-3 h-3 bg-pink-500 rounded-full"></div>
                    <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Building Types Legend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Click Buildings to Comment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm">Commercial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm">Residential</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-gray-500"></div>
                    <span className="text-sm">Office</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-pink-500"></div>
                    <span className="text-sm">Under Construction</span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Item Details */}
              {selectedItem && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>{selectedItem.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <Badge variant="secondary">{selectedItem.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reports</span>
                      <span className="font-medium">{selectedItem.count}</span>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/building-details/${selectedItem.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bottom Statistics */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">{mapStats.walkabilityScore}</div>
                <div className="text-sm text-muted-foreground">Walkability Score</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{mapStats.greenCoverage}%</div>
                <div className="text-sm text-muted-foreground">Green Coverage</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600">{mapStats.avgNoiseLevel}dB</div>
                <div className="text-sm text-muted-foreground">Avg Noise Level</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600">{mapStats.congestionPoints}</div>
                <div className="text-sm text-muted-foreground">Congestion Points</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
