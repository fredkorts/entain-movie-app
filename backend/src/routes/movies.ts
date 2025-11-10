import { Router } from 'express';
import { listMovies, getMovie } from '../controllers/movies';

const router = Router();
router.get('/', listMovies);      // GET /movies?page=&search=&lang=
router.get('/:id', getMovie);     // GET /movies/:id?lang=
export default router;
