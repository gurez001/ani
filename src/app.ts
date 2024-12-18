import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import movieRoute from "./api/routes/movie-route";

const app = express();

// Parse JSON payloads
app.use(bodyParser.json());
// Parse URL-encoded data (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie-parser with an optional secret
app.use(cookieParser());

// Register routes
app.use("/api/v1/anime", movieRoute());

export default app;
