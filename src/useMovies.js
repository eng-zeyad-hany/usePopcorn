import { useEffect, useState } from "react";

const KEY = "3b1a0d3b";
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          console.log(res);
          if (!res.ok)
            throw new Error("Someting went wrong with fetching movies");
          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movies not found");
          }

          setMovies(data.Search);
          callback?.();

          setErrorMessage("");
        } catch (error) {
          if (error.name !== "AbortError") setErrorMessage(error.message);
        } finally {
          setIsLoading(false);
        }
      } // end async function fetchMovies
      if (query.length < 3) {
        setMovies([]);
        setErrorMessage("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  ); // dependancy array mean this effect run on mount in first time
  return { movies, isLoading, errorMessage };
}
