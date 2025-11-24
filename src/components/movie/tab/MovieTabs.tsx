import React from 'react';
import {TabType} from "../../../types/movie";
import './MovieTabs.css';

interface MovieTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    isAuthenticated: boolean;
}

export const MovieTabs: React.FC<MovieTabsProps> = ({
                                                        activeTab,
                                                        onTabChange,
                                                        isAuthenticated
                                                    }) => {
    const tabs = [
        { id: 'all' as TabType, name: 'All Movies', public: true },
        { id: 'watchlist' as TabType, name: 'Watchlist', public: false },
        { id: 'favorite' as TabType, name: 'Favorite', public: false },
    ];

    return (
        <div className="movie-tabs">
            <nav className="tabs-nav">
                {tabs.map(tab => {
                    if (!tab.public && !isAuthenticated) return null;

                    return (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};