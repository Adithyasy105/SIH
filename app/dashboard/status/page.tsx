"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type Project, type FieldData, type User } from "@/lib/mockApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/ui/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TreePine, Upload, CheckCircle, Clock, Calendar } from "lucide-react"

export default function StatusPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [fieldData, setFieldData] = useState<FieldData[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, fieldDataData, usersData] = await Promise.all([
          mockApi.getProjects(),
          mockApi.getFieldData(),
          mockApi.getUsers(),
        ])
        setProjects(projectsData)
        setFieldData(fieldDataData)
        setUsers(usersData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!user || user.role !== "Panchayat") {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. Only Panchayats can view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project status...</p>
        </div>
      </div>
    )
  }

  // Filter projects assigned to this Panchayat
  const assignedProjects = projects.filter((p) => p.panchayatId === user.id)
  const myFieldData = fieldData.filter((fd) => assignedProjects.some((p) => p.id === fd.projectId))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending_verification":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNGOName = (ngoId: number) => {
    const ngo = users.find((u) => u.id === ngoId && u.role === "NGO")
    return ngo?.name || "Unknown NGO"
  }

  const getProjectProgress = (project: Project) => {
    return (project.carbonCreditsIssued / project.carbonCreditsTarget) * 100
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Project Status</h1>
        <p className="text-muted-foreground">Track progress and status of your assigned projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Assigned Projects"
          value={assignedProjects.length.toString()}
          description="Total collaborations"
          icon={TreePine}
        />
        <StatCard
          title="Data Submissions"
          value={myFieldData.length.toString()}
          description="Field reports uploaded"
          icon={Upload}
        />
        <StatCard
          title="Verified Data"
          value={myFieldData.filter((fd) => fd.status === "verified").length.toString()}
          description="Approved submissions"
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Reviews"
          value={myFieldData.filter((fd) => fd.status === "pending_verification").length.toString()}
          description="Awaiting verification"
          icon={Clock}
        />
      </div>

      {/* Project Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {assignedProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    Partner: {getNGOName(project.ngoId)} • {project.ecosystemType}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Project Progress</span>
                <span>
                  {project.carbonCreditsIssued}/{project.carbonCreditsTarget} credits
                </span>
              </div>
              <Progress value={getProjectProgress(project)} className="h-2" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Area</p>
                  <p className="font-medium">{project.areaHectares} hectares</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Species: {project.plantSpecies.join(", ")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Field Data Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Field Data Submissions</CardTitle>
          <CardDescription>History of your data uploads and their verification status</CardDescription>
        </CardHeader>
        <CardContent>
          {myFieldData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Plant Count</TableHead>
                  <TableHead>Health Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myFieldData.map((data) => {
                  const project = assignedProjects.find((p) => p.id === data.projectId)
                  return (
                    <TableRow key={data.id}>
                      <TableCell className="font-medium">{project?.name || "Unknown Project"}</TableCell>
                      <TableCell className="capitalize">{data.dataType}</TableCell>
                      <TableCell>{new Date(data.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{data.plantCount.toLocaleString()}</TableCell>
                      <TableCell>{data.healthScore}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(data.status)}>{data.status.replace("_", " ")}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No field data uploaded yet</p>
              <p className="text-sm text-muted-foreground">Start by uploading field observations and measurements</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates on your projects and submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Field data verified</p>
                <p className="text-xs text-muted-foreground">Sundarbans Mangrove Restoration • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Monitoring data uploaded</p>
                <p className="text-xs text-muted-foreground">Coastal Seagrass Initiative • 1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Project collaboration started</p>
                <p className="text-xs text-muted-foreground">New mangrove restoration project • 3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
