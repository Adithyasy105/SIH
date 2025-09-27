"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Eye, CheckCircle, XCircle, Users, Shield, TreePine, Building } from "lucide-react"
import useSWR from "swr"
import { mockApi, type User as RegistryUser } from "@/lib/mockApi"
import { useSearchParams } from "next/navigation"

const mockUsers = [
  {
    id: 1,
    name: "Green Earth Foundation",
    contactEmail: "contact@greenearth.org",
    role: "NGO",
    status: "verified",
    registeredAt: "2024-01-15",
    jurisdiction: "Mumbai, Maharashtra",
    contactPhone: "1234567890",
    documents: ["document1.pdf", "document2.pdf"],
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    contactEmail: "rajesh.kumar@marine.edu",
    role: "Verifier",
    status: "pending",
    registeredAt: "2024-01-20",
    jurisdiction: "Chennai, Tamil Nadu",
    contactPhone: "",
    documents: [],
  },
  {
    id: 3,
    name: "Coastal Panchayat A",
    contactEmail: "panchayat.coastal@kerala.gov.in",
    role: "Panchayat",
    status: "verified",
    registeredAt: "2024-01-10",
    jurisdiction: "Kochi, Kerala",
    contactPhone: "0987654321",
    documents: ["document3.pdf"],
  },
  {
    id: 4,
    name: "Ocean Care NGO",
    contactEmail: "info@oceancare.org",
    role: "NGO",
    status: "verified",
    registeredAt: "2024-01-12",
    jurisdiction: "Goa",
    contactPhone: "",
    documents: [],
  },
  {
    id: 5,
    name: "Prof. Meera Sharma",
    contactEmail: "meera.sharma@iit.ac.in",
    role: "Verifier",
    status: "verified",
    registeredAt: "2024-01-08",
    jurisdiction: "Bombay, Maharashtra",
    contactPhone: "1122334455",
    documents: ["document4.pdf", "document5.pdf", "document6.pdf"],
  },
]

export default function UsersPage() {
  const searchParams = useSearchParams()

  const { data: users = [], isLoading, mutate } = useSWR("users", mockApi.getUsers)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const initialStatus = searchParams.get("filter") || "all"
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [selectedUser, setSelectedUser] = useState<RegistryUser | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleApprove = async (userId: number) => {
    await mockApi.updateUserStatus(userId, "verified")
    await mutate()
    if (selectedUser?.id === userId) setSelectedUser({ ...(selectedUser as RegistryUser), status: "verified" })
  }
  const handleReject = async (userId: number) => {
    await mockApi.updateUserStatus(userId, "rejected")
    await mutate()
    if (selectedUser?.id === userId) setSelectedUser({ ...(selectedUser as RegistryUser), status: "rejected" })
  }

  const totalUsers = users.length
  const activeNGOs = users.filter((u) => u.role === "NGO" && u.status === "verified").length
  const totalVerifiers = users.filter((u) => u.role === "Verifier").length
  const pendingCount = users.filter((u) => u.status === "pending").length

  const getRoleIcon = (role) => {
    switch (role) {
      case "NGO":
        return TreePine
      case "Verifier":
        return Shield
      case "Panchayat":
        return Building
      default:
        return Users
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage platform users, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{isLoading ? "…" : totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active NGOs</p>
                <p className="text-2xl font-bold">{isLoading ? "…" : activeNGOs}</p>
              </div>
              <TreePine className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verifiers</p>
                <p className="text-2xl font-bold">{isLoading ? "…" : totalVerifiers}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{isLoading ? "…" : pendingCount}</p>
              </div>
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Verifier">Verifier</SelectItem>
                <SelectItem value="Panchayat">Panchayat</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading ? [] : filteredUsers).map((user: RegistryUser) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.contactEmail}</div>
                          {user.jurisdiction ? (
                            <div className="text-xs text-muted-foreground">{user.jurisdiction}</div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <RoleIcon className="h-4 w-4" />
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.contactPhone || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.registeredAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>View and manage user information</DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Name</Label>
                                      <p className="text-sm">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Email</Label>
                                      <p className="text-sm">{selectedUser.contactEmail}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Role</Label>
                                      <p className="text-sm">{selectedUser.role}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Status</Label>
                                      <Badge className={getStatusColor(selectedUser.status)}>
                                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                      </Badge>
                                    </div>
                                    {selectedUser.jurisdiction && (
                                      <div>
                                        <Label className="text-sm font-medium">Jurisdiction</Label>
                                        <p className="text-sm">{selectedUser.jurisdiction}</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label className="text-sm font-medium">Registered</Label>
                                      <p className="text-sm">{selectedUser.registeredAt}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Phone</Label>
                                      <p className="text-sm">{selectedUser.contactPhone || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Documents</Label>
                                      <p className="text-sm">{selectedUser.documents?.join(", ") || "-"}</p>
                                    </div>
                                  </div>

                                  {selectedUser.status === "pending" && (
                                    <div className="space-y-4">
                                      <Label className="text-sm font-medium">Admin Action</Label>
                                      <Textarea placeholder="Add approval/rejection notes..." />
                                      <div className="flex gap-2">
                                        <Button className="flex-1" onClick={() => handleApprove(selectedUser.id)}>
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Approve User
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          className="flex-1"
                                          onClick={() => handleReject(selectedUser.id)}
                                        >
                                          <XCircle className="mr-2 h-4 w-4" />
                                          Reject Application
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {user.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(user.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
