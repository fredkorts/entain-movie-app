import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./shared/layouts/AppLayout.tsx"
import MoviesListPage from "./features/movies/pages/MoviesListPage.tsx";
import MovieDetailPage from "./features/movies/pages/MovieDetailPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <MoviesListPage /> },
            { path: "movie/:id", element: <MovieDetailPage /> },
        ],
    },
]);

export default router;