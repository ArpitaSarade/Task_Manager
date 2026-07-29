import express from "express";

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Task Manager Backend is Running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});