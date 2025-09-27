// Mock API for Blue Carbon Registry System
export interface User {
  id: number
  role: "NGO" | "Panchayat" | "Verifier" | "Admin"
  name: string
  contactEmail: string
  contactPhone: string
  documents: string[]
  jurisdiction?: string
  status: "pending" | "verified" | "rejected"
  registeredAt: string
  password?: string // add optional password to support mock auth
}

export interface Project {
  id: number
  name: string
  ngoId: number
  panchayatId: number
  plantationSiteId: number // Added reference to plantation site
  location: string
  ecosystemType: "Mangrove" | "Seagrass" | "Salt Marsh"
  areaHectares: number
  plantSpecies: string[]
  startDate: string
  status: "draft" | "pending_verification" | "approved" | "baseline_uploaded" | "plantation_started" | "monitoring" | "completed" | "rejected"
  carbonCreditsTarget: number
  carbonCreditsIssued: number
  projectDocuments: string[]
  baselineUploadedAt?: string
  plantationStartedAt?: string
  completedAt?: string
}

export interface PlantationSite {
  id: number
  name: string
  panchayatId: number
  location: string
  ecosystemType: "Mangrove" | "Seagrass" | "Salt Marsh"
  areaHectares: number
  soilType: string
  waterAccess: "High" | "Medium" | "Low"
  currentCondition: "Degraded" | "Partially Restored" | "Pristine"
  suitableSpecies: string[]
  images: string[]
  description: string
  coordinates: { lat: number; lng: number }
  status: "available" | "assigned" | "under_restoration"
  uploadedAt: string
}

export interface FieldData {
  id: number
  projectId: number
  uploadedBy: number
  dataType: "baseline" | "monitoring" | "verification"
  plantCount: number
  areaCovered: number
  survivalRate: number
  healthScore: number
  images: string[]
  status: "pending_verification" | "verified" | "rejected"
  uploadedAt: string
  sectionLabel?: string
  coordinates?: { lat: number; lng: number }
}

export interface CarbonCredit {
  id: number
  projectId: number
  creditsGenerated: number
  verifiedBy: number
  approvedBy: number
  tokenId: string
  status: "pending" | "verified" | "issued"
  issuedAt: string | null
  nccrNotificationSent: boolean
  solanaTransactionHash?: string
  blockchainVerified: boolean
}

export interface VerificationAction {
  id: number
  actionType: "approve" | "reject" | "request_info"
  entityType: "Project" | "FieldData" | "CarbonCredit" | "User"
  entityId: number
  performedBy: number
  remarks: string
  status: "completed" | "pending"
  timestamp: string
}

// Mock data
const users: User[] = [
  {
    id: 1,
    role: "NGO",
    name: "Green Earth NGO",
    contactEmail: "ngo1@example.com",
    contactPhone: "9876543210",
    documents: ["registration.pdf"],
    jurisdiction: "Sundarbans",
    status: "verified",
    registeredAt: "2025-01-10",
    password: "demo123",
  },
  {
    id: 2,
    role: "Panchayat",
    name: "Coastal Panchayat A",
    contactEmail: "panchayat1@example.com",
    contactPhone: "9123456780",
    documents: ["govt_cert.pdf"],
    jurisdiction: "Sundarbans",
    status: "verified",
    registeredAt: "2025-01-12",
    password: "demo123",
  },
  {
    id: 3,
    role: "Verifier",
    name: "DNV Verifier",
    contactEmail: "verifier@example.com",
    contactPhone: "9988776655",
    documents: ["certification.pdf"],
    status: "verified",
    registeredAt: "2025-01-15",
    password: "demo123",
  },
  {
    id: 4,
    role: "Admin",
    name: "NCCR Admin",
    contactEmail: "admin@nccr.gov.in",
    contactPhone: "9999999999",
    documents: [],
    status: "verified",
    registeredAt: "2025-01-01",
    password: "demo123",
  },
]

