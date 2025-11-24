import React from 'react';
import './MovieCard.css';
import {Movie, UserMovie} from "../../../types/movie";

interface MovieCardProps {
    movie: Movie | UserMovie;
    onClick: (movie: Movie | UserMovie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
                                                        movie,
                                                        onClick
                                                    }) => {
    const userMovie = movie as UserMovie;
    const releaseDate = 'release_date' in movie
        ? new Date(movie.release_date).getFullYear()
        : movie.year;

    const getMovieImage = (title: string) => {
        const imageName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `/images/movies/${imageName}.jpg`;
    };

    return (
        <div className="movie-card" onClick={() => onClick(movie)}>
            <div className="movie-image">
                <img
                    src={getMovieImage(movie.title)}
                    alt={movie.title}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/movies/default.jpg';
                    }}
                />
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{releaseDate}</p>

                {'list_type' in userMovie && userMovie.list_type && (
                    <div className="movie-list-type">
            <span className={`list-badge ${userMovie.list_type}`}>
              {userMovie.list_type}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
};