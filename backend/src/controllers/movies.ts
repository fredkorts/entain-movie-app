import type { RequestHandler } from 'express';
import { fetchMovies} from '../services/tmdb';

interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TMDBReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  url: string;
}

// Constants for slice limits
const MAX_BACKDROPS = 12;
const MAX_POSTERS = 8;
const MAX_REVIEWS = 5;

const TMDB = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  throw new Error('TMDB_API_KEY environment variable is required');
}

const langParam = (lang?: string) =>
  new URLSearchParams({
    api_key: API_KEY,
    language: lang || 'en',
    include_image_language: `${lang || 'en'},null`,
    include_video_language: `${lang || 'en'},en,null`,
  });

export const listMovies: RequestHandler = async (req, res, next) => {
  try {
    const q = req.query as Record<string, unknown>;
    const page = Number(q.page ?? 1);
    const search = String(q.search ?? '');
    const lang = String(q.lang ?? 'en');
    const data = await fetchMovies({ page, search, lang });
    res.json(data);
  } catch (err) {
    next(err as any);
  }
};

export const getMovie: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lang } = req.query as { lang?: string };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const r = await fetch(`${TMDB}/movie/${id}?${langParam(lang).toString()}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!r.ok) {
      const errorData = await r.json().catch(() => ({}));
      return res.status(r.status).json({ 
        error: { 
          status: r.status, 
          message: errorData.status_message || 'TMDB error' 
        } 
      });
    }
    if (!r.ok) {
      return res.status(r.status).json({ error: { status: r.status, message: 'TMDB error' } });
    }
    const data = await r.json();

    // Small normalize helpers
    const pick = <T, K extends keyof T>(obj: T, keys: K[]) =>
      keys.reduce((acc, k) => ((acc[k] = obj[k]), acc), {} as Pick<T, K>);

    const result = {
      ...pick(data, [
        'id',
        'title',
        'overview',
        'runtime',
        'release_date',
        'vote_average',
        'genres',
        'poster_path',
        'backdrop_path',
        'homepage',
        'status',
        'tagline',
      ]),
      cast: (data.credits?.cast || []).map((c: TMDBCastMember) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
        order: c.order,
      })),
      crew: (data.credits?.crew || []).map((c: TMDBCrewMember) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profile_path: c.profile_path,
      })),
      videos: (data.videos?.results || []).map((v: TMDBVideo) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
      images: {
        backdrops: (data.images?.backdrops || []).slice(0, MAX_BACKDROPS),
        posters: (data.images?.posters || []).slice(0, MAX_POSTERS),
      },
      reviews: (data.reviews?.results || []).slice(0, MAX_REVIEWS).map((r: TMDBReview) => ({
        id: r.id,
        author: r.author,
        content: r.content,
        created_at: r.created_at,
        url: r.url,
      })),
    };

    res.json(result);
  } catch (e) {
    next(e);
  }
};
