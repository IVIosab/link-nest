# [LinkNest](https://github.com/IVIosab/link-nest) 
A fast and feature-rich URL shortener API built with Express and SQLite. It enables users to:

## Tech Stack

| Package               | Purpose                                 |
|-----------------------|-----------------------------------------|
| `express`             | Web framework                           |
| `drizzle-orm`, `sqlite` | Database & ORM                        |
| `zod`                 | Input validation                        |
| `nanoid`              | Random, unique ID generation for slugs  |
| `geoip-lite`          | IP geolocation for visits               |
| `express-rate-limit`  | Prevent abuse with rate limiting        |
| `bcrypt`              | Password hashing                        |
| `morgan`              | HTTP request logging                    |

## Features

- Create a short URL for any long URL  
- Redirect to the original URL on slug visit  
- Track visit count (with metadata like country, referrer, etc.)  
- Set expiration dates for links  
- Password-protect your shortened links  
- Use custom slugs for vanity URLs  

## Middlewares

- **Logger**: Logs HTTP requests using `morgan`
- **Validation**: Validates body/params using `zod`
- **Rate Limiting**: Throttle API usage to prevent spam
- **Link Expiry Check**: Returns `410 Gone` if a link is expired
- **Auth Middleware**: Verifies JWT for protected endpoints

---

## API Endpoints

### `POST /shorten`

**Create a new short URL**

**Middleware Stack**:
- `authenticateJWT` – JWT auth for user-specific links
- `shortenLimiter` – Rate limiting middleware to prevent abuse
- `validate({ body: createLinkSchema })` – Validates input body using Zod
- `createShortLink` – Controller logic for storing and returning short URL

**Request Body**:
```json
{
  "original_url": "https://example.com",
  "custom_slug": "my-custom-slug",         // optional
  "expires_at": "2025-12-31T23:59:59Z",    // optional (ISO 8601)
  "password": "optionalPassword123"        // optional
}
```

**Responses**:
- `201 Created` – Link successfully shortened
- `400 Bad Request` – Validation failed
- `409 Conflict` – Custom slug already exists

Here is the continuation in pure Markdown, ready to copy-paste directly into your `.md` file — I replaced the JSON block with an indented code block to avoid fenced code blocks as you requested:

---

### `GET /:slug`

**Redirect to the original URL using a short slug**

**Middleware Stack**:

* `validate({ params: slugParamSchema })` – Validates the URL slug
* `checkExpiry` – Checks if the link is expired
* `handleRedirect` – Performs password verification, visit logging, and redirection

**Query Parameters (optional)**:

* `password`: Required if the link is password-protected

**Responses**:

* `302 Found` – Redirects to the original URL
* `403 Forbidden` – Incorrect or missing password
* `410 Gone` – Link has expired
* `404 Not Found` – Slug not found

---

### `POST /register`

**Register a new user**

**Middleware Stack**:

* `authLimiter` – Rate limiter to prevent spam
* `handleRegister` – Validates and registers the user

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "securePassword"
}
```

**Responses**:

* `201 Created` – User registered successfully
* `400 Bad Request` – Invalid input
* `409 Conflict` – Email already exists

---

### `POST /login`

**Authenticate a user and return a JWT token**

**Middleware Stack**:

* `authLimiter` – Rate limiter to prevent brute-force attacks
* `handleLogin` – Validates credentials and issues JWT

**Request Body**:
```json
{
    "email": "[user@example.com](mailto:user@example.com)",
    "password": "securePassword"
}
```

**Responses**:

* `200 OK` – Authentication successful, returns JWT token
* `401 Unauthorized` – Invalid email or password

**Response Example**:
```json
{
    "token": "your.jwt.token.here"
}
```

## Installation 
### 1. Clone the Repository
```bash
git clone https://github.com/IVIosab/link-nest.git
cd link-nest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Prepare Database
```bash
npx drizzle-kit push
```

### 4. Run 
```bash
npm run dev #if you want to run it with nodemon
npm start
```


## Code
Project Link: [https://github.com/IVIosab/link-nest](https://github.com/IVIosab/link-nest)