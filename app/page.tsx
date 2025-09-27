"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Waves, Shield, Users, TreePine, Award, ArrowRight, CheckCircle, Globe, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative p-3 sm:p-4 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <Waves className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 text-balance leading-tight">
              Empowering Coastal Communities,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Restoring Blue Carbon
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
              India's first blockchain-based platform for transparent mangrove restoration, carbon credit verification,
              and community-driven coastal conservation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300" asChild>
                <Link href="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Platform Impact</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time metrics showcasing our collective impact on coastal restoration
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="group">
              <StatCard
                title="Active Projects"
                value="24"
                description="Restoration projects across India"
                icon={TreePine}
                className="group-hover:shadow-xl transition-all duration-300"
              />
            </div>
            <div className="group">
              <StatCard
                title="Carbon Credits Issued"
                value="1,250"
                description="Verified blue carbon credits"
                icon={Award}
                className="group-hover:shadow-xl transition-all duration-300"
              />
            </div>
            <div className="group">
              <StatCard
                title="Registered NGOs"
                value="18"
                description="Verified environmental organizations"
                icon={Users}
                className="group-hover:shadow-xl transition-all duration-300"
              />
            </div>
            <div className="group">
              <StatCard 
                title="Hectares Restored" 
                value="850" 
                description="Mangrove and coastal ecosystems" 
                icon={Leaf}
                className="group-hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Our transparent, blockchain-verified process ensures accountability and trust in every restoration
              project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Register</h3>
              <p className="text-muted-foreground leading-relaxed">
                NGOs, Panchayats, and Verifiers register and get verified by NCCR Admin
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Approval</h3>
              <p className="text-muted-foreground leading-relaxed">
                Admin reviews and approves stakeholder registrations for platform access
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TreePine className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proposal</h3>
              <p className="text-muted-foreground leading-relaxed">
                NGOs submit restoration proposals with Panchayat collaboration
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Independent verifiers validate progress and issue carbon credits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-24 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Platform</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Choose your role and start contributing to coastal restoration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">NGO</CardTitle>
                <CardDescription className="text-base">Environmental organizations leading restoration projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Submit project proposals
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Track restoration progress
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Earn carbon credits
                  </li>
                </ul>
                <Button className="w-full h-12 font-semibold" variant="outline" asChild>
                  <Link href="/register?role=NGO">Register as NGO</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Panchayat</CardTitle>
                <CardDescription className="text-base">Local government bodies supporting community projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Collaborate on projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Upload field data
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Monitor local impact
                  </li>
                </ul>
                <Button className="w-full h-12 font-semibold" variant="outline" asChild>
                  <Link href="/register?role=Panchayat">Register as Panchayat</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Verifier</CardTitle>
                <CardDescription className="text-base">Independent experts ensuring project authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Review project data
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Validate carbon credits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Ensure compliance
                  </li>
                </ul>
                <Button className="w-full h-12 font-semibold" variant="outline" asChild>
                  <Link href="/register?role=Verifier">Register as Verifier</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">NCCR Admin</CardTitle>
                <CardDescription className="text-base">National authority overseeing the registry system</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Approve stakeholders
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Oversee registry
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Issue final credits
                  </li>
                </ul>
                <Button className="w-full h-12 font-semibold" variant="outline" disabled>
                  Admin Access Only
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Join India's leading platform for transparent coastal restoration and help build a sustainable future for
              our blue carbon ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/register">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
