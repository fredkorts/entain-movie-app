import { http, HttpResponse } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const handlers = [
  // GET /api/movies - Movie list
  http.get(`${API_BASE_URL}/movies`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    // Note: search could be used to filter mock results if needed
    // const search = url.searchParams.get('search') || '';

    // Mock response
    return HttpResponse.json({
      results: [
        {
          id: 1,
          title: 'Test Movie',
          poster_path: '/test.jpg',
          release_date: '2024-01-01',
          vote_average: 8.5,
        },
        {
          id: 2,
          title: 'Another Movie',
          poster_path: '/another.jpg',
          release_date: '2024-02-15',
          vote_average: 7.8,
        },
      ],
      page: parseInt(page),
      total_pages: 5,
      total_results: 50,
    });
  }),

  // GET /api/movies/:id - Movie detail
  http.get(`${API_BASE_URL}/movies/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id: parseInt(id as string),
      title: 'Test Movie',
      overview: 'This is a test movie overview with detailed information about the plot.',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      runtime: 120,
      vote_average: 8.5,
      tagline: 'The ultimate test movie',
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
      ],
      cast: [
        {
          id: 1,
          name: 'Test Actor',
          character: 'Main Character',
          profile_path: '/actor.jpg',
          order: 0,
        },
        {
          id: 2,
          name: 'Supporting Actor',
          character: 'Side Character',
          profile_path: '/actor2.jpg',
          order: 1,
        },
      ],
      crew: [
        {
          id: 3,
          name: 'Test Director',
          job: 'Director',
          department: 'Directing',
          profile_path: '/director.jpg',
        },
        {
          id: 4,
          name: 'Test Producer',
          job: 'Producer',
          department: 'Production',
          profile_path: '/producer.jpg',
        },
      ],
      videos: [
        {
          id: 'video1',
          key: 'dQw4w9WgXcQ',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ],
      images: {
        backdrops: [
          {
            file_path: '/backdrop1.jpg',
            width: 1920,
            height: 1080,
            vote_average: 8.0,
          },
        ],
        posters: [
          {
            file_path: '/poster1.jpg',
            width: 500,
            height: 750,
            vote_average: 7.5,
          },
        ],
      },
      reviews: [
        {
          id: 'review1',
          author: 'Test Reviewer',
          content: 'This is a great test movie!',
          created_at: '2024-01-15T10:00:00Z',
          url: 'https://example.com/review1',
        },
      ],
    });
  }),
];
