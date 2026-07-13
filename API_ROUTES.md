# CrewDesk API Routes

All API endpoints require authentication. Authentication is handled via Supabase Auth with HTTP-only cookies.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Calls

#### GET /calls
Fetch all calls for the current user.

**Query Parameters:**
- `status` (optional): Filter by status (completed, missed, failed)

**Response:**
```json
[
  {
    "id": "uuid",
    "agent_id": "uuid",
    "caller_phone_number": "+1234567890",
    "caller_name": "John Doe",
    "duration_seconds": 300,
    "status": "completed",
    "transcript": "...",
    "recording_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /calls
Create a new call record.

**Body:**
```json
{
  "caller_phone_number": "+1234567890",
  "caller_name": "John Doe",
  "status": "completed"
}
```

---

### Leads

#### GET /leads
Fetch all leads for the current user.

**Query Parameters:**
- `status` (optional): Filter by status (new, contacted, qualified, converted)
- `qualified` (optional): Filter by qualified (true/false)

**Response:**
```json
[
  {
    "id": "uuid",
    "agent_id": "uuid",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "service_type": "roof replacement",
    "status": "new",
    "qualified": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /leads
Create a new lead.

**Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "service_type": "roof replacement",
  "status": "new",
  "qualified": true
}
```

---

### Notifications

#### GET /notifications
Fetch all notifications for the current user.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "qualified",
    "title": "New Qualified Lead",
    "message": "John Doe is interested in roof replacement",
    "unread": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### PUT /notifications
Mark notifications as read or unread.

**Body:**
```json
{
  "notificationIds": ["uuid-1", "uuid-2"],
  "markAsRead": true
}
```

#### POST /notifications
Create a new notification (for testing).

**Body:**
```json
{
  "type": "qualified",
  "title": "New Qualified Lead",
  "message": "John Doe is interested in roof replacement"
}
```

---

### Analytics

#### GET /analytics/dashboard
Fetch analytics data for the current user.

**Query Parameters:**
- `days` (optional): Number of days to include (default: 7)

**Response:**
```json
{
  "summary": {
    "totalCalls": 42,
    "completedCalls": 38,
    "missedCalls": 4,
    "averageDurationSeconds": 315,
    "totalLeads": 12,
    "qualifiedLeads": 10,
    "conversionRatePercent": 28
  },
  "callsByDate": {
    "2024-01-15": 5,
    "2024-01-14": 3
  },
  "leadsByStatus": {
    "new": 2,
    "contacted": 3,
    "qualified": 5,
    "converted": 2
  },
  "recentCalls": [...],
  "recentLeads": [...]
}
```

---

### Webhooks

#### POST /webhooks/retell
Receive call events from Retell.

**Event Types:**
- `call_started`: Call has started
- `call_ended`: Call has ended
- `call_analyzed`: Call has been analyzed

**Example Payload:**
```json
{
  "event": "call_ended",
  "call_id": "retell-call-id",
  "agent_id": "uuid",
  "duration_seconds": 300,
  "recording_url": "https://...",
  "transcript": "...",
  "qualified_lead": true,
  "lead_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "service_type": "roof replacement"
  }
}
```

---

## Authentication

All requests must include valid Supabase session cookies. The session is automatically managed by the middleware.

## Error Responses

```json
{
  "error": "Error message"
}
```

**Common Status Codes:**
- 401: Unauthorized (not authenticated)
- 400: Bad Request (invalid parameters)
- 500: Internal Server Error
