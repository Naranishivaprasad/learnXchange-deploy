require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

const connectDB = require("./config/user")
connectDB()

app.use(express.json())
app.use(express.static("uploads"))

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const authrouter = require("./routes/authrouter")
const userrouter = require("./routes/userrouter")
const postrouter = require("./routes/postrouter")
const jobrouter = require("./routes/jobrouter")
const blogrouter = require("./routes/blogrouter")
const adminrouter = require("./routes/adminrouter")

app.get("/", (req, res) => {
  res.json("this is the default endpoint")
})

app.use("/api/auth", authrouter)
app.use("/api/user", userrouter)
app.use("/api/post", postrouter)
app.use("/api/job", jobrouter)
app.use("/api/blog", blogrouter)
app.use("/api/admin", adminrouter)

app.listen(process.env.PORT, () => {
  console.log("server started on port " + process.env.PORT)
})