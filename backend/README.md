# iBlog Backend API Documentation

RESTful API backend for the **iBlog** blogging platform built with Express, Prisma, and PostgreSQL.

---

## Table of Contents

- [Overview & Base URL](#overview--base-url)
- [Authentication](#authentication)
- [Route Overview](#route-overview)
- [API Endpoints](#api-endpoints)
  - [General](#general)
  - [Authentication (`/auth`)](#authentication-auth)
  - [Posts (`/posts`)](#posts-posts)
  - [Comments (`/posts/:postId/comments`)](#comments-postspostidcomments)
  - [Users (`/users`)](#users-users)
- [Standard Error Responses](#standard-error-responses)

---

## Overview & Base URL

- **Base URL**: `http://localhost:3000` (or `http://localhost:<PORT>` specified in `.env`)
- **Default Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (for protected routes)

---

## Authentication

Protected routes require a JSON Web Token (JWT) sent via the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for **7 days** from issue and contain the payload `{ user: { id, username } }`.

---

## Route Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health / welcome endpoint |
| `POST` | `/auth/signup` | Public | Register a new user account & get JWT token |
| `POST` | `/auth/login` | Public | Log in with credentials & get JWT token |
| `GET` | `/posts` | Public | List all published posts |
| `POST` | `/posts` | Bearer Token | Create a new post |
| `GET` | `/posts/:id` | Public | Get post details and its comments |
| `PUT` | `/posts/:id` | Bearer Token (Author) | Update an existing post |
| `DELETE` | `/posts/:id` | Bearer Token (Author) | Delete a post and its comments |
| `POST` | `/posts/:postId/comments` | Bearer Token | Add a comment to a post |
| `PUT` | `/posts/:postId/comments/:commentId` | Bearer Token (Author) | Update an existing comment |
| `DELETE` | `/posts/:postId/comments/:commentId` | Bearer Token (Author) | Delete a comment |
| `GET` | `/users/:id` | Bearer Token | Get user profile info |
| `PUT` | `/users/:id` | Bearer Token (Self) | Update user profile info (`name`, `email`) |
| `GET` | `/users/:id/posts` | Bearer Token | Get published posts (or drafts if user is self) |

---

## API Endpoints

### General

#### `GET /`
Basic root check endpoint.

- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "message": "This is home"
  }
  ```

---

### Authentication (`/auth`)

#### `POST /auth/signup`
Creates a new user account and returns an authentication token.

- **Access**: Public
- **Request Body** (`application/json`):
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `username` | String | Yes | Alphanumeric characters and underscores only. Must be unique. |
  | `password` | String | Yes | User password. |
  | `confirmPassword` | String | Yes | Must match `password`. |

- **Success Response (201 Created)**:
  ```json
  {
    "message": "Signup successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure (missing fields, username exists, mismatched passwords).
    ```json
    {
      "errors": [
        {
          "type": "field",
          "value": "alice",
          "msg": "Username already exists",
          "path": "username",
          "location": "body"
        }
      ]
    }
    ```

#### `POST /auth/login`
Authenticates existing credentials and returns an authentication token.

- **Access**: Public
- **Request Body** (`application/json`):
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `username` | String | Yes | Account username. |
  | `password` | String | Yes | Account password. |

- **Success Response (200 OK)**:
  ```json
  {
    "message": "Login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing username or password.
  - `401 Unauthorized`: Invalid credentials.
    ```json
    {
      "error": "Incorrect username or password."
    }
    ```

> **Note on Logout**: The backend is stateless with JWT. Logging out is handled on the client by deleting the stored token.

---

### Posts (`/posts`)

#### `GET /posts`
Retrieves a list of all published posts ordered by `updatedAt` descending.

- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Get all posts",
    "posts": [
      {
        "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
        "title": "My First Blog Post",
        "updatedAt": "2026-10-18T00:00:00.000Z",
        "author": {
          "id": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
          "username": "author_username"
        }
      }
    ]
  }
  ```

#### `POST /posts`
Creates a new post authored by the authenticated user.

- **Access**: Private (Bearer Token)
- **Request Body** (`application/json`):
  | Field | Type | Required | Default | Description |
  |---|---|---|---|---|
  | `title` | String | Yes | - | Post title (non-empty). |
  | `content` | String | No | `null` | Post body content. |
  | `published` | Boolean / String | No | `false` | Post publish status (`true` or `false`). |

- **Success Response (201 Created)**:
  ```json
  {
    "message": "Created new post successfully",
    "post": {
      "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "title": "My First Blog Post",
      "content": "Post content here...",
      "published": false,
      "authorId": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "createdAt": "2026-10-18T00:00:00.000Z",
      "updatedAt": "2026-10-18T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing or empty title.
  - `401 Unauthorized`: Token missing or invalid.

#### `GET /posts/:id`
Retrieves details of a specific post by ID, including its author info and list of comments (with comment authors, ordered newest first).

- **Access**: Public
- **Path Parameters**:
  - `id` (String, required): UUID of the post.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Get post details",
    "post": {
      "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "title": "My First Blog Post",
      "content": "Post content here...",
      "published": true,
      "authorId": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "createdAt": "2026-10-18T00:00:00.000Z",
      "updatedAt": "2026-10-18T00:00:00.000Z",
      "author": {
        "id": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
        "username": "author_username"
      },
      "comments": [
        {
          "id": "893c834a-9b16-419b-a320-b30f81d596ee",
          "content": "Great article!",
          "updatedAt": "2026-10-18T00:05:00.000Z",
          "author": {
            "id": "5fa2b87c-17e9-4e4f-bbf4-0268a7604a11",
            "username": "commenter_user"
          }
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Post ID not found (`{ "error": "Endpoint not found" }`).

#### `PUT /posts/:id`
Updates an existing post. Only the author of the post can perform this action.

- **Access**: Private (Bearer Token, Post Author only)
- **Path Parameters**:
  - `id` (String, required): UUID of the post.
- **Request Body** (`application/json`):
  | Field | Type | Required | Default | Description |
  |---|---|---|---|---|
  | `title` | String | Yes | - | Post title (non-empty). |
  | `content` | String | No | `null` | Updated post body content. |
  | `published` | Boolean / String | No | `false` | Post publish status. |

- **Success Response (200 OK)**:
  ```json
  {
    "message": "Updated post successfully",
    "post": {
      "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "title": "Updated Title",
      "content": "Updated content...",
      "published": true,
      "authorId": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "createdAt": "2026-10-18T00:00:00.000Z",
      "updatedAt": "2026-10-18T00:10:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Empty title or validation errors.
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user is not the author (`{ "error": "User is not the post author" }`).
  - `404 Not Found`: Post ID does not exist.

#### `DELETE /posts/:id`
Deletes a post and cascades to delete all associated comments. Only the author of the post can perform this action.

- **Access**: Private (Bearer Token, Post Author only)
- **Path Parameters**:
  - `id` (String, required): UUID of the post.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Deleted post successfully",
    "post": {
      "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "title": "My First Blog Post",
      "content": "...",
      "published": true,
      "authorId": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "createdAt": "2026-10-18T00:00:00.000Z",
      "updatedAt": "2026-10-18T00:10:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user is not the author (`{ "error": "User is not the post author" }`).
  - `404 Not Found`: Post ID does not exist.

---

### Comments (`/posts/:postId/comments`)

#### `POST /posts/:postId/comments`
Creates a new comment on a specific post.

- **Access**: Private (Bearer Token)
- **Path Parameters**:
  - `postId` (String, required): UUID of the target post.
- **Request Body** (`application/json`):
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `content` | String | Yes | Comment text (non-empty). |

- **Success Response (201 Created)**:
  ```json
  {
    "message": "Create new comment successfully",
    "comment": {
      "id": "893c834a-9b16-419b-a320-b30f81d596ee",
      "content": "Great article!",
      "postId": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "authorId": "5fa2b87c-17e9-4e4f-bbf4-0268a7604a11",
      "createdAt": "2026-10-18T00:05:00.000Z",
      "updatedAt": "2026-10-18T00:05:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Empty content.
  - `401 Unauthorized`: Token missing or invalid.
  - `404 Not Found`: Target post does not exist.

#### `PUT /posts/:postId/comments/:commentId`
Updates an existing comment. Only the comment author can update it.

- **Access**: Private (Bearer Token, Comment Author only)
- **Path Parameters**:
  - `postId` (String, required): UUID of the post.
  - `commentId` (String, required): UUID of the comment.
- **Request Body** (`application/json`):
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `content` | String | Yes | Updated comment text (non-empty). |

- **Success Response (200 OK)**:
  ```json
  {
    "message": "Update comment successfully",
    "comment": {
      "id": "893c834a-9b16-419b-a320-b30f81d596ee",
      "content": "Updated comment content",
      "postId": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "authorId": "5fa2b87c-17e9-4e4f-bbf4-0268a7604a11",
      "createdAt": "2026-10-18T00:05:00.000Z",
      "updatedAt": "2026-10-18T00:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Empty content.
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user is not the comment author (`{ "error": "User is not the comment author" }`).
  - `404 Not Found`: Post or comment not found.

#### `DELETE /posts/:postId/comments/:commentId`
Deletes an existing comment. Only the comment author can delete it.

- **Access**: Private (Bearer Token, Comment Author only)
- **Path Parameters**:
  - `postId` (String, required): UUID of the post.
  - `commentId` (String, required): UUID of the comment.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Delete comment successfully",
    "comment": {
      "id": "893c834a-9b16-419b-a320-b30f81d596ee",
      "content": "...",
      "postId": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
      "authorId": "5fa2b87c-17e9-4e4f-bbf4-0268a7604a11",
      "createdAt": "2026-10-18T00:05:00.000Z",
      "updatedAt": "2026-10-18T00:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user is not the comment author (`{ "error": "User is not the comment author" }`).
  - `404 Not Found`: Post or comment not found.

---

### Users (`/users`)

#### `GET /users/:id`
Retrieves public profile information for a user by their ID. Password is never exposed.

- **Access**: Private (Bearer Token)
- **Path Parameters**:
  - `id` (String, required): UUID of the user.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Get user details",
    "user": {
      "id": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "username": "johndoe",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing or invalid.
  - `404 Not Found`: User ID not found.

#### `PUT /users/:id`
Updates user profile information (`name`, `email`). Users can only update their own profile.

- **Access**: Private (Bearer Token, User Self only)
- **Path Parameters**:
  - `id` (String, required): UUID of the user.
- **Request Body** (`application/json`):
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `name` | String | No | Display name (non-empty string if provided). |
  | `email` | String | No | Valid email address. |

- **Success Response (200 OK)**:
  ```json
  {
    "message": "Update user information successfully",
    "user": {
      "id": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
      "username": "johndoe",
      "name": "John Updated",
      "email": "john.updated@example.com"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid email format or empty name.
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user is attempting to update another user's profile (`{ "error": "User is not authorized to update this profile" }`).
  - `404 Not Found`: User ID not found.

#### `GET /users/:id/posts`
Retrieves posts created by a specific user.

- **Access**: Private (Bearer Token)
- **Path Parameters**:
  - `id` (String, required): UUID of the author.
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  |---|---|---|---|---|
  | `published` | String (`"true"` \| `"false"`) | No | `"true"` | When `"false"`, returns draft / unpublished posts. Viewing unpublished posts requires the requester to be the author (`id === token user ID`). |

- **Success Response (200 OK)**:
  ```json
  {
    "message": "Get user posts successfully",
    "posts": [
      {
        "id": "c1f7a0b3-d23e-4509-90bc-6d048ba81234",
        "title": "Post Title",
        "content": "Post content...",
        "published": true,
        "authorId": "e4a2c5a0-8a0a-4a2a-b4a1-029472648102",
        "createdAt": "2026-10-18T00:00:00.000Z",
        "updatedAt": "2026-10-18T00:00:00.000Z"
      }
    ]
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Authenticated user tried to view unpublished posts of another user (`{ "error": "User is not authorized" }`).
  - `404 Not Found`: User ID not found.

---

## Standard Error Responses

| Status Code | Description | Example Response |
|---|---|---|
| `400 Bad Request` | Missing required input or validation failed | `{"errors": [{"msg": "Title must not be empty", "path": "title"}]}` |
| `401 Unauthorized` | Missing / invalid Bearer token or wrong credentials | `{"message": "Authentication token required"}` or `{"error": "Incorrect username or password."}` |
| `403 Forbidden` | Authenticated user lacks permission to modify or access the resource | `{"error": "User is not the post author"}` |
| `404 Not Found` | Route or requested entity was not found | `{"error": "Endpoint not found"}` |
| `500 Internal Server Error` | Unexpected server failure | `{"error": "Internal Server Error"}` |
