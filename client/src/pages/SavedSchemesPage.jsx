import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getSavedSchemes, removeSavedScheme, compareSchemesAPI } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SchemeCard from '../components/SchemeCard';
import { translations } from '../translations';
import { Bookmark, Loader2, GitCompare, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SavedSchemesPage = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [savedSchemes, setSavedSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(() => {
        try { return localStorage.getItem('hs_lang') || 'en'; } catch { return 'en'; }
    });
    const t = translations[language];
    const [searchQuery, setSearchQuery] = useState('');

    // Comparison State
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const [compareResult, setCompareResult] = useState(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) { setLoading(false); return; }
        const fetchSaved = async () => {
            try {
                const data = await getSavedSchemes(user.id);
                setSavedSchemes(data);
            } catch (err) {
                console.error("Failed to load saved schemes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, [isLoaded, isSignedIn, user]);

    const handleRemove = async (id) => {
        try {
            await removeSavedScheme(id);
            setSavedSchemes(prev => prev.filter(s => s._id !== id));
            setSelectedForCompare(prev => prev.filter(sId => sId !== id));
        } catch (err) {
            console.error("Failed to remove", err);
        }
    };

    const toggleCompareSelection = (id) => {
        setSelectedForCompare(prev => {
            if (prev.includes(id)) return prev.filter(sId => sId !== id);
            if (prev.length >= 2) {
                // If 2 already selected, replace the second one
                return [prev[0], id];
            }
            return [...prev, id];
        });
    };

    const handleCompare = async () => {
        if (selectedForCompare.length !== 2) return;
        setIsComparing(true);
        const schemeA = savedSchemes.find(s => s._id === selectedForCompare[0])?.schemeData;
        const schemeB = savedSchemes.find(s => s._id === selectedForCompare[1])?.schemeData;
        try {
            const result = await compareSchemesAPI(schemeA, schemeB, language);
            setCompareResult(result);
        } catch (err) {
            alert("Failed to compare schemes.");
        } finally {
            setIsComparing(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div style={{
                minHeight: '100vh', background: 'var(--color-fog)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Loader2 size={32} color="var(--color-tangerine-tag)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column' }}>
                <Header language={language} setLanguage={setLanguage} t={t} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: 18, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                        Please sign in to view your saved schemes.
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    const filteredSchemes = savedSchemes.filter(s => 
        (s.schemeData?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.schemeData?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column' }}>
            <Header language={language} setLanguage={setLanguage} t={t} />

            <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80, position: 'relative' }}>
                <div className="container-dialog">
                    {/* Page header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <span className="badge badge-fog" style={{ marginBottom: 16 }}>
                                <Bookmark size={12} color="var(--color-tangerine-tag)" />
                                Saved
                            </span>
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 300, fontSize: 40,
                                letterSpacing: '-0.04em', color: 'var(--color-carbon)',
                                marginBottom: 8,
                            }}>
                                {language === 'hi' ? 'मेरी सुरक्षित योजनाएं' : 'My Saved Schemes'}
                            </h1>
                            <p style={{ fontSize: 16, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                                {savedSchemes.length > 0
                                    ? `${savedSchemes.length} scheme${savedSchemes.length !== 1 ? 's' : ''} saved`
                                    : 'Your bookmarked schemes appear here.'}
                            </p>
                        </div>
                        {savedSchemes.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-snow)', borderRadius: 20, padding: '8px 16px', border: '1px solid var(--color-fog)', width: '100%', maxWidth: 300 }}>
                                    <Search size={16} color="var(--color-stone)" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search saved schemes..."
                                        style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, marginLeft: 8, fontSize: 14, color: 'var(--color-carbon)' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Comparison Banner */}
                    <AnimatePresence>
                        {selectedForCompare.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{
                                    background: 'var(--color-snow)',
                                    border: '1px solid var(--color-tangerine-tag)',
                                    borderRadius: 16, padding: '16px 24px',
                                    marginBottom: 32, display: 'flex', 
                                    alignItems: 'center', justifyContent: 'space-between',
                                    boxShadow: 'var(--shadow-subtle)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <GitCompare size={20} color="var(--color-tangerine-tag)" />
                                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-carbon)' }}>
                                        {selectedForCompare.length} selected for comparison (Select 2)
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button 
                                        onClick={() => setSelectedForCompare([])}
                                        style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--color-stone)', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleCompare}
                                        disabled={selectedForCompare.length !== 2 || isComparing}
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', opacity: selectedForCompare.length !== 2 ? 0.5 : 1 }}
                                    >
                                        {isComparing ? <Loader2 size={16} className="spin" /> : 'Compare Now'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {savedSchemes.length === 0 ? (
                        <div className="card" style={{
                            textAlign: 'center', padding: '80px 40px',
                        }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 20,
                                background: 'var(--color-fog)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}>
                                <Bookmark size={28} color="var(--color-pebble)" />
                            </div>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 300,
                                fontSize: 24, letterSpacing: '-0.02em',
                                color: 'var(--color-carbon)', marginBottom: 10,
                            }}>
                                No saved schemes yet
                            </h3>
                            <p style={{ fontSize: 15, color: 'var(--color-stone)', letterSpacing: '-0.01em' }}>
                                Bookmark schemes from your results to find them here later.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                            gap: 16, alignItems: 'start',
                        }}>
                            {filteredSchemes.map((item, index) => (
                                <SchemeCard
                                    key={item._id}
                                    savedSchemeId={item._id}
                                    scheme={{ ...item.schemeData }}
                                    progress={item.progress || {}}
                                    index={index}
                                    t={t}
                                    language={language}
                                    initialSavedState={true}
                                    onRemove={() => handleRemove(item._id)}
                                    // Compare Props
                                    onCompareToggle={() => toggleCompareSelection(item._id)}
                                    isSelectedForCompare={selectedForCompare.includes(item._id)}
                                    compareMode={selectedForCompare.length > 0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Compare Result Modal */}
            <AnimatePresence>
                {compareResult && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 20
                    }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card"
                            style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: 32 }}
                        >
                            <button 
                                onClick={() => setCompareResult(null)}
                                style={{ position: 'absolute', top: 20, right: 20, background: 'var(--color-fog)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}
                            >
                                <X size={20} color="var(--color-carbon)" />
                            </button>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, marginBottom: 8 }}>AI Comparison</h2>
                            <p style={{ color: 'var(--color-stone)', marginBottom: 24 }}>{compareResult.summary}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                                <div style={{ background: 'var(--color-fog)', padding: 20, borderRadius: 16 }}>
                                    <h4 style={{ color: 'var(--color-carbon)', marginBottom: 12 }}>
                                        {savedSchemes.find(s => s._id === selectedForCompare[0])?.schemeData?.name || "Scheme A"} Pros
                                    </h4>
                                    <ul style={{ paddingLeft: 16, fontSize: 13, color: 'var(--color-stone)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {compareResult.schemeA_Pros?.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                                <div style={{ background: 'var(--color-fog)', padding: 20, borderRadius: 16 }}>
                                    <h4 style={{ color: 'var(--color-carbon)', marginBottom: 12 }}>
                                        {savedSchemes.find(s => s._id === selectedForCompare[1])?.schemeData?.name || "Scheme B"} Pros
                                    </h4>
                                    <ul style={{ paddingLeft: 16, fontSize: 13, color: 'var(--color-stone)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {compareResult.schemeB_Pros?.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ color: 'var(--color-carbon)', marginBottom: 12 }}>Overlapping Documents</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {compareResult.overlapDocuments?.map((doc, i) => (
                                        <span key={i} className="tag-chip">{doc}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'rgba(246, 146, 81, 0.1)', padding: 20, borderRadius: 16, border: '1px solid rgba(246, 146, 81, 0.2)' }}>
                                <h4 style={{ color: 'var(--color-tangerine-tag)', marginBottom: 8 }}>Verdict</h4>
                                <p style={{ fontSize: 14, color: 'var(--color-carbon)' }}>{compareResult.recommendation}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default SavedSchemesPage;
