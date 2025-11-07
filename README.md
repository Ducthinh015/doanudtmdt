# BookStore Web App

A full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack. This platform allows users to browse, order, and manage books with authentication and role-based access control. The frontend is styled using Tailwind CSS and managed with Redux for efficient state management.

## Demo

[Live Demo](https://bookcove-book-store.netlify.app/)

For user demo : username - demo-user , password - 123456 <br>
For admin demo : username - admin123 , password - 123456


## Features

- **Authentication**
  - Signup and Login
  - JWT-based authentication
  - Role-based access control (Admin, User)

- **Book Management**
  - Add new books (Admin only)
  - Browse available books
  - Display book details

- **Order Management**
  - Place book orders
  - Track order status
  - View order history

- **State Management**
  - Redux for centralized state

## Tech Stack

- **Frontend:** React.js, Redux, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT
- **Deployment:** Render, Netlify

## Demo screenshots
<img width="1920" height="973" alt="Screenshot (706)" src="https://github.com/user-attachments/assets/1ca17910-b2a0-4f28-b440-638b87f20edf" />

## Hướng dẫn tiếng Việt và VNPAY

- **Giao diện tiếng Việt:** Đã Việt hóa thanh điều hướng (Navbar) và trang Giỏ hàng (Cart). Các nút và nhãn chính đã chuyển sang tiếng Việt. Nếu bạn muốn Việt hóa toàn bộ các trang còn lại (Đăng nhập, Đăng ký, Hồ sơ, Quản trị, vv.), vui lòng cho biết để tiếp tục cập nhật.

- **Tích hợp VNPAY (Sandbox):** Backend thêm hai endpoint:
  - POST `/api/v1/vnpay/create-payment`: tạo link thanh toán
  - POST `/api/v1/vnpay/verify`: xác minh giao dịch từ tham số trả về của VNPAY

  Frontend thêm trang `VnpayReturn` (`/vnpay-return`) để đọc tham số trả về, gọi verify và tự động tạo đơn hàng khi thanh toán thành công.

### Biến môi trường Backend (file .env)

```
VNP_TMN_CODE=your_sandbox_tmn_code
VNP_HASH_SECRET=your_sandbox_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5173/vnpay-return
PORT=5000
MONGO_URI=...
JWT_SECRET=...
```

- Lưu ý cập nhật `VNP_RETURN_URL` sang domain sản xuất của frontend khi deploy.
- CORS đã cho phép `http://localhost:5173` và demo Netlify có sẵn. Cần bổ sung domain mới nếu khác.

### Quy trình thanh toán VNPAY

1. Ở trang Giỏ hàng bấm "Thanh toán VNPAY" → frontend gọi `/api/v1/vnpay/create-payment` nhận `paymentUrl` và redirect.
2. Sau khi thanh toán, VNPAY điều hướng về `VNP_RETURN_URL` kèm tham số (vnp_*) → trang `/vnpay-return` đọc tham số, gọi `/api/v1/vnpay/verify` để xác minh.
3. Nếu `success=true`, hệ thống tự động lấy giỏ hàng hiện tại và gọi `/api/v1/place-order` để tạo đơn, sau đó điều hướng tới lịch sử đơn hàng.

### Ghi chú

- VNPAY tính theo đơn vị đồng × 100, backend đã nhân hệ số 100 khi khởi tạo giao dịch.
- Tổng tiền hiển thị theo định dạng Việt Nam (₫). Hãy đảm bảo `price` là số.

