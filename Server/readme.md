# TalkyTalk Backend API Documentation

## Chat Routes

### Create Personal Chat
- **Endpoint**: `POST /chat/personal`
- **Authentication**: Required
- **Request Body**:
```json
{
    "chatName": "string (min 3 characters)",
    "members": ["userId"]
}
```
- **Validation**:
  - chatName: Minimum 3 characters
  - members: Array with exactly 1 member
- **Response**: Returns the created chat object

### Create Group Chat
- **Endpoint**: `POST /chat/group`
- **Authentication**: Required
- **Request Body**:
```json
{
    "chatName": "string (min 3 characters)",
    "members": ["userId1", "userId2", ...]
}
```
- **Validation**:
  - chatName: Minimum 3 characters
  - members: Array with minimum 2 members
- **Response**: Returns the created group chat object

### Get All Chats
- **Endpoint**: `GET /chat`
- **Authentication**: Required
- **Response**: Returns array of user's chats

### Get Chat IDs
- **Endpoint**: `GET /chat/chatIds`
- **Authentication**: Required
- **Response**: Returns array of chat IDs

### Rename Group
- **Endpoint**: `PUT /chat/grouprename`
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
    "chatId": "string",
    "updatedChatName": "string (min 3 characters)"
}
```
- **Validation**:
  - chatId: Required
  - updatedChatName: Minimum 3 characters
- **Response**: Returns updated chat object

### Add Users to Group
- **Endpoint**: `PUT /chat/groupadd`
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
    "chatId": "string",
    "userIds": ["userId1", "userId2", ...]
}
```
- **Validation**:
  - chatId: Required
  - userIds: Array of user IDs
- **Response**: Returns updated chat object

### Remove Users from Group
- **Endpoint**: `PUT /chat/groupremove`
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
    "chatId": "string",
    "userIds": ["userId1", "userId2", ...]
}
```
- **Validation**:
  - chatId: Required
  - userIds: Array of user IDs
- **Response**: Returns updated chat object

## Message Routes

### Get All Messages
- **Endpoint**: `POST /message`
- **Authentication**: Required
- **Request Body**:
```json
{
    "chatId": "string"
}
```
- **Response**: Returns array of messages for the specified chat

### Send Message
- **Endpoint**: `POST /message/send`
- **Authentication**: Required
- **Request Body**:
```json
{
    "content": "string",
    "chatId": "string",
    "replyTo": "string (optional)"
}
```
- **Response**: Returns the created message object

### Mark Message as Seen
- **Endpoint**: `POST /message/mark-seen`
- **Authentication**: Required
- **Request Body**:
```json
{
    "senderId": "string",
    "receiverId": "string"
}
```
- **Response**: Updates message seen status

### Delete Message
- **Endpoint**: `POST /message/delete`
- **Authentication**: Required
- **Request Body**:
```json
{
    "messageId": "string"
}
```
- **Response**: Confirmation of message deletion

## User Routes

### Get All Users
- **Endpoint**: `GET /users`
- **Authentication**: Not Required
- **Response**: Returns array of all users

### Sign Up
- **Endpoint**: `POST /users/signup`
- **Authentication**: Not Required
- **Request Body**: Multipart Form Data
```json
{
    "firstName": "string (min 3 chars)",
    "lastName": "string (min 3 chars)",
    "username": "string (min 3 chars)",
    "email": "valid email",
    "password": "string (min 4 chars)",
    "confirmPassword": "string (min 4 chars)",
    "age": "number (min 16)",
    "gender": "enum: male|female|other|prefer not to say",
    "otp": "string (4 digits)",
    "image": "file upload"
}
```
- **Validation**:
  - firstName/lastName: Minimum 3 characters
  - username: Minimum 3 characters, no special characters
  - email: Valid email format
  - password: Minimum 4 characters
  - age: Minimum 16
  - gender: Must be one of specified values
  - otp: 4 digits
  - image: Required file upload

### Login
- **Endpoint**: `POST /users/login`
- **Authentication**: Not Required
- **Request Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Response**: Returns user object and authentication token

### Get Profile
- **Endpoint**: `GET /users/profile`
- **Authentication**: Required
- **Response**: Returns current user's profile

### Logout
- **Endpoint**: `GET /users/logout`
- **Authentication**: Required
- **Response**: Clears authentication token

### Update User
- **Endpoint**: `PUT /users/update/:id`
- **Authentication**: Required
- **Request Body**:
```json
{
    "bio": "string (optional)",
    "username": "string (optional)",
    "firstName": "string (optional)",
    "lastName": "string (optional)"
}
```
- **Response**: Returns updated user object

### Block User
- **Endpoint**: `PUT /users/block`
- **Authentication**: Required
- **Request Body**:
```json
{
    "blockerId": "string",
    "blockedId": "string"
}
```
- **Response**: Confirmation of user block

### Unblock User
- **Endpoint**: `PUT /users/unblock`
- **Authentication**: Required
- **Request Body**:
```json
{
    "blockerId": "string",
    "blockedId": "string"
}
```
- **Response**: Confirmation of user unblock

## Authentication Details

### Authentication Middleware
The application uses JWT (JSON Web Token) based authentication middleware. This middleware:
- Checks for JWT token in either:
  - Cookie: `token=<jwt_token>`
  - Authorization header: `Bearer <jwt_token>`
- Verifies token validity
- Loads user information
- Attaches user object to request

### Error Responses
- **401 Unauthorized**: 
  - When no token is provided
  - When user is not found
- **403 Forbidden**: 
  - When token is invalid
  - When token has expired

### Token Format
```json
{
    "_id": "userId"
}
```

### Usage Example
```javascript
// Headers
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5..."
}

