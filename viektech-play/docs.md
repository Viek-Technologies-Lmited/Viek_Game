# Viektech Play - API Documentation

Base URL: `http://localhost:3000/api`
Interactive Swagger Docs: `http://localhost:3000/api/docs`

## Table of Contents
1. [Auth](#auth)
2. [Users](#users)
3. [Organizations](#organizations)
4. [Questions](#questions)
5. [Games](#games)
6. [Leaderboard](#leaderboard)
7. [Payments](#payments)
8. [Admin](#admin)

---

## Auth

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No

**Request Body**:
```json
{
  "email": "player@viek.com",
  "password": "Password123!",
  "name": "Player One",
  "username": "player1"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No

**Request Body**:
```json
{
  "email": "player@viek.com",
  "password": "Password123!"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

## Users

### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Auth required**: Yes (Bearer Token), Admin only

**Response**:
```json
[
  {
    "id": "uuid-string",
    "email": "player@viek.com",
    "username": "player1",
    "role": "PLAYER",
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```

### Get User by ID
- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth required**: Yes (Bearer Token)

**Response**:
```json
{
  "id": "uuid-string",
  "email": "player@viek.com",
  "username": "player1",
  "role": "PLAYER",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Update User
- **URL**: `/users/:id`
- **Method**: `PATCH`
- **Auth required**: Yes (Bearer Token)

**Request Body**:
```json
{
  "name": "New Name",
  "username": "new_username"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "email": "player@viek.com",
  "username": "new_username",
  "role": "PLAYER",
  "updatedAt": "2023-10-01T12:05:00Z"
}
```

### Delete User
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Bearer Token), Admin only

**Response**: 
```json
{
  "message": "User deleted successfully"
}
```

---

## Organizations

### Create Organization
- **URL**: `/organizations`
- **Method**: `POST`
- **Auth required**: Yes (Bearer Token), Admin only

**Request Body**:
```json
{
  "name": "Viek Academy",
  "slug": "viek-academy",
  "description": "Learning hub"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Viek Academy",
  "slug": "viek-academy",
  "description": "Learning hub",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Get All Organizations
- **URL**: `/organizations`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "id": "uuid-string",
    "name": "Viek Academy",
    "slug": "viek-academy",
    "description": "Learning hub",
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```

### Get Organization by ID
- **URL**: `/organizations/:id`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Viek Academy",
  "slug": "viek-academy",
  "description": "Learning hub",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Update Organization
- **URL**: `/organizations/:id`
- **Method**: `PATCH`
- **Auth required**: Yes, Admin only

**Request Body**:
```json
{
  "name": "Viek Academy Updated",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Viek Academy Updated",
  "slug": "viek-academy",
  "description": "Updated description",
  "updatedAt": "2023-10-01T12:05:00Z"
}
```

### Delete Organization
- **URL**: `/organizations/:id`
- **Method**: `DELETE`
- **Auth required**: Yes, Admin only

**Response**: 
```json
{
  "message": "Organization deleted successfully"
}
```

---

## Questions

### Create Category
- **URL**: `/questions/categories`
- **Method**: `POST`
- **Auth required**: Yes, Admin only

**Request Body**:
```json
{
  "name": "Science",
  "description": "General Science questions"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Science",
  "description": "General Science questions",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Get All Categories
- **URL**: `/questions/categories`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "id": "uuid-string",
    "name": "Science",
    "description": "General Science questions",
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```

### Create Question
- **URL**: `/questions`
- **Method**: `POST`
- **Auth required**: Yes, Admin only

**Request Body**:
```json
{
  "categoryId": "uuid-string",
  "text": "What is the powerhouse of the cell?",
  "options": "[\"Nucleus\", \"Mitochondria\", \"Ribosome\", \"ER\"]",
  "correctAnswer": "Mitochondria",
  "points": 10,
  "difficulty": "EASY"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "categoryId": "uuid-string",
  "text": "What is the powerhouse of the cell?",
  "options": "[\"Nucleus\", \"Mitochondria\", \"Ribosome\", \"ER\"]",
  "correctAnswer": "Mitochondria",
  "points": 10,
  "difficulty": "EASY",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Get All Questions
- **URL**: `/questions`
- **Method**: `GET`
- **Query Parameters**: `?categoryId=uuid&difficulty=EASY`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "id": "uuid-string",
    "categoryId": "uuid-string",
    "text": "What is the powerhouse of the cell?",
    "options": "[\"Nucleus\", \"Mitochondria\", \"Ribosome\", \"ER\"]",
    "correctAnswer": "Mitochondria",
    "points": 10,
    "difficulty": "EASY",
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```

---

## Games

### Create Game Mode
- **URL**: `/games/modes`
- **Method**: `POST`
- **Auth required**: Yes, Admin only

**Request Body**:
```json
{
  "name": "Rapid Fire",
  "description": "Answer as many questions as possible in 60s",
  "timeLimit": 60,
  "questionCount": 20
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Rapid Fire",
  "description": "Answer as many questions as possible in 60s",
  "timeLimit": 60,
  "questionCount": 20,
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Get All Game Modes
- **URL**: `/games/modes`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "id": "uuid-string",
    "name": "Rapid Fire",
    "description": "Answer as many questions as possible in 60s",
    "timeLimit": 60,
    "questionCount": 20,
    "createdAt": "2023-10-01T12:00:00Z"
  }
]
```

### Create Game Session
- **URL**: `/games/sessions`
- **Method**: `POST`
- **Auth required**: Yes

**Request Body**:
```json
{
  "modeId": "uuid-string",
  "organizationId": "uuid-string"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "joinCode": "ABC12",
  "status": "waiting",
  "modeId": "uuid-string",
  "organizationId": "uuid-string",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

### Join Game Session
- **URL**: `/games/sessions/:id/join`
- **Method**: `POST`
- **Auth required**: Yes

**Request Body**:
*(Empty)*

**Response**:
```json
{
  "id": "session-player-uuid",
  "sessionId": "uuid-string",
  "userId": "uuid-string",
  "score": 0,
  "joinedAt": "2023-10-01T12:05:00Z"
}
```

### Submit Answer
- **URL**: `/games/sessions/:id/submit`
- **Method**: `POST`
- **Auth required**: Yes

**Request Body**:
```json
{
  "questionId": "uuid-string",
  "answer": "Mitochondria"
}
```

**Response**:
```json
{
  "correct": true,
  "pointsEarned": 10,
  "currentScore": 10
}
```

---

## Leaderboard

### Get Global Leaderboard
- **URL**: `/leaderboard/global`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "userId": "uuid-string",
    "username": "player1",
    "score": 1500,
    "gamesPlayed": 10
  }
]
```

### Get Organization Leaderboard
- **URL**: `/leaderboard/organization/:organizationId`
- **Method**: `GET`
- **Auth required**: Yes

**Response**:
```json
[
  {
    "userId": "uuid-string",
    "username": "student_viek",
    "score": 800,
    "gamesPlayed": 5
  }
]
```

---

## Payments

### Initialize Payment
- **URL**: `/payments/initialize`
- **Method**: `POST`
- **Auth required**: Yes

**Request Body**:
```json
{
  "amount": 5000,
  "plan": "PRO"
}
```

**Response**:
```json
{
  "paymentId": "uuid-string",
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "viek_169..._123"
}
```

### Paystack Webhook
- **URL**: `/payments/webhook`
- **Method**: `POST`
- **Auth required**: No (verified via Paystack signature header)

**Request Body**:
*(Expects standard Paystack Webhook Event JSON)*
```json
{
  "event": "charge.success",
  "data": {
    "reference": "viek_169..._123",
    "amount": 500000,
    "status": "success"
  }
}
```

**Response**:
```json
{
  "status": "success"
}
```

---

## Admin

### Get Dashboard Stats
- **URL**: `/admin`
- **Method**: `GET`
- **Auth required**: Yes, Admin only

**Response**:
```json
{
  "module": "admin",
  "status": "ok"
}
```
