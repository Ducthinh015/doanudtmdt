const express = require("express");
const router = express.Router();
const { SePayPgClient } = require("sepay-pg-node");
const { authenticationToken } = require("./userAuth");

const sepayConfig = {
  env: process.env.SEPAY_ENV || "sandbox",
  merchant_id: process.env.SEPAY_MERCHANT_ID,
  secret_key: process.env.SEPAY_SECRET_KEY,
};

let sepayClient = null;
if (sepayConfig.merchant_id && sepayConfig.secret_key) {
  sepayClient = new SePayPgClient(sepayConfig);
}

router.post("/sepay/create-payment", authenticationToken, async (req, res) => {
  try {
    if (!sepayClient) {
      return res.status(500).json({ message: "SePay client is not configured" });
    }

    const amount = Math.round(Number(req.body.amount || 0));
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const orderNumber = req.body.order_invoice_number || `ORDER_${Date.now()}`;
    const description =
      req.body.order_description || `Thanh toan don hang ${orderNumber}`;

    const successUrl = process.env.SEPAY_SUCCESS_URL || `${process.env.FRONTEND_URL}/payment-return?payment=success`;
    const errorUrl = process.env.SEPAY_ERROR_URL || `${process.env.FRONTEND_URL}/payment-return?payment=error`;
    const cancelUrl = process.env.SEPAY_CANCEL_URL || `${process.env.FRONTEND_URL}/payment-return?payment=cancel`;

    const checkoutUrl = sepayClient.checkout.initCheckoutUrl();
    const fields = sepayClient.checkout.initOneTimePaymentFields({
      payment_method: req.body.payment_method || "BANK_TRANSFER",
      order_invoice_number: orderNumber,
      order_amount: amount,
      currency: "VND",
      order_description: description,
      success_url: successUrl,
      error_url: errorUrl,
      cancel_url: cancelUrl,
    });

    return res.json({ checkoutUrl, fields, orderNumber });
  } catch (error) {
    console.error("SePay checkout error", error);
    return res.status(500).json({ message: "Cannot create SePay checkout" });
  }
});

module.exports = router;
