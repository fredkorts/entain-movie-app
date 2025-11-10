import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./shared/layouts/AppLayout.tsx"
import MoviesListPage from "./features/movies/pages/MoviesListPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <MoviesListPage /> },
        ],
    },
]);

export default router;