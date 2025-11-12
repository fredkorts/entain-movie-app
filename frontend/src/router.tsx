import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./shared/layouts/AppLayout.tsx"
import ErrorBoundary from "./shared/components/ErrorBoundary"
import MoviesListPage from "./features/movies/pages/MoviesListPage";
import MovieDetailPage from "./features/movies/pages/MovieDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ErrorBoundary>
                <AppLayout />
            </ErrorBoundary>
        ),
        children: [
            { 
                index: true, 
                element: (
                    <ErrorBoundary>
                        <MoviesListPage />
                    </ErrorBoundary>
                ) 
            },
            { 
                path: "movie/:id", 
                element: (
                    <ErrorBoundary>
                        <MovieDetailPage />
                    </ErrorBoundary>
                )
            },
            {
                path: "*",
                element: (
                    <ErrorBoundary>
                        <NotFoundPage />
                    </ErrorBoundary>
                )
            },
        ],
    },
]);

export default router;