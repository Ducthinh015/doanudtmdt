const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

module.exports = router;
