import React from 'react';
import {Movie, UserMovie} from "../../../types/movie";
import './MovieDetail.css';


interface MovieDetailProps {
    movie: Movie | UserMovie | null;
    onClose: () => void;
    isAuthenticated: boolean;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({
                                                            movie,
                                                            onClose,
                                                            isAuthenticated
                                                        }) => {
    if (!movie) return null;

    const userMovie = movie as UserMovie;
    const releaseDate = 'release_date' in movie
        ? new Date(movie.release_date)
        : new Date(movie.year, movie.month - 1, movie.day);

    const getMovieImage = (title: string) => {
        const imageName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `/images/movies/${imageName}.jpg`;
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
                                <span className="rating-label">Rating:</span>
                                <span className="rating-value">{movie.rating.toFixed(1)}/10</span>
                            </div>

                            {isAuthenticated && 'user_rating' in userMovie && userMovie.user_rating > 0 && (
                                <div className="user-rating">
                                    <span className="rating-label">Your Rating:</span>
                                    <span className="rating-value">{userMovie.user_rating}/10</span>
                                </div>
                            )}
                        </div>

                        {isAuthenticated && 'list_type' in userMovie && userMovie.list_type && (
                            <div className="list-type">
                <span className={`list-badge large ${userMovie.list_type}`}>
                  In your {userMovie.list_type}
                </span>
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