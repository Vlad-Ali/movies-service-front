export interface Movie {
    title: string;
    description: string;
    year: number;
    month: number;
    day: number;
    director: string;
    actors: string[];
    genres: string[];
    rating: number;
}

export interface UserMovie {
    title: string;
    description: string;
    release_date: string;
    director: string;
    actors: string[];
    genres: string[];
    rating: number;
    list_type: 'watchlist' | 'favorite' | '';
    user_rating: number;
}

export type TabType = 'all' | 'watchlist' | 'favorite';