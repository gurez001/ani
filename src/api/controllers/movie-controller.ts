import AsyncHandler from "@/middlewares/AsyncHandler";
import { NextFunction, Request, Response } from "express";

class MovieController {
  bannerCreate = AsyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body ={test:"pass"};    
      res.status(200).json({ body });
    }
  );
}

export default MovieController;
