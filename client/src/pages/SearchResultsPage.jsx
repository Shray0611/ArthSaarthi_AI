import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { searchSchemes } from '../api';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { translations } from '../translations';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchResultsPage = ({ language: propLanguage }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    const [language, setLanguage] = useState(propLanguage || 'en');
    const t = translations[language] || translations['en'];

    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query || !isLoaded || !isSignedIn) return;
            setLoading(true);
            setError(null);
            setHasMore(true);
            try {
                const token = await getToken();
                const data = await searchSchemes(query, language, token, []);
                const fetched = data.schemes || [];
                setResults(fetched);
                if (fetched.length === 0) setHasMore(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch search results. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, language, isLoaded, isSignedIn, getToken]);

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const token = await getToken();
            const excludeNames = results.map(s => s.name);
            const data = await searchSchemes(query, language, token, excludeNames);
            const newSchemes = data.schemes || [];
            if (newSchemes.length === 0) setHasMore(false);
            else setResults(prev => [...prev, ...newSchemes]);
        } catch (err) {
            alert("Failed to load more. Please try again.");
        } finally {
            setLoadingMore(false);
        }
    };

    if (!isLoaded || (loading && !results.length)) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <Loader2 size={32} color="var(--color-tangerine-tag)" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: 15, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                    Searching for "{query}"...
                </p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 24 }}>
                <p style={{ fontSize: 18, color: 'var(--color-stone)', letterSpacing: '-0.01em', marginBottom: 8 }}>
                    Please sign in to search schemes.
                </p>
                <Link to="/sign-in" className="btn-primary">Sign In</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column' }}>
            <Header language={language} setLanguage={setLanguage} t={t} />

            <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80 }}>
                <div className="container-dialog">
                    {/* Back link */}
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: 'var(--color-stone)', textDecoration: 'none',
                        marginBottom: 40, letterSpacing: '-0.01em',
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-carbon)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-stone)'}
                    >
                        <ArrowLeft size={14} />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <div style={{ marginBottom: 48 }}>
                        <span className="badge badge-fog" style={{ marginBottom: 16 }}>
                            <Search size={12} color="var(--color-stone)" />
                            Search Results
                        </span>
                        <h1 style={{
                            fontFamily: 'var(--font-display)', fontWeight: 300,
                            fontSize: 40, letterSpacing: '-0.04em', color: 'var(--color-carbon)',
                            marginBottom: 8,
                        }}>
                            Results for "{query}"
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                            {results.length > 0
                                ? `Found ${results.length} matching scheme${results.length !== 1 ? 's' : ''}`
                                : 'No schemes found for this search.'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: 'rgba(201,123,132,0.08)',
                            border: '1px solid rgba(201,123,132,0.2)',
                            borderRadius: 12, padding: '14px 20px',
                            color: 'var(--color-dusty-rose)',
                            fontSize: 14, marginBottom: 32,
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Results */}
                    {results.length > 0 ? (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                                gap: 16, marginBottom: 40, alignItems: 'start',
                            }}>
                                {results.map((scheme, idx) => (
                                    <SchemeCard
                                        key={`${scheme.name}-${idx}`}
                                        scheme={scheme} index={idx}
                                        language={language} t={t}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="btn-ghost"
                                        style={{ fontSize: 14, padding: '11px 28px', opacity: loadingMore ? 0.6 : 1 }}
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                Loading...
                                            </>
                                        ) : 'Load More Results'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : !loading && (
                        <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 20,
                                background: 'var(--color-fog)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}>
                                <Search size={28} color="var(--color-pebble)" />
                            </div>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 300,
                                fontSize: 24, letterSpacing: '-0.02em', color: 'var(--color-carbon)',
                                marginBottom: 10,
                            }}>
                                No schemes found
                            </h3>
                            <p style={{ fontSize: 15, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                                Try searching for keywords like "Housing", "Students", or "Farmers".
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchResultsPage;
