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

  create = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = "66feb57f35a0c2f257ac0b73";
      const files = req.files;

      if (!userId) {
        return next(new ErrorHandler("User is not authenticated", 401));
      }

      const isExistingUrl = await this.movieService.findByUrl(req.body.metaCanonicalUrl);
      if (isExistingUrl) {
        return next(new ErrorHandler("Url already exists, try another one", 400));
      }

      const result = await this.movieService.create(req.body, files, userId, next);
      if (!result) {
        return next(new ErrorHandler("Failed to create post", 500));
      }

      this.sendResponse(res, "Post created successfully", 201, result);
    }
  );
}

export default MovieController;
