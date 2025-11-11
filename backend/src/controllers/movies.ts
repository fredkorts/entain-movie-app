import type { RequestHandler } from 'express';
import { fetchMovies} from '../services/tmdb';

const TMDB = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY!;

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

    const qs = langParam(lang);
    qs.append('append_to_response', 'credits,images,videos,reviews');

    const r = await fetch(`${TMDB}/movie/${id}?${qs.toString()}`);
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
      cast: (data.credits?.cast || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
        order: c.order,
      })),
      crew: (data.credits?.crew || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profile_path: c.profile_path,
      })),
      videos: (data.videos?.results || []).map((v: any) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
      images: {
        backdrops: (data.images?.backdrops || []).slice(0, 12),
        posters: (data.images?.posters || []).slice(0, 8),
      },
      reviews: (data.reviews?.results || []).slice(0, 5).map((r: any) => ({
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
