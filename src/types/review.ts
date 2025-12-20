import {MovieInfo} from "./movie";

export interface SaveReviewRequest {
    text: string;
    review_year: number;
    review_month: number;
    review_day: number;
    movie_info: MovieInfo;
}

export interface Review {
    id: string;
    username: string;
    text: string;
    review_year: number;
    review_month: number;
    review_day: number;
    user_rating: number;
    is_liked: boolean;
    likes: number;
}

export interface MyReview {
    id: string;
    text: string;
    review_year: number;
    review_month: number;
    review_day: number;
}

export interface ReviewsResponse {
    reviews: Review[];
}

export interface ReviewLikeRequest {
    review_id: string;
}

export interface SummaryResponse {
    summary: string;
}