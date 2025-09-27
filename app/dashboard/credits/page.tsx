"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type CarbonCredit, type Project } from "@/lib/mockApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default function CreditsPage() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<CarbonCredit[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsData, projectsData] = await Promise.all([mockApi.getCarbonCredits(), mockApi.getProjects()])
        setCredits(creditsData)
        setProjects(projectsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!user) return null

  // Filter credits for NGO's projects
  const userProjects = projects.filter((p) => p.ngoId === user.id)
  const userProjectIds = userProjects.map((p) => p.id)
  const userCredits = credits.filter((c) => userProjectIds.includes(c.projectId))

  const totalCredits = userCredits.reduce((sum, credit) => sum + credit.creditsGenerated, 0)
  const issuedCredits = userCredits
    .filter((c) => c.status === "issued")
    .reduce((sum, credit) => sum + credit.creditsGenerated, 0)
  const pendingCredits = userCredits
    .filter((c) => c.status === "pending")
    .reduce((sum, credit) => sum + credit.creditsGenerated, 0)

  const getStatusColor = (status: CarbonCredit["status"]) => {
    switch (status) {
      case "issued":
        return "bg-green-100 text-green-800"
      case "verified":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading carbon credits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Carbon Credits</h1>
        <p className="text-muted-foreground">Track your verified blue carbon credits and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Credits Generated"
          value={totalCredits.toString()}
          description="All-time carbon credits"
          icon={Award}
        />
        <StatCard
          title="Credits Issued"
          value={issuedCredits.toString()}
          description="Ready for trading"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Pending Verification"
          value={pendingCredits.toString()}
          description="Awaiting approval"
          icon={Clock}
        />
        <StatCard
          title="Average per Project"
          value={userProjects.length > 0 ? Math.round(totalCredits / userProjects.length).toString() : "0"}
          description="Credits per project"
          icon={TrendingUp}
        />
      </div>

      {/* Credits Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Credit Status Distribution</CardTitle>
            <CardDescription>Breakdown of your carbon credits by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Issued</span>
                </div>
                <span className="font-medium">{issuedCredits} credits</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Verified</span>
                </div>
                <span className="font-medium">
                  {userCredits
                    .filter((c) => c.status === "verified")
                    .reduce((sum, credit) => sum + credit.creditsGenerated, 0)}{" "}
                  credits
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">{pendingCredits} credits</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your carbon credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">120 credits verified</p>
                  <p className="text-xs text-muted-foreground">Sundarbans Mangrove Restoration • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Credit validation in progress</p>
                  <p className="text-xs text-muted-foreground">Coastal Seagrass Initiative • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New credits generated</p>
                  <p className="text-xs text-muted-foreground">Salt Marsh Conservation • 3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Details</CardTitle>
          <CardDescription>Detailed view of all your carbon credits</CardDescription>
        </CardHeader>
        <CardContent>
          {userCredits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified By</TableHead>
                  <TableHead>Issue Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell className="font-mono text-sm">{credit.tokenId}</TableCell>
                    <TableCell>{getProjectName(credit.projectId)}</TableCell>
                    <TableCell className="font-medium">{credit.creditsGenerated}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
                    </TableCell>
                    <TableCell>{credit.verifiedBy ? `Verifier #${credit.verifiedBy}` : "Pending"}</TableCell>
                    <TableCell>
                      {credit.issuedAt ? new Date(credit.issuedAt).toLocaleDateString() : "Not issued"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No carbon credits yet</p>
              <p className="text-sm text-muted-foreground">
                Credits will appear here once your projects are verified and approved
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
