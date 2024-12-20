import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import movieRoute from "./api/routes/movie-route";
import cors from "cors";
import errorMiddleware from "./middlewares/error";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"], // Allow only your frontend to access the API
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    exposedHeaders: "Set-Cookie",
    allowedHeaders: [
      "Content-Type",
      "x-api-key",
      "Authorization",
      "X-CSRF-Token",
    ],
    credentials: true, // Allow sending cookies and other credentials
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);
// Parse JSON payloads
app.use(bodyParser.json());
// Parse URL-encoded data (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie-parser with an optional secret
app.use(cookieParser());

// Register routes
app.use("/api/v1/anime", movieRoute());
//--------------- allmiddleware
app.use(errorMiddleware);
export default app;
