//--------------------------------------------
// IMPORTS
//--------------------------------------------
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

//--------------------------------------------
// MIDDLEWARE
//--------------------------------------------
app.use(express.json());

// CORS CHUẨN (Fix CORS blocked by browser)
app.use(
  cors({
    origin: [
      "https://bookcove-book-store.netlify.app",
      "https://doanudtmdt-bcci.onrender.com",
      "https://doanudtmdt.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//--------------------------------------------
// ROUTES IMPORT
//--------------------------------------------
const user = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Analytics = require("./routes/analytics");
const Sepay = require("./routes/sepay");

//--------------------------------------------
// ROUTES SETUP
//--------------------------------------------
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Sepay);

// analytics route riêng prefix
app.use("/api/v1/analytics", Analytics);

app.get("/", (req, res) => {
  res.send("Backend is running OK ✔");
});

//--------------------------------------------
// SOCKET SERVER
//--------------------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.emit("botMessage", "Chào bạn! Mình có thể giúp gì cho bạn?");

  socket.on("userMessage", (msg) => {
    console.log("📩 User:", msg);

    const lower = msg.toLowerCase();
    let reply = "Xin lỗi, mình chưa hiểu ý bạn.";

    if (lower.includes("genre") || lower.includes("thể loại")) {
      reply =
        "Thể loại có: tiểu thuyết, phi hư cấu, trinh thám, giả tưởng, lãng mạn, thiếu nhi,…";
    }

    if (lower.includes("mua") || lower.includes("how to buy") || lower.includes("buy")) {
      reply = "Bạn chọn sách → nhấn 'Thêm vào giỏ' → tiến hành thanh toán.";
    }

    if (lower.includes("audio") || lower.includes("audiobook") || lower.includes("sách nói")) {
      reply = "Bên mình có nhiều audiobook hấp dẫn, bạn muốn thể loại nào?";
    }

    socket.emit("botMessage", reply);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

//--------------------------------------------
// SERVER START
//--------------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
