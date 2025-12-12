import React, {useEffect, useState} from 'react';
import { Movie, UserMovie, MovieInfo } from '../../../types/movie';
import { movieService } from '../../../services/movieService';
import './MovieDetail.css';

interface MovieDetailProps {
    movie: Movie | UserMovie | null;
    onClose: () => void;
    isAuthenticated: boolean;
    onUpdate?: () => void; // callback для обновления списка
}

export const MovieDetail: React.FC<MovieDetailProps> = ({
                                                            movie,
                                                            onClose,
                                                            isAuthenticated,
                                                            onUpdate
                                                        }) => {

    const isUserMovie = movie && 'user_rating' in movie;

    console.log('🧪 isUserMovie:', isUserMovie);

    const [userRating, setUserRating] = useState<number>(0);
    const [listType, setListType] = useState<'watchlist' | 'favorite' | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Полная отладка пропса movie
    useEffect(() => {
        console.log('🔍 DEBUG MovieDetail - movie prop:', movie);
        console.log('🔍 Has user_rating?', movie && 'user_rating' in movie);
        console.log('🔍 Has list_type?', movie && 'list_type' in movie);

        if (movie && 'list_type' in movie) {
            const userMovie = movie as UserMovie;
            console.log('🔍 list_type value:', userMovie.list_type);
            console.log('🔍 list_type type:', typeof userMovie.list_type);
            console.log('🔍 list_type length:', userMovie.list_type.length);
            console.log('🔍 Is empty string?', userMovie.list_type === '');
            console.log('🔍 Is "favorite"?', userMovie.list_type === 'favorite');
            console.log('🔍 Is "watchlist"?', userMovie.list_type === 'watchlist');

            // Устанавливаем значения
            setUserRating(userMovie.user_rating);
            setListType(userMovie.list_type);
        } else {
            console.log('🔍 Not a UserMovie or no movie');
            setUserRating(0);
            setListType('');
        }
    }, [movie]);

    // Отладка состояния
    console.log('📊 Current state - userRating:', userRating);
    console.log('📊 Current state - listType:', listType);
    console.log('📊 Current state - listType === "favorite":', listType === 'favorite');
    console.log('📊 Current state - listType === "watchlist":', listType === 'watchlist');
    console.log('📊 Current state - listType === "":', listType === '');
    console.log('📊 Current state - !!listType:', !!listType);

    if (!movie) return null;

    const releaseDate = 'release_date' in movie
        ? new Date(movie.release_date)
        : new Date(movie.year, movie.month - 1, movie.day);

    const getMovieImage = (title: string) => {
        const imageName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `/images/movies/${imageName}.jpg`;
    };

    const getMovieInfo = (): MovieInfo => {
        if ('release_date' in movie) {
            const date = new Date(movie.release_date);
            return {
                title: movie.title,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
        } else {
            return {
                title: movie.title,
                year: movie.year,
                month: movie.month,
                day: movie.day
            };
        }
    };

    const handleRatingChange = async (rating: number) => {
        if (!isAuthenticated) {
            setError('Please login to rate movies');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await movieService.saveRating(getMovieInfo(), rating);
            setUserRating(rating);
            if (onUpdate) onUpdate(); // Обновляем родительский компонент
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save rating');
        } finally {
            setLoading(false);
        }
    };

    const handleListTypeChange = async (type: 'watchlist' | 'favorite' | '') => {
        if (!isAuthenticated) {
            setError('Please login to save to lists');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await movieService.saveToList(getMovieInfo(), type);
            setListType(type);
            if (onUpdate) onUpdate(); // Обновляем родительский компонент
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save to list');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        console.log(`userRating: ${userRating} in ${movie.title}`);
        return [...Array(10)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <button
                    key={ratingValue}
                    className={`star ${userRating >= ratingValue ? 'active' : ''} ${loading ? 'disabled' : ''}`}
                    onClick={() => handleRatingChange(ratingValue)}
                    disabled={loading || !isAuthenticated}
                    title={`Rate ${ratingValue}/10`}
                >
                    {userRating >= ratingValue ? '★' : '☆'}
                </button>
            );
        });
    };

    const renderListButtons = () => {
        // Создаем массив всех возможных кнопок
        const allButtons = [
            { type: 'watchlist' as const, label: '📝 Add to Watchlist', icon: '📝' },
            { type: 'favorite' as const, label: '❤️ Add to Favorite', icon: '❤️' },
            { type: '' as const, label: '🗑️ Remove from list', icon: '🗑️' }
        ];

        // Фильтруем: если фильм уже в списке, показываем только кнопку удаления
        // Если фильм не в списке, показываем кнопки добавления
        const buttons = allButtons.filter(button => {
            if (listType) {
                // Если фильм в каком-то списке, показываем только кнопку удаления
                return button.type !== listType;
            } else {
                // Если фильм не в списке, показываем только кнопки добавления
                return button.type !== '';
            }
        });

        return buttons.map(({ type, label, icon }) => (
            <button
                key={type}
                className={`list-btn ${listType === type ? 'active' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => handleListTypeChange(type)}
                disabled={loading || !isAuthenticated}
            >
                {icon} {label}
            </button>
        ));
    };

    return (
        <div className="movie-detail-overlay" onClick={onClose}>
            <div className="movie-detail-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>

                <div className="movie-detail-header">
                    <div className="movie-detail-image">
                        <img
                            src={getMovieImage(movie.title)}
                            alt={movie.title}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/movies/default.jpg';
                            }}
                        />
                    </div>

                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="release-date">
                            {releaseDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="director">Directed by {movie.director}</p>

                        <div className="rating-section">
                            <div className="rating">
                                <span className="rating-label">Movie Rating:</span>
                                <span className="rating-value">⭐ {movie.rating.toFixed(1)}/10</span>
                            </div>

                            {isAuthenticated && (
                                <div className="user-rating">
                                    <span className="rating-label">Your Rating:</span>
                                    <span className="rating-value">
                    {userRating > 0 ? `${userRating}/10` : 'Not rated'}
                  </span>
                                </div>
                            )}
                        </div>

                        {/* Контролы для аутентифицированных пользователей */}
                        {isAuthenticated && (
                            <div className="user-controls">
                                {error && <div className="error-message">{error}</div>}

                                <div className="rating-controls">
                                    <h4>Rate this movie:</h4>
                                    <div className="stars">
                                        {renderStars()}
                                    </div>
                                    <div className="rating-hint">
                                        Click stars to rate 1-10
                                    </div>
                                </div>

                                <div className="list-controls">
                                    <h4>Save to list:</h4>
                                    <div className="list-buttons">
                                        {renderListButtons()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="auth-required">
                                <p>🔒 Login to rate movies and save to your lists</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="movie-detail-body">
                    <div className="description-section">
                        <h3>Description</h3>
                        <p>{movie.description}</p>
                    </div>

                    <div className="details-grid">
                        <div className="detail-column">
                            <h3>Cast</h3>
                            <div className="actors-list">
                                {movie.actors.map(actor => (
                                    <span key={actor} className="actor-tag">{actor}</span>
                                ))}
                            </div>
                        </div>

                        <div className="detail-column">
                            <h3>Genres</h3>
                            <div className="genres-list">
                                {movie.genres.map(genre => (
                                    <span key={genre} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};