import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, MapPin, TrendingUp, MessageSquare, Shield, ArrowRight, CheckCircle, Star, BarChart3, Zap, Globe, Heart, Award } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'
import { FloatingElements } from '@/components/floating-elements'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-slide-up">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  URBANFLOW
                </h1>
                <p className="text-xs text-muted-foreground">Kilimani Development Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 animate-slide-up stagger-1">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover-lift">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-lift">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center">
          <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 animate-scale-in hover-lift">
            <Zap className="w-4 h-4 mr-2" />
            Transforming Kilimani Development
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-slide-up stagger-1">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Bridge the Gap
            </span>
            <br />
            <span className="text-foreground">Between Community</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              & Development
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto animate-slide-up stagger-2">
            URBANFLOW connects Kilimani residents with investors and developers through 
            <span className="text-primary font-semibold"> AI-powered sentiment analysis</span>, 
            transparent feedback systems, and community-driven urban planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up stagger-3">
            <Link href="/auth/register?type=resident">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 min-w-[220px] hover-lift group">
                <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Join as Resident
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register?type=investor">
              <Button size="lg" variant="outline" className="min-w-[220px] hover-lift group border-2 hover:border-primary">
                <Building2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Join as Investor
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto animate-slide-up stagger-4">
            <div className="text-center hover-lift">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Active Residents</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-4xl font-bold text-secondary mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Projects Reviewed</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-4xl font-bold text-accent mb-2">
                <AnimatedCounter end={25} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Empowering <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transparent</span> Development
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up stagger-1">
              Our platform provides cutting-edge tools and insights for community-driven urban development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'AI-Powered Feedback',
                description: 'Advanced sentiment analysis provides real-time insights into community opinions and concerns',
                color: 'primary',
                delay: 'stagger-1'
              },
              {
                icon: MapPin,
                title: 'Interactive Mapping',
                description: 'Visualize projects and buildings with geospatial data and location-based feedback systems',
                color: 'secondary',
                delay: 'stagger-2'
              },
              {
                icon: Shield,
                title: 'Compliance Tracking',
                description: 'Automated compliance checks ensure all projects meet Kilimani development regulations',
                color: 'accent',
                delay: 'stagger-3'
              },
              {
                icon: TrendingUp,
                title: 'ROI Analytics',
                description: 'Data-driven insights help investors make informed decisions based on community sentiment',
                color: 'primary',
                delay: 'stagger-4'
              },
              {
                icon: Award,
                title: 'Incentive System',
                description: 'Residents earn rewards for valuable feedback and active participation in the platform',
                color: 'secondary',
                delay: 'stagger-1'
              },
              {
                icon: BarChart3,
                title: 'Real-time Dashboard',
                description: 'Comprehensive dashboards provide instant access to project status and community metrics',
                color: 'accent',
                delay: 'stagger-2'
              }
            ].map((feature, index) => (
              <Card key={index} className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift animate-slide-up ${feature.delay} group`}>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              How <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">URBANFLOW</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up stagger-1">
              Simple steps to transform urban development in Kilimani
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: 'Resident Verification',
                  description: 'Residents verify their Kilimani residency through documentation and gain access to the platform',
                  icon: Users
                },
                {
                  step: 2,
                  title: 'Project Submission',
                  description: 'Investors submit development proposals which undergo AI compliance checks and community review',
                  icon: Building2
                },
                {
                  step: 3,
                  title: 'Community Feedback',
                  description: 'Residents provide feedback and ratings while AI analyzes sentiment and generates insights',
                  icon: MessageSquare
                },
                {
                  step: 4,
                  title: 'Informed Development',
                  description: 'Developers receive actionable insights to create projects that align with community needs',
                  icon: TrendingUp
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-start space-x-6 animate-slide-up stagger-${index + 1} group`}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <item.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative animate-slide-up stagger-2">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-12 flex items-center justify-center hover-lift">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 animate-pulse-glow">
                    <Building2 className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Transparent Development
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Building Kilimani's future together through community collaboration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-slide-up">
            Ready to Shape Kilimani's Future?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up stagger-1">
            Join thousands of residents and developers who are already using URBANFLOW to create 
            better, more sustainable urban development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up stagger-2">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="min-w-[220px] hover-lift group">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="min-w-[220px] border-white text-white hover:bg-white hover:text-primary hover-lift group">
                <Globe className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  URBANFLOW
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Transforming urban development in Kilimani through community collaboration and AI-powered insights.
              </p>
            </div>

            {[
              {
                title: 'Platform',
                links: [
                  { name: 'Features', href: '/features' },
                  { name: 'Pricing', href: '/pricing' },
                  { name: 'API', href: '/api' }
                ]
              },
              {
                title: 'Community',
                links: [
                  { name: 'For Residents', href: '/residents' },
                  { name: 'For Investors', href: '/investors' },
                  { name: 'For Developers', href: '/developers' }
                ]
              },
              {
                title: 'Support',
                links: [
                  { name: 'Help Center', href: '/help' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Privacy Policy', href: '/privacy' }
                ]
              }
            ].map((section, index) => (
              <div key={index} className={`animate-slide-up stagger-${index + 1}`}>
                <h3 className="font-semibold mb-6 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors hover:underline">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground animate-slide-up stagger-4">
            <p>&copy; 2025 URBANFLOW. All rights reserved. Building Kilimani's future together.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
