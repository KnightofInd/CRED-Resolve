# API Documentation

All API endpoints return JSON responses in the following format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

## Authentication

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:** User object and session

---

### POST /api/auth/login
Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** User object and session

---

### POST /api/auth/logout
Sign out the current user.

**Response:** Success message

---

### GET /api/auth/me
Get current user information.

**Response:** Current user object

---

## Groups

### GET /api/groups
Fetch all groups for the current user.

**Response:** Array of groups with member counts

---

### POST /api/groups
Create a new group.

**Request Body:**
```json
{
  "name": "Weekend Trip",
  "description": "Trip to the mountains" // optional
}
```

**Response:** Created group object

---

### GET /api/groups/[id]
Get group details including members.

**Response:** Group object with members array

---

### PUT /api/groups/[id]
Update group details (admin only).

**Request Body:**
```json
{
  "name": "Updated Group Name",
  "description": "Updated description"
}
```

**Response:** Updated group object

---

### DELETE /api/groups/[id]
Delete a group (admin only).

**Response:** Success message

---

### POST /api/groups/[id]/members
Add a member to a group (admin only).

**Request Body:**
```json
{
  "user_id": "uuid",
  "role": "member" // or "admin"
}
```

**Response:** Created member object

---

### DELETE /api/groups/[id]/members?member_id=xxx
Remove a member from a group (admin only).

**Query Parameters:**
- `member_id`: UUID of the group member record

**Response:** Success message

---

## Expenses

### GET /api/expenses?group_id=xxx
Fetch expenses for a group.

**Query Parameters:**
- `group_id`: UUID of the group

**Response:** Array of expenses with splits

---

### POST /api/expenses
Create a new expense with splits.

**Request Body:**
```json
{
  "group_id": "uuid",
  "description": "Dinner at restaurant",
  "amount": 100.00,
  "split_type": "equal", // or "exact" or "percentage"
  "splits": [
    { "user_id": "uuid1", "amount": 50.00 },
    { "user_id": "uuid2", "amount": 50.00 }
  ]
}
```

**Split Types:**
- `equal`: Splits amount equally among users (amounts can be auto-calculated)
- `exact`: Each user pays exact amount specified
- `percentage`: Amounts represent percentages (must total 100)

**Response:** Created expense with splits

---

### GET /api/expenses/[id]
Get expense details with splits.

**Response:** Expense object with splits array

---

### DELETE /api/expenses/[id]
Delete an expense (creator only).

**Response:** Success message

---

## Balances

### GET /api/balances?group_id=xxx
Calculate and return balances for a group.

**Query Parameters:**
- `group_id`: UUID of the group
- `user_id`: (optional) Get balance for specific user

**Response:**
```json
{
  "balances": [
    {
      "user_id": "uuid",
      "balance": 25.50,
      "status": "owed", // or "owes" or "settled"
      "amount": 25.50
    }
  ],
  "simplified_debts": [
    {
      "from_user_id": "uuid1",
      "to_user_id": "uuid2",
      "amount": 25.50
    }
  ],
  "total_expenses": 10,
  "total_amount": 500.00
}
```

**User Balance Response (when user_id provided):**
```json
{
  "total_paid": 150.00,
  "total_share": 100.00,
  "net_balance": 50.00,
  "owes_to": [],
  "owed_by": [
    { "user_id": "uuid", "amount": 50.00 }
  ]
}
```

---

## Settlements

### GET /api/settlements?group_id=xxx
Fetch settlement history for a group.

**Query Parameters:**
- `group_id`: UUID of the group

**Response:** Array of settlement records

---

### POST /api/settlements
Record a settlement between two users.

**Request Body:**
```json
{
  "group_id": "uuid",
  "from_user_id": "uuid1",
  "to_user_id": "uuid2",
  "amount": 50.00
}
```

**Response:** Created settlement record

---

## Error Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error