// OR Cookie
token=eyJhbGciOiJIUzI1NiIsInR5...
```

### Protected Routes
All routes marked with "Authentication: Required" use this middleware and require a valid JWT token.

### Token Expiration
- Tokens expire after 24 hours
- Expired tokens will return a 403 Forbidden response

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User doesn't have required permissions
- **404 Not Found**: Requested resource not found
- **500 Internal Server Error**: Server-side error

## Socket.IO & Real-Time Messaging

### Overview

TalkyTalk uses [Socket.IO](https://socket.io/) for real-time chat and user presence updates. The Socket.IO server is initialized in `socket/socket.js` and integrated with the main Express app in `server.js`.

### Socket.IO Events

#### Connection

- When a client connects, the server increments the online user count.

#### Join Room

- **Event:** `joinRoom`
- **Payload:** `roomIds: Array<string>`
- **Description:** The client joins one or more chat rooms (by chat IDs). The server tracks and emits the user count for each room.

#### Send Message

- **Event:** `chat`
- **Payload:**
  ```json
  {
    "roomId": "string",
    "message": "string",
    "sender": "userId",
    "replyTo": "messageId (optional)"
  }
  ```
- **Description:** Sends a message to a chat room. If `replyTo` is provided, the message is linked as a reply. The server emits the message (with optional reply data) to all users in the room and saves it to the database.

#### User Presence

- **Event:** `userConnected`
- **Payload:** `userId: string`
- **Description:** Tracks online users and emits the current user count.

#### Disconnection

- When a user disconnects, the server decrements the online user count and emits the updated count.

## Server API & Startup Process

### Server Initialization

- The main server is started in `server.js`.
- Express app is created and wrapped with HTTP server for Socket.IO integration.
- Middleware includes CORS, session, passport, cookie parser, and JSON parsing.
- Routes are registered for `/users`, `/chat`, and `/message`.
- The server listens on the port specified by `process.env.PORT` or `8000`.

### Email Sending

- The `/getotp` endpoint triggers an OTP email using Nodemailer and Gmail SMTP.
- The OTP is generated and sent to the provided email address for verification.

### How Everything Works Together

1. **User Authentication:**  
   Users sign up and log in via REST API endpoints. JWT tokens are used for authentication.

2. **Chat & Messaging:**  
   Users can create chats and send messages via REST API. Real-time updates are handled by Socket.IO.

3. **Real-Time Communication:**  
   When a user sends a message, it is broadcast to all users in the chat room via Socket.IO, and also saved to MongoDB.

4. **Presence & Room Management:**  
   Users join chat rooms and receive real-time updates about messages and room user counts.

5. **File Uploads:**  
   User profile images are uploaded to Cloudinary using Multer and the Cloudinary storage engine.

---
