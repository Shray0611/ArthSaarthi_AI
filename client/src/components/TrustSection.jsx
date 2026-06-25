import React from 'react';
import { ShieldCheck, Database, UserX, Building2 } from 'lucide-react';

const TrustSection = ({ language }) => {
    const isHindi = language === 'hi';

    const cards = [
        {
            icon: UserX,
            title: isHindi ? 'आधार की आवश्यकता नहीं' : 'No Aadhaar Required',
            desc: isHindi
                ? 'ब्राउज़ करने के लिए किसी भी आईडी को लिंक करने की आवश्यकता नहीं है।'
                : 'No need to link any ID just to browse and discover schemes.',
        },
        {
            icon: Database,
            title: isHindi ? 'कोई डेटा संग्रहीत नहीं' : 'No Sensitive Data Stored',
            desc: isHindi
                ? 'हम आपकी गोपनीयता का सम्मान करते हैं।'
                : 'We respect your privacy. Sensitive personal data is never saved.',
        },
        {
            icon: ShieldCheck,
            title: isHindi ? 'गुमनाम AI प्रोसेसिंग' : 'Anonymous AI Processing',
            desc: isHindi
                ? 'AI आपके नाम को जाने बिना आपकी प्रोफाइल का विश्लेषण करता है।'
                : 'AI analyzes your profile anonymously — your identity is never exposed.',
        },
        {
            icon: Building2,
            title: isHindi ? 'सरकारी डेटा स्रोत' : 'Official Gov Data Only',
            desc: isHindi
                ? 'केवल आधिकारिक स्रोतों से जानकारी।'
                : 'All scheme information is curated from official government portals.',
        },
    ];

    return (
        <section style={{ background: '#ffffff', padding: '80px 0' }}>
            <div className="container-dialog">
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 14px', background: '#f7f7f7',
                        border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 100,
                        fontSize: 12, fontWeight: 500, color: '#484758',
                        fontFamily: "'Inter', sans-serif", marginBottom: 20,
                    }}>
                        <ShieldCheck size={12} color="#f69251" />
                        {isHindi ? '100% सुरक्षित और निजी' : 'Secure & Private'}
                    </span>

                    <h2 style={{
                        fontFamily: "'Satoshi', 'Inter', sans-serif",
                        fontWeight: 500, fontSize: 'clamp(26px, 3.5vw, 40px)',
                        letterSpacing: '-0.8px', color: '#111111',
                        marginBottom: 14, lineHeight: 1.2,
                    }}>
                        {isHindi ? 'विश्वास और सुरक्षा' : 'Built on trust'}
                    </h2>

                    <p style={{
                        fontSize: 17, color: '#636363', maxWidth: 440,
                        margin: '0 auto', lineHeight: 1.65, letterSpacing: '-0.2px',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        {isHindi
                            ? 'आपकी गोपनीयता हमारी priority है।'
                            : 'Explore government schemes safely and anonymously. Your data, your control.'}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: 16,
                }}>
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: '#f7f7f7',
                                borderRadius: 20, padding: 28,
                                transition: 'transform 0.2s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: 44, height: 44, background: '#ffffff',
                                borderRadius: 12,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 18,
                                boxShadow: 'rgba(24,24,37,0.08) 0px 2px 8px -3px',
                            }}>
                                <card.icon size={20} color="#484758" />
                            </div>
                            <h3 style={{
                                fontFamily: "'Satoshi', 'Inter', sans-serif",
                                fontWeight: 500, fontSize: 17,
                                letterSpacing: '-0.3px', color: '#111111', marginBottom: 9,
                            }}>
                                {card.title}
                            </h3>
                            <p style={{
                                fontSize: 14, color: '#636363', lineHeight: 1.65,
                                letterSpacing: '-0.1px', fontFamily: "'Inter', sans-serif",
                            }}>
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
