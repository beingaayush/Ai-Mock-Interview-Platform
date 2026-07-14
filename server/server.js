require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db")
const interviewRoutes = require("./src/routes/interviewRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// CORS updated to accept requests from your Vercel frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", 
    credentials: true
}));

app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Dynamic Port for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log("server running on port 5000");
});