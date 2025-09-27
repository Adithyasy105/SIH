"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { mockApi, type PlantationSite } from "@/lib/mockApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, TreePine, Droplets, Plus, Eye } from "lucide-react"

export default function PlantationSitesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<PlantationSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      const data = await mockApi.getPlantationSites()
      // Filter sites based on user role
      if (user?.role === "Panchayat") {
        setSites(data.filter((site) => site.panchayatId === user.id))
      } else if (user?.role === "NGO") {
        setSites(data.filter((site) => site.status === "available"))
      } else {
        setSites(data)
      }
    } catch (err) {
      setError("Failed to load plantation sites")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: PlantationSite["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "assigned":
        return "bg-yellow-500"
      case "under_restoration":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getConditionColor = (condition: PlantationSite["currentCondition"]) => {
    switch (condition) {
      case "Pristine":
        return "text-green-600"
      case "Partially Restored":
        return "text-yellow-600"
      case "Degraded":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (!user) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Please log in to view plantation sites.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {user.role === "Panchayat" ? "My Plantation Sites" : "Available Plantation Sites"}
            </h1>
            <p className="text-muted-foreground">
              {user.role === "Panchayat"
                ? "Manage and upload plantation sites in your jurisdiction"
                : "Browse available sites for restoration projects"}
            </p>
          </div>
          {user.role === "Panchayat" && (
            <Button onClick={() => router.push("/dashboard/sites/upload")}>
              <Plus className="mr-2 h-4 w-4" />
              Upload New Site
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Plantation Sites</h3>
              <p className="text-muted-foreground mb-4">
                {user.role === "Panchayat"
                  ? "Upload your first plantation site to get started"
                  : "No sites are currently available for restoration projects"}
              </p>
              {user.role === "Panchayat" && (
                <Button onClick={() => router.push("/dashboard/sites/upload")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Site
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {site.location}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(site.status)} text-white`}>
                      {site.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ecosystem:</span>
                      <p className="font-medium">{site.ecosystemType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <p className="font-medium">{site.areaHectares} ha</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Water Access:</span>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1" />
                        <span className="font-medium">{site.waterAccess}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Condition:</span>
                      <p className={`font-medium ${getConditionColor(site.currentCondition)}`}>
                        {site.currentCondition}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">Suitable Species:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {site.suitableSpecies.slice(0, 2).map((species) => (
                        <Badge key={species} variant="secondary" className="text-xs">
                          {species}
                        </Badge>
                      ))}
                      {site.suitableSpecies.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{site.suitableSpecies.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{site.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {user.role === "NGO" && site.status === "available" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/proposals/new?siteId=${site.id}`)}
                      >
                        Create Proposal
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
