import MovieRepositorie from "@/repositories/movie-repositorie";
import MovieService from "@/services/movie-service";

const servicesLoader = (repositories: {
  movieRepositorie: MovieRepositorie;
}) => {
  const movieService = new MovieService(repositories.movieRepositorie);

  return {
    movieService,
  };
};

export default servicesLoader;
