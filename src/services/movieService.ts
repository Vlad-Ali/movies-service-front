import {Movie, TabType, UserMovie} from "../types/movie";
import {API_BASE_URL} from "../config/api";

export const movieService = {
    async getAllMovies(): Promise<Movie[]> {
        const response = await fetch(`${API_BASE_URL}/api/movie/all`);
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

        const response = await fetch(url.toString(), {
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
};