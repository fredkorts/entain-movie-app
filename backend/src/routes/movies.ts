import { Router } from 'express';
import { listMovies, getMovie } from '../controllers/movies';

const router = Router();
router.get('/', listMovies);
router.get('/:id(\\d+)', getMovie);
export default router;
