"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
  mockApi,
  type Project,
  type FieldData,
  type CarbonCredit,
  type User,
  type VerificationAction,
} from "@/lib/mockApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Shield, Award, FileText, Calendar } from "lucide-react"

export default function VerifiedPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [fieldData, setFieldData] = useState<FieldData[]>([])
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [verificationActions, setVerificationActions] = useState<VerificationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, fieldDataData, creditsData, usersData, actionsData] = await Promise.all([
          mockApi.getProjects(),
          mockApi.getFieldData(),
          mockApi.getCarbonCredits(),
          mockApi.getUsers(),
          mockApi.getVerificationActions(),
        ])
        setProjects(projectsData)
        setFieldData(fieldDataData)
        setCarbonCredits(creditsData)
        setUsers(usersData)
        setVerificationActions(actionsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!user || user.role !== "Verifier") {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. Only Verifiers can access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading verified items...</p>
        </div>
      </div>
    )
  }

  // Filter items verified by this user
  const myActions = verificationActions.filter((va) => va.performedBy === user.id)
  const verifiedProjects = projects.filter((p) => p.status === "approved")
  const verifiedFieldData = fieldData.filter((fd) => fd.status === "verified")
  const verifiedCredits = carbonCredits.filter((cc) => cc.status === "verified" || cc.status === "issued")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
      case "issued":
        return "bg-green-100 text-green-800"
      case "pending_verification":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserName = (userId: number, role?: string) => {
    const foundUser = users.find((u) => u.id === userId && (role ? u.role === role : true))
    return foundUser?.name || "Unknown"
  }

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Verified Items</h1>
        <p className="text-muted-foreground">Track your verification history and approved items</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Projects Verified"
          value={verifiedProjects.length.toString()}
          description="Successfully approved"
          icon={CheckCircle}
        />
        <StatCard
          title="Field Data Verified"
          value={verifiedFieldData.length.toString()}
          description="Data submissions approved"
          icon={Shield}
        />
        <StatCard
          title="Credits Validated"
          value={verifiedCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0).toString()}
          description="Carbon credits approved"
          icon={Award}
        />
        <StatCard
          title="Total Actions"
          value={myActions.length.toString()}
          description="Verification activities"
          icon={FileText}
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="w-full flex flex-nowrap overflow-x-auto gap-2 sm:grid sm:grid-cols-4 sm:overflow-visible">
          <TabsTrigger value="projects" className="shrink-0">
            <span className="hidden xs:inline">Projects ({verifiedProjects.length})</span>
            <span className="xs:hidden">Proj ({verifiedProjects.length})</span>
          </TabsTrigger>
          <TabsTrigger value="fielddata" className="shrink-0">
            <span className="hidden xs:inline">Field Data ({verifiedFieldData.length})</span>
            <span className="xs:hidden">Data ({verifiedFieldData.length})</span>
          </TabsTrigger>
          <TabsTrigger value="credits" className="shrink-0">
            <span className="hidden xs:inline">Credits ({verifiedCredits.length})</span>
            <span className="xs:hidden">Credits ({verifiedCredits.length})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="shrink-0">
            <span className="hidden xs:inline">History ({myActions.length})</span>
            <span className="xs:hidden">Hist ({myActions.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Verified Projects */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Verified Projects</CardTitle>
              <CardDescription>Projects you have successfully verified and approved</CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Ecosystem</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Credits Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{getUserName(project.ngoId, "NGO")}</TableCell>
                        <TableCell>{project.ecosystemType}</TableCell>
                        <TableCell>{project.areaHectares} ha</TableCell>
                        <TableCell>{project.carbonCreditsTarget}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No verified projects yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verified Field Data */}
        <TabsContent value="fielddata">
          <Card>
            <CardHeader>
              <CardTitle>Verified Field Data</CardTitle>
              <CardDescription>Field observations and measurements you have verified</CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedFieldData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Plant Count</TableHead>
                      <TableHead>Health Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedFieldData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">{getProjectName(data.projectId)}</TableCell>
                        <TableCell className="capitalize">{data.dataType}</TableCell>
                        <TableCell>{getUserName(data.uploadedBy, "Panchayat")}</TableCell>
                        <TableCell>{data.plantCount.toLocaleString()}</TableCell>
                        <TableCell>{data.healthScore}%</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(data.uploadedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No verified field data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verified Credits */}
        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Validated Carbon Credits</CardTitle>
              <CardDescription>Carbon credits you have validated for issuance</CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedCredits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Validated Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-mono text-sm">{credit.tokenId}</TableCell>
                        <TableCell>{getProjectName(credit.projectId)}</TableCell>
                        <TableCell className="font-medium">{credit.creditsGenerated}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {credit.issuedAt ? new Date(credit.issuedAt).toLocaleDateString() : "Pending"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No validated carbon credits yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Verification History
              </CardTitle>
              <CardDescription>Complete history of your verification activities</CardDescription>
            </CardHeader>
            <CardContent>
              {myActions.length > 0 ? (
                <div className="space-y-4">
                  {myActions.map((action) => (
                    <div key={action.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          action.actionType === "approve" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {action.actionType === "approve" ? "Approved" : "Rejected"} {action.entityType}
                          </p>
                          <Badge variant={action.actionType === "approve" ? "default" : "destructive"}>
                            {action.actionType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{action.remarks}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(action.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No verification history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
