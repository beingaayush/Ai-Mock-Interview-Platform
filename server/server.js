require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db")
const interviewRoutes = require("./src/routes/interviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


app.use("/api/interview", interviewRoutes);

app.listen(5000, () =>{
    console.log("server running on port 5000");
});