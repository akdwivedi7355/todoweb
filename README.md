# TodoWeb Project

## Project Overview

TodoWeb is a full-stack task management application that enables users to create, update, and manage their to-do lists efficiently. The backend is built with Node.js and Express, using MSSQL as the database, while the frontend is powered by React (TypeScript) with Tailwind CSS.

## Features

- User Authentication (Login, JWT-based authentication)
- Task Management (Add, Update, Delete, Retrieve tasks)
- Role-based access control
- API documentation using Swagger
- Secure password handling with bcrypt
- MSSQL database integration

## Directory Structure

```
└── akdwivedi7355-todoweb/
    ├── README.md
    ├── LICENSE
    ├── Backend/
    │   ├── index.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── .env
    │   ├── dist/
    │   │   └── bundle.js
    │   └── src/
    │       ├── messages.js
    │       ├── server.js
    │       ├── swagger-output.json
    │       ├── swagger.js
    │       ├── config/
    │       │   └── database.js
    │       ├── controllers/
    │       │   ├── authController.js
    │       │   ├── todoController.js
    │       │   └── userController.js
    │       ├── middleware/
    │       │   └── auth.js
    │       └── routes/
    │           ├── authRoutes.js
    │           ├── todosRoutes.js
    │           └── userRoutes.js
    ├── database_schema/
    │   └── schema.txt
    └── frontend/
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        └── src/
            ├── App.tsx
            ├── index.css
            ├── main.tsx
            ├── vite-env.d.ts
            ├── components/
            │   ├── LoginForm.tsx
            │   └── TodoList.tsx
            ├── services/
            │   └── api.ts
            ├── store/
            │   └── authStore.ts
            └── types/
                └── index.ts
```

## Backend Setup

### Prerequisites

- Node.js installed
- MSSQL Server running

### Install dependencies

```sh
cd Backend
npm install
```

### Environment Variables
`Backend` directory with the following variables:

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SERVER=your_db_server
JWT_SECRET=your_secret_key
```

### Run the server

```sh
npm start
```

## Database Setup

The MSSQL database is used for storing user credentials and tasks. Ensure the stored procedure `sp_ManageLogin` is correctly implemented.

Example stored procedure for login:

```sql
CREATE PROCEDURE sp_ManageLogin
  @Email NVARCHAR(100),
  @Password NVARCHAR(MAX)
AS
BEGIN
  SELECT UserID, Username FROM Users WHERE Email = @Email AND Password = @Password;
END
```

## Frontend Setup

### Install dependencies

```sh
cd frontend
npm install
```

### Run the frontend

```sh
npm run dev
```

## Authentication Flow

1. User logs in using email and password.
2. The backend verifies credentials and returns a JWT token.
3. Frontend stores the token and includes it in API requests.

## API Endpoints

### Auth Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Todo Routes

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Future Enhancements

- Implement password hashing in MSSQL
- Improve error handling
- Add unit tests




