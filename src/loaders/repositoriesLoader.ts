import MovieRepositorie from "@/repositories/movie-repositorie";

const repositoriesLoader = () => {
  const movieRepositorie = new MovieRepositorie();
  return {
    movieRepositorie,
  };
};
export default repositoriesLoader;
