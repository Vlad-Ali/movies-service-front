import React, { useState, useEffect } from 'react';
import { MovieInfo } from '../../../types/movie';
import { reviewService } from '../../../services/reviewService';
import './SummarySection.css';

interface SummarySectionProps {
    movieInfo: MovieInfo;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ movieInfo }) => {
    const [summary, setSummary] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [hasReviews, setHasReviews] = useState(true); // Предполагаем что есть отзывы

    const loadSummary = async () => {
        setLoading(true);
        setError('');
        setSummary('');

        try {
            const summaryText = await reviewService.getSummary(movieInfo);
            // Обрабатываем специальные символы
            const processedSummary = processSummaryText(summaryText);
            setSummary(processedSummary);
            setShowSummary(true);
        } catch (err) {
            if (err instanceof Error && err.message === 'No reviews for summary') {
                setHasReviews(false);
                setError('No reviews available for summary');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load summary');
            }
            setShowSummary(false);
        } finally {
            setLoading(false);
        }
    };

    // Функция для обработки текста summary
    const processSummaryText = (text: string): string => {
        if (!text) return '';

        // Заменяем \n на переносы строк
        let processed = text
            .replace(/\\n/g, '\n')  // \n → перенос строки
            .replace(/\\"/g, '"')   // \" → "
            .replace(/\\'/g, "'")   // \' → '
            .replace(/\\\\/g, '\\') // \\ → \
            .trim();

        // Добавляем абзацы если есть пустые строки
        return processed.split('\n').map(line => line.trim()).join('\n');
    };

    // Форматирование текста для отображения с переносами строк
    const renderSummaryText = (text: string) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="summary-section">
            <div className="summary-header">
                <h3>AI Summary</h3>
                {!showSummary && hasReviews && !loading && !error && (
                    <button
                        className="generate-summary-btn"
                        onClick={loadSummary}
                        disabled={loading}
                    >
                        🤖 Generate Summary
                    </button>
                )}
            </div>

            {error && !hasReviews && (
                <div className="info-message">
                    <p>No reviews yet to generate summary</p>
                </div>
            )}

            {error && hasReviews && (
                <div className="error-message">
                    {error}
                    <button
                        onClick={loadSummary}
                        className="retry-btn"
                        disabled={loading}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {loading && (
                <div className="summary-loading">
                    <div className="loader"></div>
                    <p>AI is analyzing reviews...</p>
                    <p className="loading-hint">This may take a few seconds</p>
                </div>
            )}

            {showSummary && summary && (
                <div className="summary-content">
                    <div className="summary-text">
                        {renderSummaryText(summary)}
                    </div>
                    <div className="summary-actions">
                        <button
                            className="refresh-btn"
                            onClick={loadSummary}
                            disabled={loading}
                        >
                            🔄 Regenerate
                        </button>
                        <button
                            className="hide-btn"
                            onClick={() => setShowSummary(false)}
                        >
                            Hide
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};