import {
    SaveReviewRequest,
    Review,
    MyReview,
    ReviewsResponse,
    ReviewLikeRequest,
    SummaryResponse
} from '../types/review';
import {MovieInfo} from "../types/movie";
import {API_BASE_URL} from "../config/api";
import {authFetch} from "./api";

export const reviewService = {
    async getMyReview(movieInfo: MovieInfo): Promise<MyReview | null> {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const url = new URL(`${API_BASE_URL}/api/user/movie/review`);
        url.searchParams.append('title', movieInfo.title);
        url.searchParams.append('year', movieInfo.year.toString());
        url.searchParams.append('month', movieInfo.month.toString());
        url.searchParams.append('day', movieInfo.day.toString());

        const response = await authFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to get review');
        }

        return response.json();
    },

    async getAllReviews(movieInfo: MovieInfo): Promise<Review[]> {
        const url = new URL(`${API_BASE_URL}/api/movie/review/all`);
        url.searchParams.append('title', movieInfo.title);
        url.searchParams.append('year', movieInfo.year.toString());
        url.searchParams.append('month', movieInfo.month.toString());
        url.searchParams.append('day', movieInfo.day.toString());

        const response = await authFetch(url.toString());

        if (!response.ok) {
            throw new Error('Failed to get reviews');
        }

        const data: ReviewsResponse = await response.json();
        return data.reviews || [];
    },

    async getAllReviewsForUser(movieInfo: MovieInfo): Promise<Review[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            return this.getAllReviews(movieInfo);
        }

        const url = new URL(`${API_BASE_URL}/api/movie/review/user/all`);
        url.searchParams.append('title', movieInfo.title);
        url.searchParams.append('year', movieInfo.year.toString());
        url.searchParams.append('month', movieInfo.month.toString());
        url.searchParams.append('day', movieInfo.day.toString());

        const response = await authFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get reviews for user');
        }

        const data: ReviewsResponse = await response.json();
        return data.reviews || [];
    },

    async saveReview(request: SaveReviewRequest): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await authFetch(`${API_BASE_URL}/api/user/movie/review`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to save review');
        }
    },

    async deleteReview(movieInfo: MovieInfo): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await authFetch(`${API_BASE_URL}/api/user/movie/review`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieInfo),
        });

        if (!response.ok) {
            throw new Error('Failed to delete review');
        }
    },

    async likeReview(reviewId: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const request: ReviewLikeRequest = { review_id: reviewId };

        const response = await authFetch(`${API_BASE_URL}/api/movie/review/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to like review');
        }
    },

    async unlikeReview(reviewId: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const request: ReviewLikeRequest = { review_id: reviewId };

        const response = await authFetch(`${API_BASE_URL}/api/movie/review/unlike`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to unlike review');
        }
    },

    async getSummary(movieInfo: MovieInfo): Promise<string> {
        const url = new URL(`${API_BASE_URL}/api/movie/summary`);
        url.searchParams.append('title', movieInfo.title);
        url.searchParams.append('year', movieInfo.year.toString());
        url.searchParams.append('month', movieInfo.month.toString());
        url.searchParams.append('day', movieInfo.day.toString());

        console.log('📝 Fetching summary for:', movieInfo.title);

        const response = await authFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            throw new Error('No reviews for summary');
        }

        if (!response.ok) {
            throw new Error('Failed to get summary');
        }

        const data: SummaryResponse = await response.json();
        return data.summary;
    },
};