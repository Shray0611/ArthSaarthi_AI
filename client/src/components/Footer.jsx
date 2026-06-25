import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--color-snow)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            padding: '48px 0 32px',
            marginTop: 80,
        }}>
            <div className="container-dialog">
                <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'flex-start',
                    gap: 40, marginBottom: 48,
                }}>
                    {/* Brand */}
                    <div style={{ maxWidth: 300 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 32, height: 32, background: 'var(--color-midnight-ink)',
                                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ShieldCheck size={16} color="white" />
                            </div>
                            <span style={{
                                fontFamily: 'var(--font-display)', fontWeight: 500,
                                fontSize: 18, letterSpacing: '-0.03em', color: 'var(--color-carbon)',
                            }}>
                                Scheme<span style={{ color: 'var(--color-tangerine-tag)' }}>.AI</span>
                            </span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--color-stone)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
                            AI-powered government scheme discovery for every Indian citizen. Find schemes you're eligible for in seconds.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-pebble)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
                                Product
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Home', href: '/' },
                                    { label: 'Saved Schemes', href: '/saved-schemes' },
                                    { label: 'Help & FAQ', href: '/help' },
                                ].map(link => (
                                    <Link key={link.href} to={link.href} style={{
                                        fontSize: 14, color: 'var(--color-stone)',
                                        textDecoration: 'none', letterSpacing: '-0.01em',
                                        transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-carbon)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-stone)'}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-pebble)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
                                Resources
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'MyScheme Portal', href: 'https://www.myscheme.gov.in', external: true },
                                    { label: 'Find CSC Center', href: 'https://locator.csccloud.in/', external: true },
                                ].map(link => (
                                    <a key={link.href} href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        style={{
                                            fontSize: 14, color: 'var(--color-stone)',
                                            textDecoration: 'none', letterSpacing: '-0.01em',
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            transition: 'color 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-carbon)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-stone)'}
                                    >
                                        {link.label}
                                        {link.external && <ArrowUpRight size={12} />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    paddingTop: 24,
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center', gap: 16,
                }}>
                    <p style={{ fontSize: 12, color: 'var(--color-pebble)', letterSpacing: '-0.01em' }}>
                        © {year} Scheme.AI — All rights reserved.
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-pebble)', letterSpacing: '-0.01em' }}>
                        Data sourced from official Government of India portals.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
