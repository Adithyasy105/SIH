"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { mockApi } from "@/lib/mockApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, MapPin, TreePine, CheckCircle, Camera } from "lucide-react"

export default function UploadSitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    ecosystemType: "" as "Mangrove" | "Seagrass" | "Salt Marsh" | "",
    areaHectares: "",
    soilType: "",
    waterAccess: "" as "High" | "Medium" | "Low" | "",
    currentCondition: "" as "Degraded" | "Partially Restored" | "Pristine" | "",
    suitableSpecies: "",
    description: "",
    latitude: "",
    longitude: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== "Panchayat") return

    setLoading(true)
    setError("")

    try {
      await mockApi.createPlantationSite({
        name: formData.name,
        panchayatId: user.id,
        location: formData.location,
        ecosystemType: formData.ecosystemType as "Mangrove" | "Seagrass" | "Salt Marsh",
        areaHectares: Number.parseInt(formData.areaHectares),
        soilType: formData.soilType,
        waterAccess: formData.waterAccess as "High" | "Medium" | "Low",
        currentCondition: formData.currentCondition as "Degraded" | "Partially Restored" | "Pristine",
        suitableSpecies: formData.suitableSpecies.split(",").map((s) => s.trim()),
        images: ["site_aerial.jpg", "site_ground.jpg"], // Mock images
        description: formData.description,
        coordinates: {
          lat: Number.parseFloat(formData.latitude),
          lng: Number.parseFloat(formData.longitude),
        },
      })

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/sites")
      }, 2000)
    } catch (err) {
      setError("Failed to upload plantation site. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "Panchayat") {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Access denied. Only Panchayats can upload plantation sites.</AlertDescription>
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
            <CardTitle>Plantation Site Uploaded Successfully!</CardTitle>
            <CardDescription>Your site is now available for NGO proposals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your plantation site has been uploaded and is now visible to NGOs for creating restoration proposals.
            </p>
            <Button onClick={() => router.push("/dashboard/sites")}>View My Sites</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Plantation Site</h1>
          <p className="text-muted-foreground">Add a new site available for restoration projects</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="mr-2 h-5 w-5" />
                Site Information
              </CardTitle>
              <CardDescription>Basic details about the plantation site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Sundarbans Delta Site A"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecosystemType">Ecosystem Type *</Label>
                  <Select
                    value={formData.ecosystemType}
                    onValueChange={(value) => handleInputChange("ecosystemType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ecosystem type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mangrove">Mangrove</SelectItem>
                      <SelectItem value="Seagrass">Seagrass</SelectItem>
                      <SelectItem value="Salt Marsh">Salt Marsh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="e.g., Sundarbans, West Bengal"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the current state, restoration potential, access conditions..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Site Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle>Site Characteristics</CardTitle>
              <CardDescription>Environmental and physical properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="areaHectares">Area (Hectares) *</Label>
                  <Input
                    id="areaHectares"
                    type="number"
                    placeholder="50"
                    value={formData.areaHectares}
                    onChange={(e) => handleInputChange("areaHectares", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type *</Label>
                  <Input
                    id="soilType"
                    placeholder="e.g., Saline Clay, Sandy"
                    value={formData.soilType}
                    onChange={(e) => handleInputChange("soilType", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterAccess">Water Access *</Label>
                  <Select
                    value={formData.waterAccess}
                    onValueChange={(value) => handleInputChange("waterAccess", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select water access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentCondition">Current Condition *</Label>
                  <Select
                    value={formData.currentCondition}
                    onValueChange={(value) => handleInputChange("currentCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Degraded">Degraded</SelectItem>
                      <SelectItem value="Partially Restored">Partially Restored</SelectItem>
                      <SelectItem value="Pristine">Pristine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suitableSpecies">Suitable Species *</Label>
                  <Input
                    id="suitableSpecies"
                    placeholder="e.g., Avicennia marina, Rhizophora mucronata"
                    value={formData.suitableSpecies}
                    onChange={(e) => handleInputChange("suitableSpecies", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">List suitable plant species, separated by commas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Coordinates */}
          <Card>
            <CardHeader>
              <CardTitle>GPS Coordinates</CardTitle>
              <CardDescription>Precise location for mapping and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Site Images
              </CardTitle>
              <CardDescription>Upload photos showing the current state of the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop images here, or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">Supported formats: JPG, PNG (Max 5MB each)</p>
                <Button variant="outline" type="button">
                  Choose Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * For demo purposes, images are automatically attached
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
                  Upload Site
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
