import { Router } from "express";
import MovieController from "../controllers/movie-controller";

const movieController = new MovieController();

const movieRoute = () => {
  const router = Router();
  // Correctly assign the bannerCreate method to the GET route
  router.get("/", movieController.bannerCreate.bind(movieController));
  return router;
};

export default movieRoute;
