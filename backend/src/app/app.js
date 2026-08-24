import express from "express";
import cookieParser from "cookie-parser";
import { router as authRouter, passport } from "../modules/auth/index.js";
import errorHandler from "../middlewares/errorHandler.js";
import notFound from "../middlewares/notFound.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// auth routes
app.use("/api/auth", authRouter);

app.get("/",(req,res)=>{
    res.status(200).json({
        // status:"server is running",
        ":)":"welcome to the skillAtlas backend"
    })
})

//health check route
app.use("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running.",
    uptime: process.uptime()/60, // Uptime in minutes
    timestamp: new Date().toISOString(),
  });
});

// not found & error handling middleware
app.use(notFound);
app.use(errorHandler);


export default app;

