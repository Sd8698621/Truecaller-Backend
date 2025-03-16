# Truecaller Backend

This is a backend service built using **Node.js** and **Express.js**, with **MySQL** as the database. It provides features similar to Truecaller, such as user registration, login, OTP verification, phone number search, spam marking, blocking numbers, and user management.

## Features

- User Signup and Login with JWT Authentication
- OTP Verification
- Search User by Phone Number
- Mark Numbers as Spam
- Fetch Spam Numbers List
- Block Numbers
- Fetch Blocked Numbers List
- Update User Profile
- Delete User

## Tech Stack

- **Node.js** (Backend)
- **Express.js** (Framework)
- **MySQL** (Database)
- **bcryptjs** (Password Hashing)
- **jsonwebtoken** (JWT Authentication)
- **dotenv** (Environment Variables)
- **cors** (Cross-Origin Resource Sharing)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/truecaller-backend.git
   cd truecaller-backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a **.env** file in the root directory and configure it:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   PORT=3000
   HOST=0.0.0.0
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### 1. **User Signup**
   - **POST** `/signup`
   - Request Body:
     ```json
     {
       "name": "John Doe",
       "email": "johndoe@example.com",
       "phone": "1234567890",
       "password": "password123"
     }
     ```
   - Response:
     ```json
     { "message": "User registered successfully" }
     ```

### 2. **User Login**
   - **POST** `/login`
   - Request Body:
     ```json
     {
       "phone": "1234567890",
       "password": "password123"
     }
     ```
   - Response:
     ```json
     { "message": "Login successful", "token": "jwt_token_here" }
     ```

### 3. **Verify OTP**
   - **POST** `/verify-otp`
   - Request Body:
     ```json
     {
       "phone": "1234567890",
       "otp": "123456"
     }
     ```
   - Response:
     ```json
     { "message": "OTP verified successfully" }
     ```

### 4. **Search User by Phone**
   - **GET** `/search?phone=1234567890`
   - Response:
     ```json
     {
       "name": "John Doe",
       "phone": "1234567890",
       "email": "johndoe@example.com"
     }
     ```

### 5. **Mark Number as Spam**
   - **POST** `/mark-spam`
   - Request Body:
     ```json
     {
       "phone": "1234567890"
     }
     ```
   - Response:
     ```json
     { "message": "Number marked as spam" }
     ```

### 6. **Fetch Spam Numbers**
   - **GET** `/spam-list`
   - Response:
     ```json
     [
       { "phone": "1234567890", "spam_count": 5 }
     ]
     ```

### 7. **Block a Number**
   - **POST** `/block-number`
   - Request Body:
     ```json
     {
       "user_id": 1,
       "phone": "1234567890"
     }
     ```
   - Response:
     ```json
     { "message": "Number blocked successfully" }
     ```

### 8. **Fetch Blocked Numbers**
   - **GET** `/blocked-list?user_id=1`
   - Response:
     ```json
     [
       { "phone": "1234567890" }
     ]
     ```

### 9. **Update User Profile**
   - **PUT** `/update-profile`
   - Request Body:
     ```json
     {
       "id": 1,
       "name": "John Doe Updated",
       "email": "johnupdated@example.com"
     }
     ```
   - Response:
     ```json
     { "message": "Profile updated successfully" }
     ```

### 10. **Delete User**
   - **DELETE** `/delete-user`
   - Request Body:
     ```json
     {
       "phone": "1234567890"
     }
     ```
   - Response:
     ```json
     { "message": "User deleted successfully" }
     ```

## License

This project is open-source and free to use.

## Author

[Your Name] - [Your Contact Info]

