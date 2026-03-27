# API Documentation - Vibha Events

## Base URL
```
http://localhost:3000/api  (development)
https://vibhaevents.com/api (production)
```

---

## Endpoints

### 1. Get All Projects
```
GET /api/projects
```

**Description:** Retrieve all portfolio projects

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "title": "Crystal Ballroom Wedding",
    "description": "Elegant wedding with premium floral arrangements",
    "category": "Decoration & Styling",
    "mediaUrl": "https://...",
    "mediaType": "image",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Error (500):**
```json
{
  "error": "Failed to retrieve projects",
  "message": "Error details..."
}
```

---

### 2. Get Project by ID
```
GET /api/projects/:id
```

**Parameters:**
- `id` (string, required): Project ID

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "Crystal Ballroom Wedding",
  "description": "Elegant wedding...",
  "category": "Decoration & Styling",
  "mediaUrl": "https://...",
  "mediaType": "image",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (404):**
```json
{
  "error": "Project not found"
}
```

---

### 3. Health Check
```
GET /api/health
```

**Description:** Server health status endpoint

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Data Types

### Category
Union type of:
- `"Decoration & Styling"`
- `"Photography"`
- `"Videography"`
- `"Catering"`
- `"Wedding Planning"`
- `"Corporate Events"`
- `"Entertainment"`
- `"Lighting & Sound"`
- `"VIP Transportation"`
- `"Venue Selection"`
- `"Invitations & Stationery"`
- `"Gifting & Favors"`
- `"Make-up"`

### PortfolioProject
```typescript
{
  id: string;              // Unique identifier
  title: string;           // Project name
  description?: string;    // Optional description
  category: Category;      // Service category
  mediaUrl: string;        // Image/video URL
  mediaType: "image" | "video";
  createdAt: string;       // ISO 8601 timestamp
  authorUid?: string;      // Optional author ID
}
```

---

## Rate Limiting

Current limits (per hour):
- GET requests: 1000 requests
- POST requests: 100 requests
- Per IP: 10000 requests

---

## CORS

Allowed origins (configurable):
- Development: `*`
- Production: `vibhaevents.com`, `www.vibhaevents.com`

---

## Authentication

Currently no authentication required for public endpoints.

For admin endpoints (future):
- Use JWT Bearer token
- Header: `Authorization: Bearer <token>`

---

## Examples

### Get all projects (JavaScript)
```javascript
fetch('/api/projects')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Get specific project (JavaScript)
```javascript
fetch('/api/projects/1')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Health check (cURL)
```bash
curl http://localhost:3000/api/health
```

---

## Versioning

API version: v1
Future updates: Versions will be prefixed, e.g., `/api/v2/projects`

---

## Support

For API issues:
- Check DEPLOYMENT.md for setup instructions
- Review request/response format
- Check server logs
- Verify network connectivity

Contact: dev@vibhaevents.com
