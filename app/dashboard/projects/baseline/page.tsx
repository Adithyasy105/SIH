"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type Project, type FieldData } from "@/lib/mockApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Camera, MapPin, TreePine, CheckCircle, FileText } from "lucide-react"

export default function BaselineReportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [projectLoading, setProjectLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [project, setProject] = useState<Project | null>(null)

  const [formData, setFormData] = useState({
    plantCount: "",
    areaCovered: "",
    survivalRate: "",
    healthScore: "",
    soilCondition: "",
    salinityLevel: "",
    waterQuality: "",
    biodiversityNotes: "",
    sectionLabel: "",
    latitude: "",
    longitude: "",
    description: "",
  })

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projects = await mockApi.getProjects()
        const projectId = searchParams.get("projectId")
        const foundProject = projects.find(p => p.id === parseInt(projectId || "0"))
        if (foundProject) {
          setProject(foundProject)
        } else {
          setError("Project not found")
        }
      } catch (err) {
        setError("Failed to load project")
      } finally {
        setProjectLoading(false)
      }
    }
    loadProject()
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== "NGO" || !project) return

    setLoading(true)
    setError("")

    try {
      // Upload baseline field data
      await mockApi.uploadFieldData({
        projectId: project.id,
        uploadedBy: user.id,
        dataType: "baseline",
        plantCount: parseInt(formData.plantCount),
        areaCovered: parseFloat(formData.areaCovered),
        survivalRate: parseFloat(formData.survivalRate),
        healthScore: parseFloat(formData.healthScore),
        images: ["baseline_photo1.jpg", "baseline_photo2.jpg", "drone_survey.jpg"], // Mock images
        sectionLabel: formData.sectionLabel,
        coordinates: {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude)
        }
      })

      // Update project status to indicate baseline is pending verification
      await mockApi.updateProjectStatus(project.id, "pending_verification")

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/projects")
      }, 2000)
    } catch (err) {
      setError("Failed to upload baseline report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "NGO") {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Access denied. Only NGOs can upload baseline reports.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (projectLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Project not found or you don't have access to it.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Baseline Report Uploaded Successfully!</CardTitle>
            <CardDescription>Your baseline data is now under verification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your baseline report has been uploaded and will be reviewed by our verification team. 
              You can now proceed with plantation activities.
            </p>
            <Button onClick={() => router.push("/dashboard/projects")}>View My Projects</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Upload Baseline Report
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Document the "before" state of your restoration project
          </p>
        </div>

        {/* Project Information */}
        <Card className="mb-6 lg:mb-8 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <TreePine className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs sm:text-sm text-muted-foreground">Project:</span>
                <p className="text-sm sm:text-base font-medium">{project.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs sm:text-sm text-muted-foreground">Location:</span>
                <p className="text-sm sm:text-base font-medium">{project.location}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs sm:text-sm text-muted-foreground">Ecosystem:</span>
                <p className="text-sm sm:text-base font-medium">{project.ecosystemType}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs sm:text-sm text-muted-foreground">Area:</span>
                <p className="text-sm sm:text-base font-medium">{project.areaHectares} hectares</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Baseline Measurements */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Baseline Measurements
              </CardTitle>
              <CardDescription>Document the current state before plantation begins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantCount">Current Plant Count *</Label>
                  <Input
                    id="plantCount"
                    type="number"
                    placeholder="0"
                    value={formData.plantCount}
                    onChange={(e) => handleInputChange("plantCount", e.target.value)}
                    className="border-border/50 focus:border-primary/50 transition-all duration-300"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Number of existing plants in the area</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaCovered">Area Covered (hectares) *</Label>
                  <Input
                    id="areaCovered"
                    type="number"
                    step="0.1"
                    placeholder="50.0"
                    value={formData.areaCovered}
                    onChange={(e) => handleInputChange("areaCovered", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survivalRate">Current Survival Rate (%) *</Label>
                  <Input
                    id="survivalRate"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.survivalRate}
                    onChange={(e) => handleInputChange("survivalRate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthScore">Health Score (1-100) *</Label>
                  <Input
                    id="healthScore"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="50"
                    value={formData.healthScore}
                    onChange={(e) => handleInputChange("healthScore", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Conditions</CardTitle>
              <CardDescription>Document soil, water, and biodiversity conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soilCondition">Soil Condition *</Label>
                  <Select
                    value={formData.soilCondition}
                    onValueChange={(value) => handleInputChange("soilCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor - Highly degraded</SelectItem>
                      <SelectItem value="Fair">Fair - Some degradation</SelectItem>
                      <SelectItem value="Good">Good - Minimal degradation</SelectItem>
                      <SelectItem value="Excellent">Excellent - Pristine condition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salinityLevel">Salinity Level *</Label>
                  <Select
                    value={formData.salinityLevel}
                    onValueChange={(value) => handleInputChange("salinityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salinity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low (0-15 ppt)</SelectItem>
                      <SelectItem value="Medium">Medium (15-30 ppt)</SelectItem>
                      <SelectItem value="High">High (30-45 ppt)</SelectItem>
                      <SelectItem value="Very High">Very High (&gt;45 ppt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterQuality">Water Quality Assessment</Label>
                <Textarea
                  id="waterQuality"
                  placeholder="Describe water quality, clarity, pollution levels, etc."
                  value={formData.waterQuality}
                  onChange={(e) => handleInputChange("waterQuality", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biodiversityNotes">Biodiversity Observations</Label>
                <Textarea
                  id="biodiversityNotes"
                  placeholder="Note any existing wildlife, fish, birds, or other species observed"
                  value={formData.biodiversityNotes}
                  onChange={(e) => handleInputChange("biodiversityNotes", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location Details
              </CardTitle>
              <CardDescription>Precise location information for the baseline survey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionLabel">Section/Plot Label *</Label>
                  <Input
                    id="sectionLabel"
                    placeholder="e.g., A1, B2, North Section"
                    value={formData.sectionLabel}
                    onChange={(e) => handleInputChange("sectionLabel", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="21.9497"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="88.2636"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Photo Documentation
              </CardTitle>
              <CardDescription>Upload photos showing the current state of the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Upload baseline photos and drone images</p>
                <p className="text-xs text-muted-foreground mb-4">Include: Aerial view, ground-level shots, soil samples, water conditions</p>
                <Button variant="outline" type="button">
                  Choose Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * For demo purposes, baseline images are automatically attached
              </p>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any other observations or important information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Baseline Report Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Additional observations, challenges, opportunities, or important notes about the current state"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Baseline Report
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
