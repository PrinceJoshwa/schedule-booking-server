// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors({
//   origin: [
//     process.env.CLIENT_URL,
//     "https://schedura-landing.vercel.app",
//     "http://localhost:5173" // Keep both explicitly
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// app.use(express.json());
// app.use(morgan("dev"));

// // Log environment variables for debugging (remove in production)
// console.log('Environment variables loaded:');
// console.log('- NODE_ENV:', process.env.NODE_ENV);
// console.log('- PORT:', process.env.PORT);
// console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
// console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

// app.use("/api/users", userRoutes);
// app.use("/api/bookings", bookingRoutes);

// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

dotenv.config()

connectDB()

const app = express()

// Fix CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://schedura-landing.vercel.app")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  next()
})

// Keep the existing cors middleware as a backup
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://schedura-landing.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)

app.use(express.json())
app.use(morgan("dev"))

// Log environment variables for debugging (remove in production)
console.log("Environment variables loaded:")
console.log("- NODE_ENV:", process.env.NODE_ENV)
console.log("- PORT:", process.env.PORT)
console.log("- EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set")
console.log("- EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Not set")

app.use("/api/users", userRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

