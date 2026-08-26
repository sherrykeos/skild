import express from "express";
import cookieParser from "cookie-parser";

import { passport } from "../modules/auth/index.js";

import routes from "../routes/index.route.js";

import errorHandler from "../middlewares/errorHandler.js";
import notFound from "../middlewares/notFound.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.status(200).json({
        ":)": "welcome to the SkillAtlas backend",
    });
});

app.use("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running.",
        uptime: process.uptime() / 60,
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use("/api", routes);

// Not found & error handling
app.use(notFound);
app.use(errorHandler);

export default app;