Description
This project provides a simple user authentication system using JSON Web Tokens (JWT) and CORS (Cross-Origin Resource Sharing) for a full-stack web application. The backend is built with Express.js, handling user signups, logins, and access to protected resources (like a dashboard and map data). The frontend allows users to sign up, log in, and navigate to protected routes only when authenticated.

Key Features
Signup & Login: Allows users to sign up and log in using their username and password.

JWT Authentication: Uses JWT for user authentication and session management.

CORS Configuration: Configures CORS to restrict access only from a specific frontend URL (https://mapintegrationmanoj.netlify.app).

Protected Routes: Dashboard and map data are accessible only after authentication.

In-Memory User Storage: Users are stored temporarily in memory for demonstration purposes (replace with a database for production).

Tech Stack
Backend: Node.js, Express.js

Authentication: JWT (JSON Web Token)

Password Hashing: bcryptjs

CORS: Cross-Origin Resource Sharing for API access

Body Parsing: express.json() for parsing incoming JSON requests

API Endpoints
1. POST /api/signup
Description: Registers a new user.

Request Body:

json
Copy
Edit
{
  "username": "string",
  "password": "string"
}
Response:

Success: {"message": "User registered successfully"}

Failure: {"message": "User already exists"} or {"message": "Username and password are required"}

2. POST /api/login
Description: Authenticates a user and returns a JWT token.

Request Body:

json
Copy
Edit
{
  "username": "string",
  "password": "string"
}
Response:

Success: {"token": "JWT_TOKEN"}

Failure: {"message": "Invalid credentials"}

3. GET /api/dashboard
Description: A protected route that fetches dashboard data.

Headers:

Authorization: Bearer JWT_TOKEN

Response:

json
Copy
Edit
{
  "cards": [
    { "id": 1, "title": "Card 1" },
    { "id": 2, "title": "Card 2" }
  ]
}
4. GET /api/map
Description: A protected route that returns map data.

Headers:

Authorization: Bearer JWT_TOKEN

Response:

json
Copy
Edit
{
  "center": [20.5937, 78.9629],
  "zoom": 5
}
CORS Configuration
CORS is configured to allow only the frontend hosted at https://mapintegrationmanoj.netlify.app to interact with the API.

Only the HTTP methods GET and POST are allowed.

Allowed headers: Content-Type, Authorization.

Getting Started
Prerequisites
Node.js and npm (Node Package Manager) should be installed.

Installing and Running the Application
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/your-project.git
cd your-project
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node server.js
The server will be running on http://localhost:5000.

Testing the Application
Use Postman or a similar tool to test the API endpoints by sending HTTP requests.

Make sure to include the JWT token in the Authorization header for protected routes.

Frontend Integration
The frontend can be developed using any JavaScript framework like React.js. The API endpoints for signup and login can be integrated as follows:

javascript
Copy
Edit
axios.post('https://syncthreadsassignment-1.onrender.com/api/signup', {
  username: 'your-username',
  password: 'your-password'
});
Make sure to store the JWT token in localStorage or sessionStorage after login for future use when making requests to protected routes.

Notes
In-Memory Storage: User data is stored temporarily in memory, which means it will be lost when the server restarts. Replace the in-memory storage with a database (e.g., MongoDB or PostgreSQL) for production use.

Security: Always use a strong SECRET_KEY in production and consider using environment variables for sensitive data.

License
This project is licensed under the MIT License - see the LICENSE file for details.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
