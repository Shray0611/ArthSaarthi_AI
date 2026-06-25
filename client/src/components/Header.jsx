import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, X, Loader2, Menu } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { AnimatePresence } from 'framer-motion';

const Header = ({ language, setLanguage, t }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { getToken, isSignedIn } = useAuth();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navStyle = {
        position: 'fixed',
        top: scrolled ? 8 : 14,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 40px)',
        maxWidth: 1100,
        background: '#ffffff',
        borderRadius: 32,
        boxShadow: scrolled
            ? '0 4px 20px rgba(0,0,0,0.12)'
            : '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        gap: 12,
        transition: 'top 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <header style={{ height: 70 }}>
            <div className="header-pill-mobile" style={navStyle}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{
                        width: 34, height: 34,
                        background: '#181825',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <ShieldCheck size={18} color="#ffffff" />
                    </div>
                    <span style={{
                        fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif",
                        fontWeight: 600,
                        fontSize: 18,
                        letterSpacing: '-0.5px',
                        color: '#111111',
                    }}>
                        Scheme<span style={{ color: '#f69251' }}>.AI</span>
                    </span>
                </Link>

                {/* Center Nav */}
                <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[
                        { label: language === 'hi' ? 'होम' : 'Home', to: '/' },
                        { label: language === 'hi' ? 'सहेजे गए' : 'Saved', to: '/saved-schemes', signedIn: true },
                        { label: language === 'hi' ? 'मदद' : 'Help', to: '/help' },
                    ].map((item) => {
                        if (item.signedIn && !isSignedIn) return null;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                style={{
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: isActive(item.to) ? '#111111' : '#636363',
                                    textDecoration: 'none',
                                    padding: '6px 13px',
                                    borderRadius: 20,
                                    background: isActive(item.to) ? '#f7f7f7' : 'transparent',
                                    transition: 'color 0.15s, background 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#111111';
                                    if (!isActive(item.to)) e.currentTarget.style.background = '#f7f7f7';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = isActive(item.to) ? '#111111' : '#636363';
                                    if (!isActive(item.to)) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {/* Language toggle */}
                    <select
                        value={language}
                        onChange={(e) => {
                            const newLang = e.target.value;
                            if (setLanguage) setLanguage(newLang);
                            try { localStorage.setItem('hs_lang', newLang); } catch {}
                        }}
                        style={{
                            padding: '6px 12px',
                            background: '#f7f7f7',
                            border: '1.5px solid rgba(0,0,0,0.09)',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#484758',
                            cursor: 'pointer',
                            fontFamily: "'Inter', system-ui, sans-serif",
                            outline: 'none',
                            appearance: 'auto'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="bn">বাংলা</option>
                        <option value="te">తెలుగు</option>
                        <option value="mr">मराठी</option>
                        <option value="ta">தமிழ்</option>
                    </select>

                    {/* Auth */}
                    <SignedOut>
                        <Link to="/sign-in" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
                            {language === 'hi' ? 'साइन इन' : 'Login'}
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="show-on-mobile"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {mobileMenuOpen ? <X size={24} color="#111111" /> : <Menu size={24} color="#111111" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 80,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'calc(100% - 40px)',
                        maxWidth: 400,
                        background: '#ffffff',
                        borderRadius: 20,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        padding: 16,
                        zIndex: 99,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                        {[
                            { label: language === 'hi' ? 'होम' : 'Home', to: '/' },
                            { label: language === 'hi' ? 'सहेजे गए' : 'Saved', to: '/saved-schemes', signedIn: true },
                            { label: language === 'hi' ? 'मदद' : 'Help', to: '/help' },
                        ].map((item) => {
                            if (item.signedIn && !isSignedIn) return null;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: isActive(item.to) ? '#111111' : '#636363',
                                        textDecoration: 'none',
                                        padding: '12px 16px',
                                        borderRadius: 12,
                                        background: isActive(item.to) ? '#f7f7f7' : 'transparent',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
