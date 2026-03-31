# Asset Lifecycle Management API Documentation

Base URL: `http://localhost:3000/api`

## Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/auth/register` | Register a new user | No |
| POST   | `/auth/login` | Login and get JWT token | No |
| GET    | `/auth/me` | Get current user's profile | Yes |
| POST   | `/auth/logout` | Logout (Invalidates session/client side) | Yes |

## Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/categories` | Get all categories | Yes |
| POST   | `/categories` | Create a new category | Yes |
| PATCH  | `/categories/:id` | Update a category | Yes |
| DELETE | `/categories/:id` | Delete a category | Yes |

## Officers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/officers` | List all officers | Yes |
| POST   | `/officers` | Create a new officer | Yes |
| GET    | `/officers/:id` | Get officer details | Yes |
| PATCH  | `/officers/:id` | Update officer details | Yes |
| DELETE | `/officers/:id` | Delete an officer | Yes |
| GET    | `/officers/:id/clearance-check` | Check if officer has unreturned assets | Yes |

## Assets
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/assets` | List assets (with pagination) | Yes |
| POST   | `/assets` | Register a new asset | Yes |
| GET    | `/assets/:id` | Get asset details | Yes |
| PATCH  | `/assets/:id` | Update asset information | Yes |
| DELETE | `/assets/:id` | Delete an asset | Yes |

## Asset Assignments (Issuing/Returning)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/assignments` | Get assignment list | Yes |
| GET    | `/assignments/active/:officerId` | Get all active assets held by officer | Yes |
| POST   | `/assignments/issue` | Issue an asset to an officer | Yes |
| POST   | `/assignments/return/:id` | Return an issued asset | Yes |

## Maintenance
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/maintenance/send` | Send an asset for repair | Yes |
| PUT    | `/maintenance/receive/:id`| Mark as received from maintenance | Yes |
| GET    | `/maintenance/history/:assetId`| Get repair history of an asset | Yes |

## NOC (No Objection Certificate)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/noc` | List all NOC requests | Yes |
| POST   | `/noc/apply` | Apply for exit/retirement NOC | Yes |
| PUT    | `/noc/approve/:id` | Approve an NOC request | Yes |

## Activity Logs & Timeline
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/activity-logs` | List all activity logs (Query: `?assetId=1&actionType=CREATE&page=1`) | Yes |
| GET    | `/activity-logs/:id/timeline` | Get full history/timeline of a specific asset | Yes |

## Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/dashboard/stats` | Get summary counts, category distribution, and alerts | Yes |

---
**Note:** All protected endpoints require a Bearer Token in the `Authorization` header.
`Authorization: Bearer <your_jwt_token>`
