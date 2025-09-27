# Blue Carbon Registry - Corrected Workflow Implementation

## ✅ Corrected Workflow Sequence

### 1. **Field Availability (Panchayat Role)**
- **Action**: Panchayats upload available land/fields for restoration
- **Data Required**: 
  - Land details (location, GPS, area size)
  - Ownership/permission status
  - Current condition (wasteland, degraded mangroves, etc.)
- **Implementation**: ✅ `/dashboard/sites/upload` - Already implemented correctly

### 2. **Project Proposal (NGO Role)**
- **Action**: NGOs submit proposals for available fields
- **Data Required**:
  - Plantation plan (species, density, duration)
  - Resources required
  - Expected CO₂ sequestration
- **Implementation**: ✅ `/dashboard/proposals/new` - Already implemented correctly

### 3. **Baseline Report (After Proposal Approval)**
- **Action**: NGOs upload baseline data AFTER proposal approval
- **Data Required**:
  - Pre-plantation photos/videos
  - Drone/satellite images
  - Soil condition, salinity, etc.
- **Implementation**: ✅ `/dashboard/projects/baseline` - **NEWLY ADDED**

### 4. **Plantation & Monitoring (During Project)**
- **Action**: NGOs carry out plantation and upload periodic reports
- **Data Required**:
  - Photos/videos (with timestamps + GPS)
  - Drone survey data
  - Community participation records
- **Implementation**: ✅ `/dashboard/projects/monitoring` - **NEWLY ADDED**

### 5. **Verification (MRV Stage)**
- **Action**: Verifiers cross-check NGO data vs. satellite/drone scans
- **Process**: Growth & survival rate verification
- **Implementation**: ✅ Already implemented in verification system

### 6. **NCCR Notification & Credits Generation**
- **Action**: Once verified, notify NCCR and mint tokenized carbon credits on Solana
- **Process**: Smart contract mints credits, assigns to NGO (and possibly Panchayat)
- **Implementation**: ✅ **NEWLY ADDED** - NCCR integration functions

## 🔧 Key Corrections Made

### 1. **Added Baseline Report Workflow**
- **File**: `app/dashboard/projects/baseline/page.tsx`
- **Purpose**: NGOs upload baseline data after proposal approval
- **Features**:
  - Environmental measurements (soil, water, biodiversity)
  - Photo documentation
  - GPS coordinates
  - Pre-plantation state documentation

### 2. **Added Monitoring Report System**
- **File**: `app/dashboard/projects/monitoring/page.tsx`
- **Purpose**: NGOs upload periodic progress reports during plantation
- **Features**:
  - Current measurements (plant count, survival rate, health score)
  - Activity documentation (new plantings, maintenance)
  - Community participation tracking
  - Progress photos and drone images

### 3. **Enhanced Project Status Workflow**
- **Updated**: `lib/mockApi.ts`
- **New Statuses**:
  - `baseline_uploaded` - After baseline report submission
  - `plantation_started` - After plantation begins
  - `monitoring` - During active monitoring phase
  - `completed` - Project finished
- **Added Functions**:
  - `startPlantation()` - Mark plantation as started
  - `completeProject()` - Mark project as completed
  - `generateCarbonCredits()` - Create credits after verification
  - `notifyNCCR()` - Integrate with NCCR and Solana blockchain

### 4. **Updated Projects Page with Workflow Actions**
- **File**: `app/dashboard/projects/page.tsx`
- **Features**:
  - Dynamic action buttons based on project status
  - Workflow progression indicators
  - Status-specific color coding
  - Action buttons for each workflow step

## 🎯 Workflow Status Progression

```
1. Panchayat uploads field → Site status: "available"
2. NGO submits proposal → Project status: "pending_verification"
3. Verifier approves → Project status: "approved"
4. NGO uploads baseline → Project status: "baseline_uploaded"
5. NGO starts plantation → Project status: "plantation_started"
6. NGO uploads monitoring → Project status: "monitoring"
7. Verifier verifies → Project status: "completed"
8. NCCR notified → Carbon credits minted on Solana
```

## 🔗 Integration Points

### NCCR Integration
- **Function**: `notifyNCCR(projectId, creditsGenerated)`
- **Process**: 
  1. Verifier approves project
  2. System calculates carbon credits
  3. NCCR notification sent
  4. Solana blockchain transaction created
  5. Tokenized credits minted
  6. Credits assigned to NGO/Panchayat

### Blockchain Integration
- **Platform**: Solana blockchain
- **Token Type**: SPL tokens for carbon credits
- **Features**:
  - Immutable credit records
  - Transparent verification
  - Tradeable carbon credits
  - Smart contract automation

## 📊 Data Flow

### Baseline Data Flow
```
NGO → Upload Baseline → System → Verifier Review → Approved → Plantation Can Start
```

### Monitoring Data Flow
```
NGO → Upload Monitoring → System → Verifier Review → Progress Tracked → Credits Calculated
```

### Credit Generation Flow
```
Verifier Approval → Credit Calculation → NCCR Notification → Solana Minting → Credit Assignment
```

## ✅ Implementation Status

- [x] **Panchayat Field Upload** - Already implemented
- [x] **NGO Project Proposals** - Already implemented  
- [x] **Baseline Report Upload** - **NEWLY IMPLEMENTED**
- [x] **Monitoring Report System** - **NEWLY IMPLEMENTED**
- [x] **Verification System** - Already implemented
- [x] **NCCR Integration** - **NEWLY IMPLEMENTED**
- [x] **Workflow Status Management** - **NEWLY IMPLEMENTED**
- [x] **Dynamic Action Buttons** - **NEWLY IMPLEMENTED**

## 🚀 Next Steps

1. **Test the complete workflow** with sample data
2. **Integrate real Solana blockchain** (currently mocked)
3. **Add email notifications** for workflow transitions
4. **Implement real-time updates** for project status changes
5. **Add mobile app support** for field data collection

## 📝 Notes

- All workflow steps now enforce proper sequence
- Status transitions are controlled and validated
- NCCR integration is ready for real blockchain connection
- Monitoring system supports multiple progress reports
- Baseline system ensures proper "before" state documentation
