import {Movie, MovieInfo, SaveListTypeRequest, SaveRatingRequest, TabType, UserMovie} from "../types/movie";
import {API_BASE_URL} from "../config/api";
import {authFetch} from "./api";

export const movieService = {
    async getAllMovies(): Promise<Movie[]> {
        const response = await authFetch(`${API_BASE_URL}/api/movie/all`);
        if (!response.ok){
            console.log(`Failed to fetch movies for ${response.statusText}`);
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        return data.Movies || [];
    },

    async getUserMovies(listType: TabType): Promise<UserMovie[]> {
        const token = localStorage.getItem('token');
        if (!token){
            console.log(`There is no token in storage`);
            throw new Error('Not authenticated');
        }

        const url = new URL(`${API_BASE_URL}/api/user/movie/all`);
        const listTypeValue = listType === 'all' ? '' : listType;

        if (listTypeValue) {
            url.searchParams.append('listType', listTypeValue);
        }

        console.log(`📝 Fetching user movies from: ${url.toString()}`);

        const response = await authFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`📨 Response status: ${response.status} ${response.statusText}`);

        if (!response.ok){
            console.error(`❌ Failed to fetch user movies: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch user movies');
        }

        const data = await response.json();
        console.log(`✅ Successfully fetched ${data.userMovies?.length || 0} user movies`);
        return data.userMovies || [];
    },
    async saveRating(movieInfo: MovieInfo, rating: number): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const requestBody: SaveRatingRequest = {
            movie_info: movieInfo,
            rating: Math.max(1, Math.min(10, rating)) // Ограничиваем 1-10
        };

        console.log(`📊 Saving rating ${rating} for movie: ${movieInfo.title}`);

        const response = await authFetch(`${API_BASE_URL}/api/user/movie/rating`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.error(`❌ Failed to save rating: ${response.status} ${response.statusText}`);
            throw new Error('Failed to save rating');
        }

        console.log('✅ Rating saved successfully');
    },

    async saveToList(movieInfo: MovieInfo, listType: 'watchlist' | 'favorite' | ''): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const requestBody: SaveListTypeRequest = {
            movie_info: movieInfo,
            list_type: listType
        };

        console.log(`📋 Saving to list "${listType}": ${movieInfo.title}`);

        const response = await authFetch(`${API_BASE_URL}/api/user/movie/list`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.error(`❌ Failed to save to list: ${response.status} ${response.statusText}`);
            throw new Error('Failed to save to list');
        }

        console.log('✅ Saved to list successfully');
    },
};