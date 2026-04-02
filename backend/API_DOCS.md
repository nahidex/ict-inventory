# Asset Lifecycle Management API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

| Method | Endpoint         | Description                | Auth Required |
| ------ | ---------------- | -------------------------- | ------------- |
| POST   | `/auth/register` | Register a new user        | No            |
| POST   | `/auth/login`    | Login and get JWT token    | No            |
| GET    | `/auth/me`       | Get current user's profile | Yes           |

### Auth API Details

#### 1. Login

- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
  ```

---

## Branches

| Method | Endpoint               | Description                             | Auth Required |
| ------ | ---------------------- | --------------------------------------- | ------------- |
| GET    | `/branches`            | List all branches                       | Yes           |
| POST   | `/branches`            | Create a new branch                     | Yes           |
| PATCH  | `/branches/:id`        | Update branch details                   | Yes           |
| GET    | `/branches/:id/assets` | List assets in a branch (with officers) | Yes           |

### Branch API Details

#### 1. Create a New Branch

- **Endpoint:** `POST /branches`
- **Request Body:**
  ```json
  {
    "name": "প্রশাসন শাখা-১",
    "code": "ADMIN_01",
    "location": "৪র্থ তলা, উত্তর পাশ",
    "roomNumber": "৪০২",
    "phoneExt": "১১০"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Branch created successfully",
    "data": { "id": 1, "name": "প্রশাসন শাখা-১", ... }
  }
  ```

#### 2. Get Branch Assets

- **Endpoint:** `GET /branches/:id/assets`
- **Response (200 OK):**
  ```json
  {
    "branchName": "প্রশাসন শাখা-১",
    "assets": [
      {
        "id": 1,
        "assetTag": "AST-LPT-201",
        "category": { "name": "Laptop" },
        "currentOfficer": { "name": "Rahim Ahmed" }
      }
    ]
  }
  ```

---

## Officers

| Method | Endpoint                        | Description                            | Auth Required |
| ------ | ------------------------------- | -------------------------------------- | ------------- |
| GET    | `/officers`                     | List all officers                      | Yes           |
| POST   | `/officers`                     | Create a new officer                   | Yes           |
| PATCH  | `/officers/:id`                 | Update officer details                 | Yes           |
| GET    | `/officers/:id/clearance-check` | Check if officer has unreturned assets | Yes           |
| PATCH  | `/officers/:id/transfer`        | Transfer officer to another branch     | Yes           |

### Officer API Details

#### 1. Transfer Officer (Badli)

- **Endpoint:** `PATCH /officers/:id/transfer`
- **Request Body:**
  ```json
  {
    "newBranchId": 5,
    "assetsToCarry": [1, 2],
    "assetsToLeave": [3, 4]
  }
  ```
- **Description:**
  - `newBranchId`: নতুন শাখার আইডি। (বাধ্যতামূলক)
  - `assetsToCarry`: যে মালামালগুলোর (Asset ID) শাখা অফিসারের সাথে পরিবর্তন হবে।
  - `assetsToLeave`: যে মালামালগুলো (Asset ID) আগের শাখায় 'Available' হিসেবে রেখে যাবেন।

- **Response (200 OK):**
  ```json
  {
    "message": "Officer transferred successfully",
    "officer": "মোঃ রহিম আহমেদ",
    "from": "প্রশাসন শাখা-১",
    "to": "আইসিটি বিভাগ"
  }
  ```

#### 2. Create Officer

- **Endpoint:** `POST /officers`
- **Request (Multipart/form-data):**
  - `name`: Rahim Ahmed
  - `designation`: Assistant Manager
  - `department`: IT
  - `email`: rahim@example.com
  - `photo`: (File upload)

---

## Assets

| Method | Endpoint      | Description                   | Auth Required |
| ------ | ------------- | ----------------------------- | ------------- |
| GET    | `/assets`     | List assets (with pagination) | Yes           |
| POST   | `/assets`     | Register a new asset          | Yes           |
| GET    | `/assets/:id` | Get asset details             | Yes           |
| PATCH  | `/assets/:id` | Update asset information      | Yes           |

### Asset API Details

#### 1. Create Asset

- **Endpoint:** `POST /assets`
- **Request (Multipart/form-data):**
  - `assetTag`: AST-LPT-001
  - `categoryId`: 1
  - `branchId`: 2
  - `brand`: Dell
  - `model`: Latitude 5420
  - `serialNumber`: SN123456
  - `purchaseDate`: 2023-10-01
  - `status`: Available
  - `image`: (File upload)

#### 2. Get Asset Details

- **Endpoint:** `GET /assets/:id`
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "assetTag": "AST-LPT-001",
    "branch": { "name": "Admin" },
    "assignments": [
      /* assignment records */
    ],
    "maintenance": [
      /* repair history */
    ]
  }
  ```

---

## Asset Assignments (Issuing/Returning)

| Method | Endpoint                  | Description                  | Auth Required |
| ------ | ------------------------- | ---------------------------- | ------------- |
| POST   | `/assignments/issue`      | Issue an asset to an officer | Yes           |
| POST   | `/assignments/return/:id` | Return an issued asset       | Yes           |

### Assignment API Details

#### 1. Issue Asset

- **Endpoint:** `POST /assignments/issue`
- **Request Body:**
  ```json
  {
    "assetId": 1,
    "officerId": 5,
    "issueDate": "2024-04-02",
    "comments": "Issued for project work"
  }
  ```

#### 2. Return Asset

- **Endpoint:** `POST /assignments/return/:id` (where :id is Assignment ID)
- **Request (Multipart/form-data):**
  - `actualReturnDate`: 2024-04-10
  - `returnCondition`: Good
  - `comments`: No issues found.
  - `image`: (Return condition photo)

---

## Maintenance

| Method | Endpoint                   | Description                       | Auth Required |
| ------ | -------------------------- | --------------------------------- | ------------- |
| POST   | `/maintenance/send`        | Send an asset for repair          | Yes           |
| PUT    | `/maintenance/receive/:id` | Mark as received from maintenance | Yes           |

### Maintenance API Details

#### 1. Send for Maintenance

- **Endpoint:** `POST /maintenance/send`
- **Request Body:**
  ```json
  {
    "assetId": 1,
    "issueDescription": "Screen flickering",
    "vendorName": "Dell Service Center",
    "sentDate": "2024-04-02"
  }
  ```

#### 2. Receive from Maintenance

- **Endpoint:** `PUT /maintenance/receive/:id`
- **Request Body:**
  ```json
  {
    "receiveDate": "2024-04-05",
    "repairCost": 2500,
    "repairStatus": "Completed"
  }
  ```

---

## NOC (No Objection Certificate)

| Method | Endpoint           | Description                   | Auth Required |
| ------ | ------------------ | ----------------------------- | ------------- |
| GET    | `/noc`             | List all NOC requests         | Yes           |
| POST   | `/noc/apply`       | Apply for exit/retirement NOC | Yes           |
| PUT    | `/noc/approve/:id` | Approve an NOC request        | Yes           |

---

## Activity Logs & Dashboard

| Method | Endpoint           | Description        | Auth Required |
| ------ | ------------------ | ------------------ | ------------- |
| GET    | `/activity-logs`   | List all logs      | Yes           |
| GET    | `/dashboard/stats` | Get summary counts | Yes           |

---

**Note:** All protected endpoints require a Bearer Token in the `Authorization` header.
`Authorization: Bearer <your_jwt_token>`
