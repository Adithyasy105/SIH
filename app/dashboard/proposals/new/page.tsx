"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type PlantationSite } from "@/lib/mockApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, MapPin, TreePine, Droplets } from "lucide-react"

export default function NewProposalPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [sitesLoading, setSitesLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [availableSites, setAvailableSites] = useState<PlantationSite[]>([])
  const [selectedSite, setSelectedSite] = useState<PlantationSite | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    plantationSiteId: searchParams.get("siteId") || "",
    startDate: "",
    carbonCreditsTarget: "",
    description: "",
    plantSpecies: "",
  })

  useEffect(() => {
    loadAvailableSites()
  }, [])

  useEffect(() => {
    if (formData.plantationSiteId) {
      const site = availableSites.find((s) => s.id.toString() === formData.plantationSiteId)
      setSelectedSite(site || null)
      if (site) {
        // Auto-populate form with site data
        setFormData((prev) => ({
          ...prev,
          plantSpecies: site.suitableSpecies.join(", "),
        }))
      }
    }
  }, [formData.plantationSiteId, availableSites])

  const loadAvailableSites = async () => {
    try {
      const sites = await mockApi.getPlantationSites()
      setAvailableSites(sites.filter((site) => site.status === "available"))
    } catch (err) {
      setError("Failed to load available sites")
    } finally {
      setSitesLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== "NGO" || !selectedSite) return

    setLoading(true)
    setError("")

    try {
      const created = await mockApi.createProject({
        name: formData.name,
        ngoId: user.id,
        panchayatId: selectedSite.panchayatId,
        plantationSiteId: selectedSite.id,
        location: selectedSite.location,
        ecosystemType: selectedSite.ecosystemType,
        areaHectares: selectedSite.areaHectares,
        plantSpecies: formData.plantSpecies.split(",").map((s) => s.trim()),
        startDate: formData.startDate,
        carbonCreditsTarget: Number.parseInt(formData.carbonCreditsTarget),
        projectDocuments: ["proposal.pdf"], // Mock document
      })

      await mockApi.updateProjectStatus(created.id, "pending_verification")

      // Update site status to assigned
      await mockApi.updatePlantationSiteStatus(selectedSite.id, "assigned")

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/projects")
      }, 2000)
    } catch (err) {
      setError("Failed to submit proposal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "NGO") {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Access denied. Only NGOs can submit proposals.</AlertDescription>
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
              <TreePine className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Proposal Submitted Successfully!</CardTitle>
            <CardDescription>Your restoration project proposal is now under review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your proposal has been submitted and will be reviewed by our verification team. You'll receive updates on
              the progress in your dashboard.
            </p>
            <Button onClick={() => router.push("/dashboard/projects")}>View My Projects</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sitesLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submit New Proposal</h1>
          <p className="text-muted-foreground">
            Create a restoration project proposal for an available plantation site
          </p>
        </div>

        {availableSites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Available Sites</h3>
              <p className="text-muted-foreground mb-4">
                There are currently no plantation sites available for new proposals. Please check back later or contact
                Panchayats to upload new sites.
              </p>
              <Button onClick={() => router.push("/dashboard/sites")}>Browse Sites</Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Site Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Select Plantation Site
                </CardTitle>
                <CardDescription>Choose an available site for your restoration project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plantationSiteId">Available Sites *</Label>
                  <Select
                    value={formData.plantationSiteId}
                    onValueChange={(value) => handleInputChange("plantationSiteId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plantation site" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          {site.name} - {site.location} ({site.areaHectares} ha)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Site Details Preview */}
                {selectedSite && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedSite.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedSite.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Ecosystem:</span>
                          <p className="font-medium">{selectedSite.ecosystemType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Area:</span>
                          <p className="font-medium">{selectedSite.areaHectares} ha</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Water Access:</span>
                          <div className="flex items-center">
                            <Droplets className="h-4 w-4 mr-1" />
                            <span className="font-medium">{selectedSite.waterAccess}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Condition:</span>
                          <p className="font-medium">{selectedSite.currentCondition}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground text-sm">Suitable Species:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedSite.suitableSpecies.map((species) => (
                            <Badge key={species} variant="secondary" className="text-xs">
                              {species}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{selectedSite.description}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="mr-2 h-5 w-5" />
                  Project Details
                </CardTitle>
                <CardDescription>Specific details about your restoration project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Sundarbans Mangrove Restoration Phase 1"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Planned Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbonCreditsTarget">Target Carbon Credits *</Label>
                    <Input
                      id="carbonCreditsTarget"
                      type="number"
                      placeholder="200"
                      value={formData.carbonCreditsTarget}
                      onChange={(e) => handleInputChange("carbonCreditsTarget", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plantSpecies">Plant Species *</Label>
                  <Input
                    id="plantSpecies"
                    placeholder="Species will be auto-populated from selected site"
                    value={formData.plantSpecies}
                    onChange={(e) => handleInputChange("plantSpecies", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Modify the species list if needed, separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your restoration approach, timeline, expected outcomes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Supporting Documents
                </CardTitle>
                <CardDescription>Upload project documents and baseline studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, JPG, PNG (Max 10MB each)</p>
                  <Button variant="outline" className="mt-4 bg-transparent" type="button">
                    Choose Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * For demo purposes, documents are automatically attached
                </p>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/sites")}>
                Browse Sites
              </Button>
              <Button type="submit" disabled={loading || !selectedSite}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Proposal"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