const projects: Project[] = [
  {
    id: 101,
    name: "Sundarbans Mangrove Restoration",
    ngoId: 1,
    panchayatId: 2,
    plantationSiteId: 1, // Added plantation site reference
    location: "Sundarbans, West Bengal",
    ecosystemType: "Mangrove",
    areaHectares: 50,
    plantSpecies: ["Avicennia", "Rhizophora"],
    startDate: "2025-02-01",
    status: "pending_verification",
    carbonCreditsTarget: 200,
    carbonCreditsIssued: 0,
    projectDocuments: ["proposal.pdf"],
  },
]

const fieldData: FieldData[] = [
  {
    id: 1001,
    projectId: 101,
    uploadedBy: 2,
    dataType: "baseline",
    plantCount: 5000,
    areaCovered: 50,
    survivalRate: 95,
    healthScore: 90,
    images: ["drone1.jpg", "drone2.jpg"],
    status: "pending_verification",
    uploadedAt: "2025-02-05",
    sectionLabel: "B2",
    coordinates: { lat: 21.9497, lng: 88.2636 },
  },
]

const carbonCredits: CarbonCredit[] = [
  {
    id: 501,
    projectId: 101,
    creditsGenerated: 120,
    verifiedBy: 3,
    approvedBy: 0,
    tokenId: "SPL12345",
    status: "pending",
    issuedAt: null,
  },
]

const verificationActions: VerificationAction[] = [
  {
    id: 2001,
    actionType: "approve",
    entityType: "Project",
    entityId: 101,
    performedBy: 3,
    remarks: "Verified project proposal and baseline.",
    status: "completed",
    timestamp: "2025-02-07",
  },
]

const plantationSites: PlantationSite[] = [
  {
    id: 1,
    name: "Sundarbans Delta Site A",
    panchayatId: 2,
    location: "Sundarbans, West Bengal",
    ecosystemType: "Mangrove",
    areaHectares: 50,
    soilType: "Saline Clay",
    waterAccess: "High",
    currentCondition: "Degraded",
    suitableSpecies: ["Avicennia marina", "Rhizophora mucronata", "Sonneratia apetala"],
    images: ["site1_aerial.jpg", "site1_ground.jpg"],
    description: "Former mangrove area affected by cyclone damage. High restoration potential with good tidal access.",
    coordinates: { lat: 21.9497, lng: 88.2636 },
    status: "available",
    uploadedAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Coastal Seagrass Meadow",
    panchayatId: 2,
    location: "Palk Bay, Tamil Nadu",
    ecosystemType: "Seagrass",
    areaHectares: 25,
    soilType: "Sandy",
    waterAccess: "High",
    currentCondition: "Partially Restored",
    suitableSpecies: ["Zostera marina", "Halophila ovalis"],
    images: ["seagrass1.jpg", "seagrass2.jpg"],
    description: "Shallow coastal area with existing seagrass patches. Suitable for expansion and restoration.",
    coordinates: { lat: 9.2647, lng: 79.1362 },
    status: "available",
    uploadedAt: "2025-01-20",
  },
]

