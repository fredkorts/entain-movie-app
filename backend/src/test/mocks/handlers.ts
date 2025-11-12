import { http, HttpResponse } from 'msw';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const handlers = [
  // Mock TMDB discover/search movies endpoint
  http.get(`${TMDB_BASE}/discover/movie`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';

    return HttpResponse.json({
      page: parseInt(page),
      results: Array.from({ length: 20 }, (_, i) => ({
        id: 100 + i + (parseInt(page) - 1) * 20,
        title: `Test Movie ${100 + i + (parseInt(page) - 1) * 20}`,
        poster_path: `/poster${i}.jpg`,
        release_date: '2024-01-01',
        vote_average: 7.5,
      })),
      total_pages: 500,
      total_results: 10000,
    });
  }),

  // Mock TMDB search endpoint
  http.get(`${TMDB_BASE}/search/movie`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const query = url.searchParams.get('query') || '';
    const pageNum = parseInt(page, 10) || 1;

    return HttpResponse.json({
      page: pageNum,
      results: Array.from({ length: 20 }, (_, i) => ({
        id: 200 + (pageNum - 1) * 20 + i,
        title: `${query} Movie ${i + (pageNum - 1) * 20}`,
        poster_path: `/poster${i}.jpg`,
        release_date: '2024-01-01',
        vote_average: 8.0,
      })),
      total_pages: 50,
      total_results: 1000,
    });
  }),

  // Mock TMDB movie detail endpoint
  http.get(`${TMDB_BASE}/movie/:id`, ({ params }) => {
    const { id } = params;

    // Simulate 404 for specific test ID
    if (id === '999999') {
      return HttpResponse.json(
        { status_code: 34, status_message: 'The resource you requested could not be found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: parseInt(id as string),
      title: `Test Movie ${id}`,
      overview: 'This is a test movie overview.',
      poster_path: '/test-poster.jpg',
      backdrop_path: '/test-backdrop.jpg',
      release_date: '2024-01-01',
      runtime: 120,
      vote_average: 8.5,
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ],
      homepage: 'https://example.com',
      status: 'Released',
      tagline: 'Test tagline',
      credits: {
        cast: [
          {
            id: 1,
            name: 'Test Actor',
            character: 'Hero',
            profile_path: '/actor.jpg',
            order: 0,
          },
          {
            id: 2,
            name: 'Another Actor',
            character: 'Villain',
            profile_path: '/actor2.jpg',
            order: 1,
          },
        ],
        crew: [
          {
            id: 10,
            name: 'Test Director',
            job: 'Director',
            department: 'Directing',
            profile_path: '/director.jpg',
          },
        ],
      },
      videos: {
        results: [
          {
            id: 'video1',
            key: 'dQw4w9WgXcQ',
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
          },
        ],
      },
      images: {
        backdrops: Array.from({ length: 15 }, (_, i) => ({
          file_path: `/backdrop${i}.jpg`,
          width: 1920,
          height: 1080,
          vote_average: 7.5,
        })),
        posters: Array.from({ length: 10 }, (_, i) => ({
          file_path: `/poster${i}.jpg`,
          width: 500,
          height: 750,
          vote_average: 8.0,
        })),
      },
      reviews: {
        results: Array.from({ length: 7 }, (_, i) => ({
          id: `review${i}`,
          author: `Reviewer ${i}`,
          content: `This is review content ${i}`,
          created_at: '2024-01-15T10:00:00Z',
          url: `https://example.com/review${i}`,
        })),
      },
    });
  }),
];
