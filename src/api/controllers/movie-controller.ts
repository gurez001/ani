import AsyncHandler from "@/middlewares/AsyncHandler";
import MovieService from "@/services/movie-service";
import ErrorHandler from "@/utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";

class MovieController {
  constructor(private movieService: MovieService) {}
  // Helper function to send a consistent response
  private sendResponse(
    res: Response,
    message: string,
    statusCode: number,
    data: any = null
  ) {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data,
    });
  }
  create = AsyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body)
      res.status(200).json({success:true})
      // const userId = (req as any).user?._id; // Use the correct type for the request user
      const userId = "66feb57f35a0c2f257ac0b73"; // Use the correct type for the request user
      const files = req.files;

      // Check if URL already exists
      const isExistingUrl = await this.movieService.findByUrl(
        req.body.metaCanonicalUrl
      );
      if (isExistingUrl) {
        return next(
          new ErrorHandler("Url already exists, try another one", 400)
        ); // Changed to 400
      }

      // Validate user authentication
      if (!userId) {
        return next(new ErrorHandler("User is not authenticated", 401)); // Changed to 401
      }

      // Create post
      const result = await this.movieService.create(
        req.body,
        files,
        userId,
        next
      );
      if (result) {
        return this.sendResponse(res, "Post created successfully", 201);
      }

      return next(new ErrorHandler("Failed to create post", 500));
    }
  );
}

export default MovieController;
