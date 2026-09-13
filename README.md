# Career & Study Progress Tracker (Phase 1)

This is a personal web-based tracker for mapping study and career progress (Government, GATE, TCS NQT, Placement) from October 2026 to July 2029.

## Features
- Username-only simplified authentication (persistent sessions via localStorage)
- Dashboard showing overall progress for Government, GATE, TCS NQT, and Placement
- Task list with the ability to mark tasks as completed
- Persistent state using MongoDB Atlas

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)

## Prerequisites
- Node.js installed
- MongoDB Atlas cluster and connection string

## Installation and Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Open the `.env` file in the root directory.
   - Replace `YOUR_MONGODB_CONNECTION_STRING` with your actual MongoDB Atlas connection string.
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/carrier-tracker?retryWrites=true&w=majority
   PORT=5000
   ```

3. **Start the Server**
   ```bash
   npm start
   # or node server/server.js
   ```

4. **Seed the Database** (Optional but recommended for testing)
   Run the following script to insert 5 sample tasks for a specified username (defaults to "sagnik").
   ```bash
   node server/seed/seed.js [username]
   ```
   *Note: Ensure your `.env` is configured correctly before running the seed script.*

## Testing the Application

1. Open a web browser and go to `http://localhost:5000`.
2. Enter your username (e.g., `sagnik` if you seeded with the default).
3. You should see the dashboard with your trackers and tasks.
4. Check a task to mark it as completed. Watch the progress percentages update automatically.
5. Refresh the page to verify that the state persists.
6. Click "Logout" and log back in with the same username to verify data retrieval.
