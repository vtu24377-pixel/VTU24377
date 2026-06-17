# Notification System Design

## Stage 1

### Notification Actions

#### 1. Career Opportunities

This category covers notifications related to placements, internships, recruitment drives, hackathons, and interview schedules. These updates help students stay informed about career-related opportunities and important deadlines.

#### 2. Academic Progress Alerts

This category includes notifications about assignment submissions, attendance shortages, examination schedules, and result announcements. These alerts help students keep track of their academic responsibilities.

#### 3. Campus Engagement Notifications

This category is used for workshops, seminars, club activities, technical events, cultural programs, and other events happening on campus. The purpose is to encourage student participation and engagement.

---

# API Design

## API 1 – Create Notification

### Purpose

This API allows administrators to create and publish a notification for students.

### Endpoint

POST /api/v1/notifications

### Headers

Authorization: Bearer <token>

Content-Type: application/json

### Request Body

```json
{
  "category": "Career Opportunities",
  "title": "Software Engineer Internship",
  "message": "Applications are now open for final-year students.",
  "priority": "High"
}
```

### Response

```json
{
  "notificationId": "NTF1001",
  "status": "created",
  "message": "Notification created successfully"
}
```

### Status Codes

* 201 Created
* 400 Bad Request
* 401 Unauthorized

---

## API 2 – Fetch Notifications

### Purpose

This API retrieves notifications available for a specific student.

### Endpoint

GET /api/v1/notifications?studentId=1042&page=1&limit=10

### Headers

Authorization: Bearer <token>

### Response

```json
{
  "notifications": [
    {
      "id": "NTF1001",
      "category": "Career Opportunities",
      "title": "Software Engineer Internship",
      "message": "Applications are now open",
      "isRead": false,
      "createdAt": "2026-06-17T10:00:00Z"
    }
  ]
}
```

### Status Codes

* 200 OK
* 401 Unauthorized
* 404 Not Found

---

## API 3 – Mark Notification as Read

### Purpose

This API updates the notification status after a student has viewed it.

### Endpoint

PATCH /api/v1/notifications/{notificationId}/read

### Headers

Authorization: Bearer <token>

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Status Codes

* 200 OK
* 401 Unauthorized
* 404 Not Found

---

## Real-Time Notification Delivery

### Selected Approach: WebSockets

For real-time communication, I chose WebSockets because they allow the server to instantly deliver notifications to students without requiring them to refresh the page repeatedly.

### Workflow

1. A student logs into the application.
2. The frontend establishes a WebSocket connection with the backend server.
3. Whenever a new notification is created, the backend sends it through the active WebSocket connection.
4. The student receives the notification immediately within the application interface.

### Benefits

* Instant notification delivery.
* Reduces unnecessary polling requests.
* Improves user experience by providing real-time updates.
* Works efficiently even when the number of notifications increases.

## Assumptions

* Students must be authenticated before accessing notifications.
* Users can only view notifications intended for them.
* Administrators are responsible for creating and managing notifications.
* The system should support additional notification categories in the future without requiring major API changes.
