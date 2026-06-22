const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);

app.listen(5000, () =>{
    console.log("server running on port 5000");
});