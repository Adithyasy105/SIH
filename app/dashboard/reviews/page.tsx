"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type Project, type FieldData, type CarbonCredit, type User } from "@/lib/mockApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, FileText, Upload, Award } from "lucide-react"

export default function ReviewsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [fieldData, setFieldData] = useState<FieldData[]>([])
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "">("")
  const [remarks, setRemarks] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, fieldDataData, creditsData, usersData] = await Promise.all([
          mockApi.getProjects(),
          mockApi.getFieldData(),
          mockApi.getCarbonCredits(),
          mockApi.getUsers(),
        ])
        setProjects(projectsData)
        setFieldData(fieldDataData)
        setCarbonCredits(creditsData)
        setUsers(usersData)
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

  const pendingProjects = projects.filter((p) => p.status === "pending_verification")
  const pendingFieldData = fieldData.filter((fd) => fd.status === "pending_verification")
  const pendingCredits = carbonCredits.filter((cc) => cc.status === "pending")

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

  const handleReview = async () => {
    if (!selectedItem || !reviewAction || !user) return

    setSubmitting(true)
    try {
      let entityType: "Project" | "FieldData" | "CarbonCredit" = "Project"
      const entityId = selectedItem.id

      if ("projectId" in selectedItem && "plantCount" in selectedItem) {
        entityType = "FieldData"
      } else if ("creditsGenerated" in selectedItem) {
        entityType = "CarbonCredit"
      }

      await mockApi.performVerification({
        actionType: reviewAction,
        entityType,
        entityId,
        performedBy: user.id,
        remarks: remarks || `${reviewAction === "approve" ? "Approved" : "Rejected"} by verifier`,
      })

      // Refresh data
      const [projectsData, fieldDataData, creditsData] = await Promise.all([
        mockApi.getProjects(),
        mockApi.getFieldData(),
        mockApi.getCarbonCredits(),
      ])
      setProjects(projectsData)
      setFieldData(fieldDataData)
      setCarbonCredits(creditsData)

      // Reset form
      setSelectedItem(null)
      setReviewAction("")
      setRemarks("")
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading review queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">Verify projects, field data, and carbon credits</p>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="w-full flex flex-nowrap overflow-x-auto gap-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
          <TabsTrigger value="projects" className="flex items-center shrink-0">
            <FileText className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Projects ({pendingProjects.length})</span>
            <span className="xs:hidden">Proj ({pendingProjects.length})</span>
          </TabsTrigger>
          <TabsTrigger value="fielddata" className="flex items-center shrink-0">
            <Upload className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Field Data ({pendingFieldData.length})</span>
            <span className="xs:hidden">Data ({pendingFieldData.length})</span>
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center shrink-0">
            <Award className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Carbon Credits ({pendingCredits.length})</span>
            <span className="xs:hidden">Credits ({pendingCredits.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Proposals Pending Review</CardTitle>
              <CardDescription>Review and verify new restoration project proposals</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Ecosystem</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Target Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{getUserName(project.ngoId, "NGO")}</TableCell>
                        <TableCell>{project.ecosystemType}</TableCell>
                        <TableCell>{project.areaHectares} ha</TableCell>
                        <TableCell>{project.carbonCreditsTarget}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(project)}>
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Project: {project.name}</DialogTitle>
                                <DialogDescription>
                                  Verify the project proposal and provide your assessment
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Project Details */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">NGO:</p>
                                    <p className="text-muted-foreground">{getUserName(project.ngoId, "NGO")}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Panchayat:</p>
                                    <p className="text-muted-foreground">
                                      {getUserName(project.panchayatId, "Panchayat")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Location:</p>
                                    <p className="text-muted-foreground">{project.location}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Ecosystem:</p>
                                    <p className="text-muted-foreground">{project.ecosystemType}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Area:</p>
                                    <p className="text-muted-foreground">{project.areaHectares} hectares</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Start Date:</p>
                                    <p className="text-muted-foreground">
                                      {new Date(project.startDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium mb-2">Plant Species:</p>
                                  <p className="text-muted-foreground">{project.plantSpecies.join(", ")}</p>
                                </div>

                                {/* Review Actions */}
                                <div className="space-y-4">
                                  <div className="flex space-x-4">
                                    <Button
                                      variant={reviewAction === "approve" ? "default" : "outline"}
                                      onClick={() => setReviewAction("approve")}
                                      className="flex items-center"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant={reviewAction === "reject" ? "destructive" : "outline"}
                                      onClick={() => setReviewAction("reject")}
                                      className="flex items-center"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="remarks">Remarks</Label>
                                    <Textarea
                                      id="remarks"
                                      placeholder="Add your verification comments..."
                                      value={remarks}
                                      onChange={(e) => setRemarks(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <Button
                                    onClick={handleReview}
                                    disabled={!reviewAction || submitting}
                                    className="w-full"
                                  >
                                    {submitting ? "Submitting..." : "Submit Review"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No projects pending review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Data Tab */}
        <TabsContent value="fielddata">
          <Card>
            <CardHeader>
              <CardTitle>Field Data Pending Verification</CardTitle>
              <CardDescription>Review field observations and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingFieldData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Plant Count</TableHead>
                      <TableHead>Health Score</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFieldData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">{getProjectName(data.projectId)}</TableCell>
                        <TableCell className="capitalize">{data.dataType}</TableCell>
                        <TableCell>{getUserName(data.uploadedBy, "Panchayat")}</TableCell>
                        <TableCell>{data.plantCount.toLocaleString()}</TableCell>
                        <TableCell>{data.healthScore}%</TableCell>
                        <TableCell>{new Date(data.uploadedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(data)}>
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Field Data</DialogTitle>
                                <DialogDescription>Verify the field measurements and observations</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Field Data Details */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Project:</p>
                                    <p className="text-muted-foreground">{getProjectName(data.projectId)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Data Type:</p>
                                    <p className="text-muted-foreground capitalize">{data.dataType}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Plant Count:</p>
                                    <p className="text-muted-foreground">{data.plantCount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Area Covered:</p>
                                    <p className="text-muted-foreground">{data.areaCovered} hectares</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Survival Rate:</p>
                                    <p className="text-muted-foreground">{data.survivalRate}%</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Health Score:</p>
                                    <p className="text-muted-foreground">{data.healthScore}%</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium mb-2">Images:</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {data.images.map((image, index) => (
                                      <div
                                        key={index}
                                        className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                                      >
                                        <span className="text-xs text-muted-foreground">{image}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Review Actions */}
                                <div className="space-y-4">
                                  <div className="flex space-x-4">
                                    <Button
                                      variant={reviewAction === "approve" ? "default" : "outline"}
                                      onClick={() => setReviewAction("approve")}
                                      className="flex items-center"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Verify
                                    </Button>
                                    <Button
                                      variant={reviewAction === "reject" ? "destructive" : "outline"}
                                      onClick={() => setReviewAction("reject")}
                                      className="flex items-center"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="remarks">Verification Notes</Label>
                                    <Textarea
                                      id="remarks"
                                      placeholder="Add your verification comments..."
                                      value={remarks}
                                      onChange={(e) => setRemarks(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <Button
                                    onClick={handleReview}
                                    disabled={!reviewAction || submitting}
                                    className="w-full"
                                  >
                                    {submitting ? "Submitting..." : "Submit Verification"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No field data pending verification</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carbon Credits Tab */}
        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Credits Pending Validation</CardTitle>
              <CardDescription>Validate carbon credit calculations and approve issuance</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCredits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-mono text-sm">{credit.tokenId}</TableCell>
                        <TableCell>{getProjectName(credit.projectId)}</TableCell>
                        <TableCell className="font-medium">{credit.creditsGenerated}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(credit)}>
                                Validate
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Validate Carbon Credits</DialogTitle>
                                <DialogDescription>Review and validate the carbon credit calculation</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Token ID:</p>
                                    <p className="text-muted-foreground font-mono">{credit.tokenId}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Credits Generated:</p>
                                    <p className="text-muted-foreground">{credit.creditsGenerated}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Project:</p>
                                    <p className="text-muted-foreground">{getProjectName(credit.projectId)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Status:</p>
                                    <p className="text-muted-foreground">{credit.status}</p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex space-x-4">
                                    <Button
                                      variant={reviewAction === "approve" ? "default" : "outline"}
                                      onClick={() => setReviewAction("approve")}
                                      className="flex items-center"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Validate
                                    </Button>
                                    <Button
                                      variant={reviewAction === "reject" ? "destructive" : "outline"}
                                      onClick={() => setReviewAction("reject")}
                                      className="flex items-center"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="remarks">Validation Notes</Label>
                                    <Textarea
                                      id="remarks"
                                      placeholder="Add your validation comments..."
                                      value={remarks}
                                      onChange={(e) => setRemarks(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <Button
                                    onClick={handleReview}
                                    disabled={!reviewAction || submitting}
                                    className="w-full"
                                  >
                                    {submitting ? "Submitting..." : "Submit Validation"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No carbon credits pending validation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
