const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const user = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
app.use(express.json());
const Order = require("./routes/order");
app.use(
  cors({
    origin: [
      "https://bookcove-book-store.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
const { Server } = require("socket.io");
const http = require("http");

//routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend (React app) to connect
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log(" New user connected:", socket.id);
  socket.emit("botMessage", "Welcome! How can I help you?");
  socket.on("userMessage", (msg) => {
    console.log("user", msg);

    const lower = msg.toLowerCase();
    let reply = "Sorry, I didn't understand that.";

    if (lower.includes("genre")) {
      reply = "We offer fiction, non-fiction, mystery, fantasy, and more!";
    } else if (lower.includes("buy")) {
      reply = "Just click 'Buy Now' on any book's page to purchase.";
    } else if (lower.includes("audio")) {
      reply = "Yes, we have many audiobooks available!";
    }
    socket.emit("botMessage", reply);
  });
});

io.on("disconnect", () => {
  console.log("user disconnected");
});

//creating port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
