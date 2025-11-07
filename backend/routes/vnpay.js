const express = require("express");
const router = express.Router();
const crypto = require("crypto");

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

router.post("/vnpay/create-payment", async (req, res) => {
  try {
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = process.env.VNP_RETURN_URL || "http://localhost:5173/vnpay-return";

    if (!tmnCode || !secretKey) {
      return res.status(500).json({ message: "VNPAY is not configured" });
    }

    const { amount, orderInfo } = req.body;
    const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip || "127.0.0.1";

    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const txnRef = date.getTime().toString();

    const params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo || "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(amount || 0) * 100).toString(),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: Array.isArray(ipAddr) ? ipAddr[0] : ipAddr,
      vnp_CreateDate: createDate,
    };

    const sorted = sortObject(params);
    const signData = Object.keys(sorted)
      .map((k) => `${k}=${encodeURIComponent(sorted[k])}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;

    return res.json({ paymentUrl });
  } catch (e) {
    return res.status(500).json({ message: "Create VNPAY payment failed" });
  }
});

router.post("/vnpay/verify", async (req, res) => {
  try {
    const secretKey = process.env.VNP_HASH_SECRET;
    if (!secretKey) return res.status(500).json({ message: "VNPAY is not configured" });

    const vnpParams = { ...(req.body || {}) };

    const secureHash = vnpParams.vnp_SecureHash || vnpParams.vnp_SecureHashType;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sorted = sortObject(vnpParams);
    const signData = Object.keys(sorted)
      .map((k) => `${k}=${encodeURIComponent(sorted[k])}`)
      .join("&");

    const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, "utf-8")).digest("hex");

    const isValid = secureHash && secureHash.toLowerCase() === signed.toLowerCase();
    const success = isValid && vnpParams.vnp_ResponseCode === "00";

    return res.json({ isValid, success, code: vnpParams.vnp_ResponseCode });
  } catch (e) {
    return res.status(500).json({ message: "Verify VNPAY failed" });
  }
});

module.exports = router;
 
// Redirect endpoint for VNPAY return (for cases where VNP_RETURN_URL points to backend)
router.get("/vnpay_return", async (req, res) => {
  try {
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const returnUrl = `${frontendBase.replace(/\/$/, "")}/vnpay-return`;
    const queryString = Object.keys(req.query)
      .map((k) => `${k}=${encodeURIComponent(req.query[k])}`)
      .join("&");
    const redirectTo = `${returnUrl}${queryString ? `?${queryString}` : ""}`;
    return res.redirect(302, redirectTo);
  } catch (e) {
    return res.status(500).send("Cannot redirect to frontend return URL");
  }
});