// Mock API functions
export const mockApi = {
  // Users
  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return users
  },

  registerUser: async (
    userData: Omit<User, "id" | "registeredAt" | "status" | "password"> & { password: string },
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Prevent duplicate registrations by email
    const existing = users.find(
      (u) => u.contactEmail.trim().toLowerCase() === userData.contactEmail.trim().toLowerCase(),
    )
    if (existing) {
      throw new Error("Email is already registered")
    }

    const newUser: User = {
      ...userData,
      id: Math.max(...users.map((u) => u.id)) + 1,
      status: "pending",
      registeredAt: new Date().toISOString().split("T")[0],
      password: userData.password, // persist password for mock auth
    }
    users.push(newUser)
    return newUser
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return projects
  },

  createProject: async (projectData: Omit<Project, "id" | "status" | "carbonCreditsIssued">): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newProject: Project = {
      ...projectData,
      id: Math.max(...projects.map((p) => p.id)) + 1,
      status: "draft",
      carbonCreditsIssued: 0,
    }
    projects.push(newProject)
    return newProject
  },

  // Field Data
  getFieldData: async (): Promise<FieldData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return fieldData
  },

  uploadFieldData: async (data: Omit<FieldData, "id" | "uploadedAt" | "status">): Promise<FieldData> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newData: FieldData = {
      ...data,
      id: Math.max(...fieldData.map((f) => f.id)) + 1,
      status: "pending_verification",
      uploadedAt: new Date().toISOString().split("T")[0],
    }
    fieldData.push(newData)
    return newData
  },

  // Carbon Credits
  getCarbonCredits: async (): Promise<CarbonCredit[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return carbonCredits
  },

  // Verification Actions
  getVerificationActions: async (): Promise<VerificationAction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return verificationActions
  },

  performVerification: async (
    action: Omit<VerificationAction, "id" | "timestamp" | "status">,
  ): Promise<VerificationAction> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newAction: VerificationAction = {
      ...action,
      id: Math.max(...verificationActions.map((v) => v.id)) + 1,
      status: "completed",
      timestamp: new Date().toISOString(),
    }
    verificationActions.push(newAction)

    // Update entity status based on action
    if (action.entityType === "Project") {
      const project = projects.find((p) => p.id === action.entityId)
      if (project) {
        project.status = action.actionType === "approve" ? "approved" : "rejected"
      }
    } else if (action.entityType === "User") {
      const user = users.find((u) => u.id === action.entityId)
      if (user) {
        user.status = action.actionType === "approve" ? "verified" : "rejected"
      }
    }

    return newAction
  },

  // Admin functions
  updateUserStatus: async (userId: number, status: User["status"]): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = users.find((u) => u.id === userId)
    if (!user) throw new Error("User not found")
    user.status = status
    return user
  },

  updateProjectStatus: async (projectId: number, status: Project["status"]): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const project = projects.find((p) => p.id === projectId)
    if (!project) throw new Error("Project not found")
    project.status = status
    return project
  },

  // Plantation Sites
  getPlantationSites: async (): Promise<PlantationSite[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return plantationSites
  },

  createPlantationSite: async (
    siteData: Omit<PlantationSite, "id" | "uploadedAt" | "status">,
  ): Promise<PlantationSite> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newSite: PlantationSite = {
      ...siteData,
      id: Math.max(...plantationSites.map((s) => s.id)) + 1,
      status: "available",
      uploadedAt: new Date().toISOString().split("T")[0],
    }
    plantationSites.push(newSite)
    return newSite
  },

  updatePlantationSiteStatus: async (siteId: number, status: PlantationSite["status"]): Promise<PlantationSite> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const site = plantationSites.find((s) => s.id === siteId)
    if (!site) throw new Error("Plantation site not found")
    site.status = status
    return site
  },

  // NCCR Integration
  notifyNCCR: async (projectId: number, creditsGenerated: number): Promise<{ success: boolean; transactionId: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Simulate NCCR notification and Solana blockchain integration
    const transactionId = `SOL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Update carbon credit with blockchain info
    const credit = carbonCredits.find(c => c.projectId === projectId)
    if (credit) {
      credit.nccrNotificationSent = true
      credit.solanaTransactionHash = transactionId
      credit.blockchainVerified = true
      credit.status = "issued"
      credit.issuedAt = new Date().toISOString()
    }
    
    return { success: true, transactionId }
  },

  // Workflow Management
  startPlantation: async (projectId: number): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const project = projects.find((p) => p.id === projectId)
    if (!project) throw new Error("Project not found")
    
    project.status = "plantation_started"
    project.plantationStartedAt = new Date().toISOString().split("T")[0]
    return project
  },

  completeProject: async (projectId: number): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const project = projects.find((p) => p.id === projectId)
    if (!project) throw new Error("Project not found")
    
    project.status = "completed"
    project.completedAt = new Date().toISOString().split("T")[0]
    return project
  },

  // Generate Carbon Credits (called after verification)
  generateCarbonCredits: async (projectId: number, creditsGenerated: number, verifiedBy: number): Promise<CarbonCredit> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const newCredit: CarbonCredit = {
      id: Math.max(...carbonCredits.map((c) => c.id)) + 1,
      projectId,
      creditsGenerated,
      verifiedBy,
      approvedBy: 0, // Will be set when admin approves
      tokenId: `TOKEN_${Date.now()}`,
      status: "pending",
      issuedAt: null,
      nccrNotificationSent: false,
      blockchainVerified: false
    }
    
    carbonCredits.push(newCredit)
    return newCredit
  },
}
