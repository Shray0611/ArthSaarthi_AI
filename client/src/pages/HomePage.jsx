import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InputForm from '../components/InputForm';
import ResultsSection from '../components/ResultsSection';
import Disclaimer from '../components/Disclaimer';
import HowItWorks from '../components/HowItWorks';
import { recommendSchemes } from '../api';
import { translations } from '../translations';
import SchemeAnalytics from '../components/SchemeAnalytics';
import TrustSection from '../components/TrustSection';
import { useUser, useAuth } from '@clerk/clerk-react';
import { MapPin, Loader2, Zap, Shield, Search } from 'lucide-react';

/* ─── Hero feature chips ──────────────────────────────────────── */
const features = [
    { icon: <Zap size={14} color="#f69251" />, label: 'Instant AI matching' },
    { icon: <Shield size={14} color="#f69251" />, label: 'No Aadhaar needed' },
    { icon: <Search size={14} color="#f69251" />, label: '842 schemes indexed' },
];

/* ─── Stats ───────────────────────────────────────────────────── */
const stats = [
    { value: '300+', label: 'Citizens Helped' },
    { value: '842', label: 'Schemes Indexed' },
    { value: '24/7', label: 'AI Support' },
];

/* ─── HomePage ────────────────────────────────────────────────── */
function HomePage() {
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [schemes, setSchemes] = useState(() => {
        try { const s = sessionStorage.getItem('hs_schemes'); return s ? JSON.parse(s) : []; } catch { return []; }
    });
    const [generalAdvice, setGeneralAdvice] = useState(() => {
        try { const s = sessionStorage.getItem('hs_advice'); return s ? JSON.parse(s) : []; } catch { return []; }
    });
    const [userProfile, setUserProfile] = useState(() => {
        try { const s = sessionStorage.getItem('hs_profile'); return s ? JSON.parse(s) : null; } catch { return null; }
    });
    const [showResults, setShowResults] = useState(() => {
        try { return sessionStorage.getItem('hs_show') === 'true'; } catch { return false; }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState(() => {
        try { return localStorage.getItem('hs_lang') || 'en'; } catch { return 'en'; }
    });
    const t = translations[language] || {};

    // Remove the wipe on mount, let state persist from sessionStorage!

    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        setShowResults(false);
        setUserProfile(formData);
        try {
            const token = await getToken();
            const data = await recommendSchemes({ ...formData, language, userId: user?.id }, token);
            if (data.schemes && data.schemes.length > 0) {
                setSchemes(data.schemes);
                setGeneralAdvice(data.generalAdvice || []);
                setShowResults(true);
                setHasMore(true);
                try {
                    sessionStorage.setItem('hs_schemes', JSON.stringify(data.schemes));
                    sessionStorage.setItem('hs_advice', JSON.stringify(data.generalAdvice || []));
                    sessionStorage.setItem('hs_profile', JSON.stringify(formData));
                    sessionStorage.setItem('hs_show', 'true');
                } catch { /* ignore */ }
                setTimeout(() => {
                    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                setError('No schemes found. Try adjusting your details.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch recommendations. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (isLoadingMore || !userProfile) return;
        setIsLoadingMore(true);
        try {
            const token = await getToken();
            const excludeSchemes = schemes.map(s => s.name);
            const data = await recommendSchemes({ ...userProfile, language, userId: user?.id, excludeSchemes }, token);
            if (data.schemes && data.schemes.length > 0) {
                const next = [...schemes, ...data.schemes];
                setSchemes(next);
                try { sessionStorage.setItem('hs_schemes', JSON.stringify(next)); } catch { /* ignore */ }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleClearSearch = () => {
        setSchemes([]);
        setGeneralAdvice([]);
        setShowResults(false);
        setUserProfile(null);
        try {
            sessionStorage.removeItem('hs_schemes');
            sessionStorage.removeItem('hs_advice');
            sessionStorage.removeItem('hs_profile');
            sessionStorage.removeItem('hs_show');
        } catch { /* ignore */ }
    };

    const hi = language === 'hi';

    return (
        <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
            <Header language={language} setLanguage={setLanguage} t={t} />

            {/* ══ HERO ════════════════════════════════════════════ */}
            <section style={{ paddingTop: 100, paddingBottom: 80, background: '#f7f7f7' }}>
                <div className="container-dialog" style={{ textAlign: 'center' }}>

                    {/* Feature chips row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
                        {features.map((f, i) => (
                            <span key={i} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '6px 14px', background: '#ffffff',
                                border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 100,
                                fontSize: 12, fontWeight: 500, color: '#484758',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                            }}>
                                {f.icon}
                                {f.label}
                            </span>
                        ))}
                    </div>

                    {/* Main headline */}
                    <h1 className="hero-headline-mobile" style={{
                        fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(34px, 5vw, 64px)',
                        lineHeight: 1.08,
                        letterSpacing: '-2px',
                        color: '#111111',
                        margin: '0 auto 20px',
                        maxWidth: 760,
                    }}>
                        {hi ? 'अपनी सरकारी योजनाएं' : 'Find government schemes'}
                        <br />
                        <span style={{ color: '#f69251' }}>
                            {hi ? 'AI से खोजें।' : 'made for you.'}
                        </span>
                    </h1>

                    {/* Sub headline */}
                    <p style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(15px, 1.8vw, 18px)',
                        lineHeight: 1.7,
                        color: '#555555',
                        maxWidth: 500,
                        margin: '0 auto 44px',
                    }}>
                        {hi
                            ? 'AI तुरंत आपकी प्रोफाइल से मेल खाने वाली सरकारी योजनाएं खोजता है।'
                            : 'Stop guessing your eligibility. Our AI instantly matches your profile to hundreds of government grants and subsidies.'}
                    </p>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
                        {isSignedIn ? (
                            <button
                                className="btn-primary"
                                style={{ fontSize: 16, padding: '15px 40px' }}
                                onClick={() => document.getElementById('find-schemes')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                {hi ? 'योजनाएं खोजें →' : 'Find My Schemes →'}
                            </button>
                        ) : (
                            <>
                                <a href="/sign-up" className="btn-primary" style={{ fontSize: 15, padding: '14px 36px' }}>
                                    {hi ? 'अभी शुरू करें →' : 'Get Started Free →'}
                                </a>
                                <a href="/sign-in" className="btn-ghost" style={{ fontSize: 14 }}>
                                    {hi ? 'साइन इन' : 'Sign In'}
                                </a>
                            </>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="hero-stats-mobile" style={{
                        display: 'inline-flex', flexWrap: 'wrap',
                        background: '#ffffff',
                        borderRadius: 20,
                        border: '1px solid rgba(0,0,0,0.07)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                    }}>
                        {stats.map((s, i) => (
                            <div className="hero-stat-item-mobile" key={i} style={{
                                padding: '24px 36px',
                                textAlign: 'center',
                                borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                minWidth: 130,
                            }}>
                                <div style={{
                                    fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
                                    fontWeight: 700,
                                    fontSize: 28,
                                    letterSpacing: '-1px',
                                    color: i === 1 ? '#f69251' : '#111111',
                                    lineHeight: 1,
                                    marginBottom: 6,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    fontSize: 12,
                                    color: '#888888',
                                    fontWeight: 400,
                                }}>
                                    {hi ? (i === 0 ? 'नागरिकों की मदद' : i === 1 ? 'योजनाएं इंडेक्स' : 'AI सपोर्ट') : s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ════════════════════════════════════ */}
            <HowItWorks language={language} t={t} />

            {/* ══ TRUST ═══════════════════════════════════════════ */}
            <TrustSection language={language} t={t} />

            {/* ══ FORM / CTA GATE ═════════════════════════════════ */}
            {isSignedIn ? (
                <InputForm
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    language={language}
                    t={t}
                />
            ) : (
                <section style={{ background: '#ffffff', padding: '80px 0' }}>
                    <div className="container-dialog" style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
                            fontWeight: 700,
                            fontSize: 'clamp(26px, 3.5vw, 40px)',
                            letterSpacing: '-1px',
                            color: '#111111',
                            marginBottom: 16,
                        }}>
                            {hi ? 'योजनाएं खोजने के लिए साइन इन करें' : 'Create a free account to get started'}
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: 17, color: '#636363',
                            maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.65,
                        }}>
                            {hi
                                ? 'अपनी प्रोफाइल के अनुसार व्यक्तिगत योजना सिफारिशें प्राप्त करें।'
                                : 'Sign in to receive personalized government scheme recommendations.'}
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/sign-up" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
                                {hi ? 'अकाउंट बनाएं →' : 'Create Free Account →'}
                            </a>
                            <a href="/sign-in" className="btn-ghost" style={{ fontSize: 14 }}>
                                {hi ? 'साइन इन' : 'Sign In'}
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* ══ ERROR ═══════════════════════════════════════════ */}
            {error && (
                <div className="container-dialog" style={{ padding: '0 0 32px' }}>
                    <div style={{
                        background: '#fff0f0', border: '1px solid rgba(200,80,80,0.2)',
                        borderRadius: 12, padding: '14px 20px',
                        color: '#c04040', fontSize: 14,
                        fontFamily: 'Inter, system-ui, sans-serif',
                    }}>
                        ⚠️ {error}
                    </div>
                </div>
            )}

            {/* ══ RESULTS ═════════════════════════════════════════ */}
            {showResults && (
                <section id="results" style={{ background: '#f7f7f7', padding: '64px 0', scrollMarginTop: 80 }}>
                    <div className="container-dialog">
                        <SchemeAnalytics schemes={schemes} language={language} />
                        <ResultsSection schemes={schemes} generalAdvice={generalAdvice} language={language} t={t} />

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, gap: 12 }}>
                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="btn-ghost"
                                    style={{ fontSize: 14, padding: '12px 28px', opacity: isLoadingMore ? 0.6 : 1 }}
                                >
                                    {isLoadingMore
                                        ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</>
                                        : (hi ? 'और लोड करें' : 'Load More Recommendations')
                                    }
                                </button>
                            )}
                            <button
                                onClick={handleClearSearch}
                                className="btn-ghost"
                                style={{ fontSize: 14, padding: '12px 28px', color: 'var(--color-stone)' }}
                            >
                                {hi ? 'खोज साफ़ करें' : 'Clear Search'}
                            </button>
                        </div>

                        {/* Where to apply */}
                        <div style={{
                            marginTop: 48, background: '#ffffff',
                            borderRadius: 20, padding: '36px 40px',
                            textAlign: 'center',
                            borderLeft: '4px solid #f69251',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <h2 style={{
                                fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
                                fontWeight: 700, fontSize: 24,
                                color: '#111111', marginBottom: 12, letterSpacing: '-0.5px',
                            }}>
                                {hi ? 'आवेदन कहां करें?' : 'Where to Apply?'}
                            </h2>
                            <p style={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                fontSize: 15, color: '#636363',
                                maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.65,
                            }}>
                                {hi
                                    ? 'निकटतम CSC केंद्र पर जाकर आवेदन करें या दस्तावेज़ सत्यापित करें।'
                                    : 'Visit your nearest Common Service Center (CSC) to apply for these schemes or get document verification help.'}
                            </p>
                            <a
                                href="https://locator.csccloud.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ fontSize: 14 }}
                            >
                                <MapPin size={15} />
                                {hi ? 'CSC केंद्र खोजें' : 'Find Official CSC Center'}
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* ══ DISCLAIMER ══════════════════════════════════════ */}
            <div style={{ background: '#f7f7f7', padding: '32px 0 0' }}>
                <div className="container-dialog">
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 32 }}>
                        <Disclaimer t={t} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default HomePage;
