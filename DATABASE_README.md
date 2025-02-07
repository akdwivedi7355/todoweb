# SCMTrial Database Schema

## Overview
SCMTrial is a database designed for managing users and their associated to-do lists. It includes user authentication, role-based access control, and stored procedures for managing users and to-do items.

---

## Database Creation
```sql
CREATE DATABASE scmtrial;
GO

USE [scmtrial]
GO
```

---

## Tables

### Users Table
```sql
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userRole VARCHAR(50) NOT NULL CHECK (userRole IN ('admin', 'user')),
    createdAt DATETIME DEFAULT GETDATE()
);
```

### Todos Table
```sql
CREATE TABLE Todos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    completed BIT DEFAULT 0,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id)
);
```

---

## Stored Procedures

### User Management - `sp_ManageUsers`
```sql
CREATE PROCEDURE [dbo].[sp_ManageUsers]
    @TypeControl INT,
    @UserID INT = NULL,
    @Name VARCHAR(255) = NULL,
    @Email VARCHAR(255) = NULL,
    @Password VARCHAR(255) = NULL,
    @UserRole VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @IsSuccess BIT = 0;
    DECLARE @Message NVARCHAR(500) = 'Operation Failed.';

    IF @TypeControl = 1  -- Insert User
    BEGIN
        INSERT INTO Users (name, email, password, userRole, createdAt)
        VALUES (@Name, @Email, @Password, @UserRole, GETDATE());
        SET @IsSuccess = 1;
        SET @Message = 'User added successfully.';
    END

    ELSE IF @TypeControl = 2  -- Update User
    BEGIN
        UPDATE Users
        SET name = ISNULL(@Name, name),
            email = ISNULL(@Email, email),
            password = ISNULL(@Password, password),
            userRole = ISNULL(@UserRole, userRole)
        WHERE id = @UserID;
        SET @IsSuccess = 1;
        SET @Message = 'User updated successfully.';
    END

    ELSE IF @TypeControl = 4  -- Delete User
    BEGIN
        DELETE FROM Users WHERE id = @UserID;
        SET @IsSuccess = 1;
        SET @Message = 'User deleted successfully.';
    END

    SELECT @IsSuccess AS IsSuccess, @Message AS Message;
END;
```

### To-Do Management - `sp_ManageTodos`
```sql
CREATE PROCEDURE [dbo].[sp_ManageTodos]
    @TypeControl INT,
    @TodoID INT = NULL,
    @Title VARCHAR(255) = NULL,
    @Description VARCHAR(MAX) = NULL,
    @Completed BIT = NULL,
    @UserID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @IsSuccess BIT = 0;
    DECLARE @Message NVARCHAR(500) = 'Operation Failed.';

    IF @TypeControl = 1  -- Insert Todo
    BEGIN
        INSERT INTO Todos (title, description, completed, userId, createdAt, updatedAt)
        VALUES (@Title, @Description, ISNULL(@Completed, 0), @UserID, GETDATE(), GETDATE());
        SET @IsSuccess = 1;
        SET @Message = 'Todo added successfully.';
    END

    ELSE IF @TypeControl = 2  -- Update Todo
    BEGIN
        UPDATE Todos
        SET title = ISNULL(@Title, title),
            description = ISNULL(@Description, description),
            completed = ISNULL(@Completed, completed),
            updatedAt = GETDATE()
        WHERE id = @TodoID;
        SET @IsSuccess = 1;
        SET @Message = 'Todo updated successfully.';
    END

    ELSE IF @TypeControl = 4  -- Delete Todo
    BEGIN
        DELETE FROM Todos WHERE id = @TodoID;
        SET @IsSuccess = 1;
        SET @Message = 'Todo deleted successfully.';
    END

    SELECT @IsSuccess AS IsSuccess, @Message AS Message;
END;
```

### User Login - `sp_ManageLogin`
```sql
ALTER PROCEDURE [dbo].[sp_ManageLogin]
    @Email VARCHAR(255),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @IsSuccess BIT = 0;
    DECLARE @Message NVARCHAR(500) = 'Invalid credentials.';
    DECLARE @UserID INT;
    DECLARE @Name VARCHAR(255);
    DECLARE @UserRole VARCHAR(50);
    DECLARE @CreatedAt DATETIME;

    SELECT
        @UserID = id,
        @Name = name,
        @UserRole = userRole,
        @CreatedAt = createdAt
    FROM Users
    WHERE email = @Email AND password = @Password;

    IF @UserID IS NOT NULL
    BEGIN
        SET @IsSuccess = 1;
        SET @Message = 'Login successful.';
        
        SELECT
            @UserID AS UserID,
            @Name AS Name,
            @Email AS Email,
            @UserRole AS UserRole,
            @CreatedAt AS CreatedAt;
    END
    
    SELECT @IsSuccess AS IsSuccess, @Message AS Message;
END;
```

---

## Security Considerations
- **Parameter Validation:** Prevent SQL injection by sanitizing inputs.
- **Error Handling:** Use `TRY...CATCH` blocks for improved debugging.

---

## Usage
To execute procedures, for admin:
```sql
EXEC sp_ManageUsers @TypeControl = 1, @Name = 'Aditya', @Email = 'Adi@gmail.com', @Password = '123', @UserRole = 'admin';
```

---


