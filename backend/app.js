const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const user = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Analytics = require("./routes/analytics");
const Sepay = require("./routes/sepay");

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://bookcove-book-store.netlify.app",
      "http://localhost:5173",
      "https://doanudtmdt-bcci.onrender.com",
      "https://cf0380bdfc45ce.lhr.life",
    ],
    credentials: true,
  })
);

// routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Sepay);
app.use("/api/v1/analytics", Analytics);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(" New user connected:", socket.id);
  socket.emit("botMessage", "Chào bạn! Mình có thể giúp gì cho bạn?");
  socket.on("userMessage", (msg) => {
    console.log("user", msg);

    const lower = msg.toLowerCase();
    let reply = "Xin lỗi, mình chưa hiểu ý bạn.";

    if (lower.includes("genre") || lower.includes("thể loại")) {
      reply = "Bên mình có nhiều thể loại: tiểu thuyết, phi hư cấu, trinh thám, giả tưởng và nhiều hơn nữa!";
    } else if (lower.includes("buy") || lower.includes("mua")) {
      reply = "Bạn có thể bấm 'Thêm vào giỏ' ở trang chi tiết sách để mua.";
    } else if (lower.includes("audio") || lower.includes("audiobook") || lower.includes("sách nói")) {
      reply = "Bên mình cũng có nhiều sách nói để bạn lựa chọn!";
    }
    socket.emit("botMessage", reply);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
