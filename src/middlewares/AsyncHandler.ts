import { Request, Response, NextFunction } from "express";

class AsyncHandler {
  public handler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        console.error("Error caught in AsyncHandler:", error);

        if (!res.headersSent) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred" });
          }
        } else {
          // Pass the error to the next middleware if headers are already sent
          next(error);
        }
      }
    };
  }
}

export default new AsyncHandler();
