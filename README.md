## Technologies Used

*   **Frontend**: React (Vite), TypeScript, TailwindCSS
*   **Backend**: Node.js, Express.js
*   **Database**: MySQL (hosted on Aiven)
*   **Authentication**: JSON Web Tokens (JWT)
*   **Deployment**: Netlify (Frontend), Vercel(Backend)

## Project Structure

```
BlogPlatform/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/                 # Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── ...
└── README.md               # Project documentation
```

## Setup & Local Run Instructions

### Prerequisites
- Node.js installed
- MySQL database 

### 1. Database Setup
You need to do **Local MySQL** installation.
1.  Install MySQL Workbench or use a local instance.
2.  Create a new database (e.g., `blog_platform`).
3.  Note your `root` password or create a user.

### 2. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory.
    
    **For Local MySQL:**
    ```env
    PORT=5001
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_local_password
    DB_NAME=blog_platform
    DB_PORT=3306
    DB_SSL=false
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    ```

4.  **Initialize the Database** (Creates tables):
    ```bash
    npm run db:init
    ```
    
5.  **(Optional) Seed the Database** (Populates with test data):
    This script will clear existing data and insert sample users, posts, and comments.
    ```bash
    node scripts/seedDb.js
    ```
6.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5001`.

### 3. Frontend Setup
1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `client` directory (optional if relying on defaults, but recommended):
    ```env
    VITE_API_URL=http://localhost:5001
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:5173`.

## Back-end API Structure

### Base URL
`/` pointing to the backend host.

### Endpoints

#### Authentication
- `POST /auth/register`: Register a new user. (Public)
- `POST /auth/login`: Login and receive a token. (Public)
- `GET /auth/me`: Get current user profile. (Private)

#### Posts
- `GET /posts`: Get all posts. (Public)
- `GET /posts/:id`: Get a specific post by ID. (Public)
- `POST /posts`: Create a new post. (Private)
- `PUT /posts/:id`: Update a post. (Private)
- `DELETE /posts/:id`: Delete a post. (Private)

#### Comments
- `GET /posts/:id/comments`: Get comments for a post. (Public)
- `POST /posts/:id/comments`: Add a comment to a post. (Private)
- `PUT /comments/:id`: Update a comment. (Private)
- `DELETE /comments/:id`: Delete a comment. (Private)

#### Users
- `GET /users/:id`: Get user profile by ID. (Public)
- `PUT /users/:id`: Update user profile (Name, Bio). (Private)
- `POST /users/:id/photo`: Upload profile picture. (Private)

### How to Interact with the API

You can interact with the API using tools like **Postman**, **Insomnia**, or **cURL**, or via the Client application.

**Authentication Header:**
For `Private` routes, you must include a valid JWT token in the request header.
1.  Register/Login to get a `token`.
2.  Add the header: `x-auth-token: <your_token>`

**Example Request (Get Current User):**
```bash
curl -H "x-auth-token: your_token_here" http://localhost:5001/auth/me
```


## Design Decisions & Assumptions
-   **Image Uploads (Production Limitation)**: Images are stored locally in the `uploads` directory. **In the production environment, image uploads will not persist (due to Vercel filesystems are read-only or ephemeral)** because I did not facilitate a Cloud Object Storage (like AWS S3) due to time limitations during this project's deadline. The feature works perfectly in the local environment. 

