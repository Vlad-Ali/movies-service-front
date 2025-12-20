import React, { useState, useEffect } from 'react';
import { Review, MyReview, SaveReviewRequest } from '../../../types/review';
import { reviewService } from '../../../services/reviewService';
import './ReviewsSection.css';
import {MovieInfo} from "../../../types/movie";

interface ReviewsSectionProps {
    movieInfo: MovieInfo;
    isAuthenticated: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
                                                                  movieInfo,
                                                                  isAuthenticated
                                                              }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [myReview, setMyReview] = useState<MyReview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [editing, setEditing] = useState(false);
    const [liking, setLiking] = useState<string | null>(null);

    useEffect(() => {
        loadReviews();
    }, [movieInfo, isAuthenticated]);

    const loadReviews = async () => {
        setLoading(true);
        setError('');

        try {
            const loadedReviews = isAuthenticated
                ? await reviewService.getAllReviewsForUser(movieInfo)
                : await reviewService.getAllReviews(movieInfo);

            setReviews(loadedReviews);

            if (isAuthenticated) {
                const myReviewData = await reviewService.getMyReview(movieInfo);
                setMyReview(myReviewData);
                if (myReviewData) {
                    setReviewText(myReviewData.text);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleLikeReview = async (reviewId: string) => {
        if (!isAuthenticated) {
            setError('Please login to like reviews');
            return;
        }

        setLiking(reviewId);
        setError('');

        try {
            const review = reviews.find(r => r.id === reviewId);
            if (!review) return;

            if (review.is_liked) {
                await reviewService.unlikeReview(reviewId);
                setReviews(prev => prev.map(r =>
                    r.id === reviewId
                        ? { ...r, is_liked: false, likes: Math.max(0, r.likes - 1) }
                        : r
                ));
            } else {
                await reviewService.likeReview(reviewId);
                setReviews(prev => prev.map(r =>
                    r.id === reviewId
                        ? { ...r, is_liked: true, likes: r.likes + 1 }
                        : r
                ));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update like');
        } finally {
            setLiking(null);
        }
    };

    const handleSaveReview = async () => {
        if (!reviewText.trim()) {
            setError('Review text cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const now = new Date();
            const request: SaveReviewRequest = {
                text: reviewText,
                review_year: now.getFullYear(),
                review_month: now.getMonth() + 1,
                review_day: now.getDate(),
                movie_info: movieInfo
            };

            await reviewService.saveReview(request);
            setMyReview({
                id: myReview?.id || '',
                text: reviewText,
                review_year: now.getFullYear(),
                review_month: now.getMonth() + 1,
                review_day: now.getDate()
            });
            setShowReviewForm(false);
            setEditing(false);
            await loadReviews();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save review');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!window.confirm('Are you sure you want to delete your review?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reviewService.deleteReview(movieInfo);
            setMyReview(null);
            setReviewText('');
            setShowReviewForm(false);
            setEditing(false);
            await loadReviews();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (year: number, month: number, day: number) => {
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderReviewRating = (rating: number) => {
        if (rating <= 0) return null;

        return (
            <div className="review-rating-container">
                <span className="review-rating-label">Film rating:</span>
                <span className="review-rating-stars">
                    {'★'.repeat(rating)}{'☆'.repeat(10 - rating)}
                </span>
                <span className="review-rating-value">{rating}/10</span>
            </div>
        );
    };

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <h3>Reviews ({reviews.length})</h3>
                {isAuthenticated && !showReviewForm && !myReview && (
                    <button
                        className="add-review-btn"
                        onClick={() => setShowReviewForm(true)}
                    >
                        ✍️ Add Review
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Форма для написания/редактирования отзыва */}
            {isAuthenticated && (showReviewForm || editing) && (
                <div className="review-form">
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        rows={4}
                        disabled={loading}
                    />
                    <div className="review-form-actions">
                        <button
                            onClick={handleSaveReview}
                            disabled={loading || !reviewText.trim()}
                            className="save-btn"
                        >
                            {loading ? 'Saving...' : myReview ? 'Update Review' : 'Save Review'}
                        </button>
                        <button
                            onClick={() => {
                                setShowReviewForm(false);
                                setEditing(false);
                                if (!myReview) {
                                    setReviewText('');
                                }
                            }}
                            disabled={loading}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        {myReview && !editing && (
                            <button
                                onClick={handleDeleteReview}
                                disabled={loading}
                                className="delete-btn"
                            >
                                🗑️ Delete
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Показать свой отзыв */}
            {isAuthenticated && myReview && !editing && !showReviewForm && (
                <div className="my-review">
                    <div className="review-header">
                        <span className="review-author">Your Review</span>
                        <span className="review-date">
                            {formatDate(myReview.review_year, myReview.review_month, myReview.review_day)}
                        </span>
                        <button
                            onClick={() => setEditing(true)}
                            className="edit-btn"
                        >
                            ✏️ Edit
                        </button>
                    </div>
                    <p className="review-text">{myReview.text}</p>
                </div>
            )}

            {/* Список всех отзывов */}
            {loading ? (
                <div className="loading">Loading reviews...</div>
            ) : (
                <div className="reviews-list">
                    {reviews
                        .filter(review => !myReview || review.id !== myReview.id)
                        .map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <span className="review-author">{review.username}</span>
                                    <span className="review-date">
                                        {formatDate(review.review_year, review.review_month, review.review_day)}
                                    </span>
                                    <div className="review-likes-container">
                                        <button
                                            className={`like-btn ${review.is_liked ? 'liked' : ''}`}
                                            onClick={() => handleLikeReview(review.id)}
                                            disabled={!isAuthenticated || liking === review.id}
                                            title={review.is_liked ? 'Unlike' : 'Like'}
                                        >
                                            {review.is_liked ? '❤️' : '🤍'}
                                        </button>
                                        <span className="review-likes-count">{review.likes}</span>
                                    </div>
                                </div>
                                {review.user_rating > 0 && renderReviewRating(review.user_rating)}
                                <p className="review-text">{review.text}</p>
                                {review.is_liked && (
                                    <span className="liked-badge">❤️ You liked this review</span>
                                )}
                            </div>
                        ))
                    }

                    {reviews.length === 0 && !myReview && (
                        <div className="no-reviews">
                            <p>No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            )}

            {!isAuthenticated && (
                <div className="auth-required">
                    <p>🔒 Login to write and like reviews</p>
                </div>
            )}
        </div>
    );
};