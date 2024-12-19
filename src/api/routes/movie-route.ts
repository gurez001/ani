import { Router } from "express";
import MovieController from "../controllers/movie-controller";
import repositoriesLoader from "@/loaders/repositoriesLoader";
import servicesLoader from "@/loaders/servicesLoader";
import upload from "@/middlewares/multer";
import verifyApiKey from "@/middlewares/verifyApiKey";

const repositories = repositoriesLoader();
const services = servicesLoader(repositories);

const movieController = new MovieController(services.movieService); // Pass movieService here

const movieRoute = () => {
  const router = Router();
  router.post(
    "/",
    verifyApiKey,
    upload.array("images", 10),
    movieController.create.bind(movieController)
  ); // Use POST for create
  return router;
};

export default movieRoute;
