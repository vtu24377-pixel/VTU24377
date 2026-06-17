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

---

# Stage 2

## Database Choice

For this notification platform, I would prefer using PostgreSQL.

My reason for choosing PostgreSQL is that the data in this system is highly structured. Every notification is connected to a student, and we also need to track whether a notification has been read or not. Since these records have clear relationships, a relational database is a good fit.

Another advantage is that PostgreSQL provides good query performance through indexing and is reliable when handling large amounts of data.

---

## Database Schema

### Students

This table stores student information.

| Column     | Type    |
| ---------- | ------- |
| student_id | UUID    |
| name       | VARCHAR |
| email      | VARCHAR |
| department | VARCHAR |

### Notifications

This table stores the notification details.

| Column          | Type      |
| --------------- | --------- |
| notification_id | UUID      |
| category        | VARCHAR   |
| title           | VARCHAR   |
| message         | TEXT      |
| priority        | VARCHAR   |
| created_at      | TIMESTAMP |

### Student_Notifications

This table acts as a bridge between students and notifications.

| Column          | Type      |
| --------------- | --------- |
| id              | UUID      |
| student_id      | UUID      |
| notification_id | UUID      |
| is_read         | BOOLEAN   |
| delivered_at    | TIMESTAMP |

This design allows a single notification to be delivered to multiple students while also tracking individual read status.

---

## Challenges as the System Grows

Initially the system may perform well, but as the number of students and notifications increases, a few issues can arise:

1. Fetching notifications may become slower.
2. Database size will continue to grow.
3. Peak notification periods can generate heavy traffic.
4. Read and unread notification queries may take longer to execute.

---

## Possible Improvements

### Indexing

Indexes can be created on frequently used columns such as:

* student_id
* notification_id
* created_at
* is_read

This helps reduce query execution time.

### Pagination

Instead of loading every notification at once, notifications should be loaded in smaller batches.

Example:

```text
GET /api/v1/notifications?page=1&limit=10
```

This improves performance and reduces unnecessary data transfer.

### Archiving Old Notifications

Older notifications that are no longer frequently accessed can be moved to archive tables. This keeps the active tables smaller and improves performance.

### Redis Caching

Frequently requested notification data can be stored in Redis. This reduces repeated database access and improves response times.

---

## SQL vs NoSQL

### PostgreSQL (SQL)

Pros:

* Strong consistency
* Easy to manage relationships
* Structured data storage
* Reliable transaction support

Cons:

* Schema updates require migrations
* Horizontal scaling is more challenging

### MongoDB (NoSQL)

Pros:

* Flexible document structure
* Easier horizontal scaling
* Suitable for rapidly changing data models

Cons:

* Relationship management is less straightforward
* Maintaining consistency can be more difficult

---

## Final Decision

Although both SQL and NoSQL databases can be used, I would select PostgreSQL for this project. Since notifications are linked to students and their read status, maintaining these relationships is important. PostgreSQL provides a clean structure, good performance through indexing, and reliable data consistency, which makes it a suitable choice for a campus notification system.

---

# Stage 3

## Analysis of the Given Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Correct?

Yes, the query is correct because it fetches all unread notifications of a particular student and sorts them based on when they were created.

However, even though the query gives the correct result, it may become slow when the notifications table contains millions of records.

---

## Why is the Query Slow?

There are a few reasons why this query may not perform well:

1. It uses `SELECT *`, which means every column is fetched even when all the data may not be needed.
2. If there is no index on `studentID` and `isRead`, the database has to check a large number of rows before finding the required records.
3. Sorting using `ORDER BY createdAt` can take additional time when many notifications match the condition.
4. As the number of notifications grows, the database needs more time and resources to process the query.

---

## Suggested Improvements

### Avoid Using SELECT *

Instead of fetching all columns, only the required fields should be selected.

```sql
SELECT notification_id,
       title,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

This reduces unnecessary data retrieval and improves performance.

### Add an Index

I would create an index on the columns that are frequently used in filtering and sorting.

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This helps the database find matching records much faster.

---

## Is Adding an Index Safe?

Yes, adding an index is generally a good idea because it improves query performance.

### Advantages

* Faster data retrieval
* Better filtering performance
* Faster sorting

### Disadvantages

* Extra storage space is required
* Insert and update operations may become slightly slower because the index also needs to be updated

---

## Will an Index Completely Solve the Problem?

No.

An index will improve performance, but it is not the only solution. As the amount of data keeps increasing, other optimizations may also be required such as:

* Pagination
* Caching using Redis
* Archiving old notifications
* Database partitioning

Using multiple optimization techniques together will give better long-term performance.

---

## Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

### Explanation

This query returns the unique student IDs of students who received placement-related notifications during the last seven days.
