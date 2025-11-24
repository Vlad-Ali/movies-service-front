import React, {useState, useEffect, useCallback} from 'react';
import { MovieTabs } from '../tab/MovieTabs';
import { MovieCard } from '../card/MovieCard';
import { MovieDetail } from '../detail/MovieDetail';
import './MoviesPage.css';
import { Movie, TabType, UserMovie } from "../../../types/movie";
import { movieService } from "../../../services/movieService";
import {useAuth} from "../../../contexts/AuthContext";

export const MoviesPage: React.FC = () => {
    const { user } = useAuth(); // Теперь useAuth доступен
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [movies, setMovies] = useState<(Movie | UserMovie)[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | UserMovie | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadMovies = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            console.log(`🎬 Loading movies - Tab: ${activeTab}, User: ${user ? 'authenticated' : 'not authenticated'}`);

            if (activeTab === 'all') {
                if (user) {
                    console.log('📊 Loading all movies for authenticated user');
                    const userMovies = await movieService.getUserMovies('all');
                    setMovies(userMovies);
                } else {
                    console.log('📊 Loading all movies for guest');
                    const allMovies = await movieService.getAllMovies();
                    setMovies(allMovies);
                }
            } else {
                if (user) {
                    console.log(`📊 Loading ${activeTab} movies`);
                    const userMovies = await movieService.getUserMovies(activeTab);
                    setMovies(userMovies);
                } else {
                    console.log('🔒 User not authenticated for user-specific tabs');
                    setMovies([]);
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load movies';
            console.error('💥 Error loading movies:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [activeTab, user]);

    useEffect(() => {
        loadMovies();
    }, [loadMovies]);

    const handleMovieClick = (movie: Movie | UserMovie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetail = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="movies-page">
            <div className="movies-header">
                <h1>Movies</h1>
                <p>Discover and manage your movie collection</p>
            </div>

            <MovieTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isAuthenticated={!!user}
            />

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={loadMovies} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading movies...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.title}
                            movie={movie}
                            onClick={handleMovieClick}
                        />
                    ))}
                </div>
            )}

            {!loading && movies.length === 0 && (
                <div className="empty-state">
                    <h3>No movies found</h3>
                    <p>
                        {activeTab === 'all'
                            ? 'There are no movies available at the moment.'
                            : user
                                ? `Your ${activeTab} is empty. Add some movies!`
                                : 'Please login to see your personal lists'
                        }
                    </p>
                </div>
            )}

            <MovieDetail
                movie={selectedMovie}
                onClose={handleCloseDetail}
                isAuthenticated={!!user}
            />
        </div>
    );
};