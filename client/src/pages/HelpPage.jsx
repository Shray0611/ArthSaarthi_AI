import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HelpPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [language, setLanguage] = useState('en');
    const isHindi = language === 'hi';

    const faqs = [
        {
            question: isHindi ? 'क्या मुझे आधार कार्ड की आवश्यकता है?' : 'Do I need an Aadhaar Card?',
            answer: isHindi
                ? 'नहीं, इस वेबसाइट पर योजनाओं को खोजने या ब्राउज़ करने के लिए आपको आधार की आवश्यकता नहीं है।'
                : 'No, you do not need Aadhaar to search or browse schemes on this website. You will only need it when applying on the official government portal.',
        },
        {
            question: isHindi ? 'क्या मेरी जानकारी सुरक्षित है?' : 'Is my data safe?',
            answer: isHindi
                ? 'हाँ! हम आपकी जानकारी को संग्रहीत नहीं करते हैं।'
                : 'Yes. We do not store your personal profile data. It is processed anonymously to find relevant schemes and discarded after your session.',
        },
        {
            question: isHindi ? 'क्या यह जानकारी सटीक है?' : 'Is this information accurate?',
            answer: isHindi
                ? 'हमारा AI नवीनतम सरकारी दिशानिर्देशों के आधार पर जानकारी प्रदान करता है। आवेदन करने से पहले आधिकारिक वेबसाइट जांचें।'
                : 'Our AI provides information based on the latest government guidelines. However, policies can change — always check the official source link before applying.',
        },
        {
            question: isHindi ? 'दस्तावेज़ सत्यापन कैसे करें?' : 'How do I verify my documents?',
            answer: isHindi
                ? 'आप अपने निकटतम कॉमन सर्विस सेंटर (CSC) पर जाकर दस्तावेज़ सत्यापन करवा सकते हैं।'
                : 'Visit your nearest Common Service Center (CSC). We have a CSC Locator link on the home results page.',
        },
        {
            question: isHindi ? 'मैं कितनी भाषाओं में खोज कर सकता हूं?' : 'What languages are supported?',
            answer: isHindi
                ? 'वर्तमान में हम अंग्रेजी (English) और हिंदी (Hindi) का समर्थन करते हैं।'
                : 'We currently support English and Hindi. Use the language toggle in the navigation bar to switch.',
        },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column' }}>
            <Header language={language} setLanguage={setLanguage} />

            <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80 }}>
                <div className="container-dialog" style={{ maxWidth: 720, margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16,
                            background: 'var(--color-snow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: 'var(--shadow-subtle)',
                        }}>
                            <HelpCircle size={24} color="var(--color-graphite)" />
                        </div>
                        <h1 className="headline-lg" style={{ marginBottom: 16 }}>
                            {isHindi ? 'सहायता और FAQ' : 'Help & FAQ'}
                        </h1>
                        <p style={{ fontSize: 18, color: 'var(--color-stone)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
                            {isHindi
                                ? 'पात्रता, दस्तावेज़ और सुरक्षा से जुड़े सवालों के जवाब यहाँ पाएं।'
                                : 'Find answers to common questions about eligibility, documents, and data privacy.'}
                        </p>
                    </div>

                    {/* Accordion */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="card"
                                style={{
                                    padding: 0, overflow: 'hidden',
                                    borderRadius: 16,
                                    border: openIndex === idx ? '1px solid rgba(246,146,81,0.2)' : '1px solid transparent',
                                    boxShadow: openIndex === idx
                                        ? 'rgba(246,146,81,0.08) 0px 0px 0px 3px'
                                        : 'var(--shadow-subtle)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    style={{
                                        width: '100%', padding: '20px 24px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <span style={{
                                        fontSize: 16, fontWeight: 400,
                                        color: openIndex === idx ? 'var(--color-carbon)' : 'var(--color-midnight-ink)',
                                        letterSpacing: '-0.01em',
                                        fontFamily: 'var(--font-display)',
                                    }}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        color="var(--color-stone)"
                                        style={{
                                            transform: openIndex === idx ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s',
                                            flexShrink: 0, marginLeft: 16,
                                        }}
                                    />
                                </button>

                                <div style={{
                                    maxHeight: openIndex === idx ? 200 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease',
                                }}>
                                    <div style={{
                                        padding: '0 24px 20px',
                                        borderTop: '1px solid rgba(0,0,0,0.05)',
                                        paddingTop: 16,
                                    }}>
                                        <p style={{
                                            fontSize: 15, color: 'var(--color-stone)',
                                            lineHeight: 1.6, letterSpacing: '-0.01em',
                                        }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer card */}
                    <div className="card" style={{
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                        borderLeft: '3px solid var(--color-tangerine-tag)',
                    }}>
                        <Info size={18} color="var(--color-tangerine-tag)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 400,
                                fontSize: 16, letterSpacing: '-0.02em', marginBottom: 8,
                                color: 'var(--color-carbon)',
                            }}>
                                {isHindi ? 'AI अस्वीकरण' : 'AI Accuracy Disclaimer'}
                            </h3>
                            <p style={{ fontSize: 14, color: 'var(--color-stone)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
                                {isHindi
                                    ? 'यह उपकरण AI का उपयोग करता है। आवेदन करने से पहले आधिकारिक सरकारी अधिसूचनाओं को सत्यापित करें।'
                                    : 'This tool uses Artificial Intelligence to recommend schemes. While we strive for accuracy, please verify official government notifications before applying for any benefits.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default HelpPage;
