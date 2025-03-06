// import { OAuth2Client } from "google-auth-library";
// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     // Verify the access token with Google
//     const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to verify token");
//     }
    
//     const userData = await response.json();
//     const { name, email, sub: googleId } = userData;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         googleId,
//       });
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error("Google Auth Error:", error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// export { googleAuth };


import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: "Token is required" })
    }

    // Verify the access token with Google
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Google API Error:", errorData)
      return res.status(401).json({
        message: "Failed to verify token with Google",
        details: errorData,
      })
    }

    const userData = await response.json()
    const { name, email, sub: googleId } = userData

    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google" })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error("Google Auth Error:", error)
    res.status(500).json({ message: "Authentication failed", error: error.message })
  }
}

export { googleAuth }

