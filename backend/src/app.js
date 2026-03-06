const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const db = require("./models");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

// Test route
// app.get("/", (req, res) => {
//   res.send("Server is working");
// });

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// app.use((err, req, res, next) => {
//   logger.error(err);

//   res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// });


module.exports = app;
