import { Request, Response, NextFunction } from "express";

// Middleware to verify the API key
const verifyApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  // Check if API key is provided
  if (!apiKey) {
    res.status(400).json({ message: "API key is missing" }); // Send response directly, no return
    return; // Exit after sending the response
  }

  // Compare the received API key with the stored key
  if (apiKey !== process.env.API_KEY) {
    res.status(403).json({ message: "Invalid API key" }); // Send response directly, no return
    return; // Exit after sending the response
  }

  // If the API key is valid, call the next middleware
  next();
};

export default verifyApiKey;
