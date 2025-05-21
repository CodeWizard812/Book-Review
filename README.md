# Book Review API

A RESTful API for managing books and reviews, built with Node.js, Express, and PostgreSQL.  
**Features:** JWT authentication, pagination, filtering, search, and review management.

---

<!-- ========== SETUP INSTRUCTIONS ========== -->
## Setup Instructions

1. **Clone the repository:**
  https://github.com/CodeWizard812/Book-Review.git

2. **Install dependencies:**
  npm i

3. **Configure environment variables:**
- Create a `.env` file in the project root:
  ```
  DB_USER=postgres
  DB_HOST=localhost
  DB_NAME=book_review
  DB_PASSWORD=yourpassword
  DB_PORT=5432
  JWT_SECRET=your_jwt_secret_key
  PORT=3000
  ```
- Replace the values as needed.

4. **Set up the database:**
- Run the SQL schema(DatabaseSchema.sql) provided above in your PostgreSQL database.

<!-- ========== RUNNING LOCALLY ========== -->
## Running Locally

npm start
The server will start on `http://localhost:3000`.

---

<!-- ========== EXAMPLE REQUESTS ========== -->
## Example Requests

**1. Signup**
curl -X POST http://localhost:3000/signup
-H "Content-Type: application/json"
-d '{"username":"john_doe","password":"secret123"}'

**2. Login**
curl -X POST http://localhost:3000/login
-H "Content-Type: application/json"
-d '{"username":"john_doe","password":"secret123"}'

**3. Add Book (Authenticated)**
curl -X POST http://localhost:3000/books
-H "Authorization: Bearer YOUR_JWT_TOKEN"
-H "Content-Type: application/json"
-d '{"title":"The Hobbit","author":"J.R.R. Tolkien","genre":"Fantasy"}'

**4. List Books (Paginated & Filtered)**
curl "http://localhost:3000/books?page=1&limit=10&author=John%20Doe&genre=Fiction"


**5. Get Book Details**
curl "http://localhost:3000/books/1"


**6. Add Review (Authenticated)**
curl -X POST http://localhost:3000/books/1/reviews
-H "Authorization: Bearer YOUR_JWT_TOKEN"
-H "Content-Type: application/json"
-d '{"rating":5,"comment":"Masterpiece!"}'

**7. Update Review (Authenticated)**
curl -X PUT http://localhost:3000/reviews/1
-H "Authorization: Bearer YOUR_JWT_TOKEN"
-H "Content-Type: application/json"
-d '{"rating":4,"comment":"Still great!"}'

**8. Delete Review (Authenticated)**
curl -X DELETE http://localhost:3000/reviews/1
-H "Authorization: Bearer YOUR_JWT_TOKEN"

**9. Search Books**
curl "http://localhost:3000/search?q=tolkien"

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Environment Variables:** `.env` for configuration

---

## Features
- User registration and login with JWT
- Add, list, and view books with pagination/filters
- Submit, update, and delete reviews (one per user per book)
- Search books by title/author (case-insensitive, partial match)

---

## API Endpoints
| Endpoint               | Method | Description                          | Auth Required |
|------------------------|--------|--------------------------------------|---------------|
| `/signup`              | POST   | Register a new user                  | No            |
| `/login`               | POST   | Authenticate and get JWT token       | No            |
| `/books`               | POST   | Add a new book                       | Yes           |
| `/books`               | GET    | List books (paginated/filtered)      | No            |
| `/books/:id`           | GET    | Get book details + reviews           | No            |
| `/books/:id/reviews`   | POST   | Submit a review                      | Yes           |
| `/reviews/:id`         | PUT    | Update your review                   | Yes           |
| `/reviews/:id`         | DELETE | Delete your review                   | Yes           |
| `/search`              | GET    | Search books by title/author         | No            |

---

## Database Schema(Code is in DatabaseSchema.sql file)
### Tables
**`users`**
- `id` (Primary Key)
- `username` (Unique)
- `password_hash`
- `created_at`

**`books`**
- `id` (Primary Key)
- `title`
- `author`
- `genre`
- `description`
- `created_by` (Foreign Key to `users.id`)
- `created_at`

**`reviews`**
- `id` (Primary Key)
- `book_id` (Foreign Key to `books.id`)
- `user_id` (Foreign Key to `users.id`)
- `rating` (1-5)
- `comment`
- `created_at`
- **Unique Constraint:** (`book_id`, `user_id`)  


<!-- ========== DESIGN DECISIONS ========== -->
## Design Decisions

- **Authentication:** JWT is used for stateless authentication. Tokens expire in 1 hour.
- **Database:** PostgreSQL is chosen for its reliability and support for complex queries.
- **Routes:** All routes are RESTful and follow assignment specifications.
- **Pagination & Filtering:** Supported for both books and reviews.
- **Reviews:** Users can only submit one review per book. Only the review owner can update or delete.
- **Search:** Case-insensitive, partial match on title or author.
- **Environment Variables:** Sensitive configuration is managed via `.env`.
- **Modular Code:** Controllers, routes, and middleware are separated for maintainability.

---

<!-- ========== END ========== -->

