const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const { authenticationToken } = require("./userAuth");

//sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    console.log("Request body:", req.body);

    //check username length is more than 3
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    //check username exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "username already exists" });
    }

    //check email exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //check pass len
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password length must be greater than 5" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "SignUp Sucessfully" });
  } catch (error) {
    console.error("🔥 Sign-up error:", error); // log it in terminal
    res.status(500).json({
      message: "Internal server error",
      error: error.message, // <-- send back the real message
    });
  }
});

//sign in

router.post("/sign-in", async (req, res) => {
  console.log("Received sign-in request with payload:", req.body);

  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Correctly using the callback version of bcrypt.compare
    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err) {
        console.error("Error during bcrypt compare:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Success logic
      const authClaims = {
        id: existingUser._id,
        name: existingUser.username,
        role: existingUser.role,
      };

      const token = jwt.sign({ authClaims }, process.env.JWT_SECRET || "bookStore123", {
        expiresIn: "30d",
      });

      return res.status(200).json({
        id: existingUser._id,
        role: existingUser.role,
        token: token,
      });
    });
  } catch (error) {
    console.error("🔥 SIGN-IN ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get-user-info
router.get("/get-user-information", authenticationToken, async (req, res) => {
  try {
    console.log("Decoded user in middleware:", req.user);
    const { id } = req.user.authClaims;
    console.log("User ID:", id);
    const data = await User.findById(id).select("-password");
    console.log("User data from DB:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update address
router.put("/update-address", authenticationToken, async (req, res) => {
  try {
    const { id } = req.user.authClaims;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address update successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// request password reset token
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      // avoid leaking which emails exist
      return res.status(200).json({ message: "If that email exists, reset instructions were sent" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = Date.now() + 1000 * 60 * 30; // 30 minutes

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendBase.replace(/\/$/, "")}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    // TODO: integrate with real email service
    console.log(`Password reset link for ${email}: ${resetLink}`);

    return res.status(200).json({ message: "Reset instructions sent", resetLink });
  } catch (error) {
    console.error("Forgot password error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password length must be greater than 5" });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Reset password error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
