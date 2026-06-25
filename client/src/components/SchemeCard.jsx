import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ExternalLink, MessageSquare, Send,
    Share2, Bookmark, BookmarkCheck, Trash2, Check, Download, Loader2
} from 'lucide-react';
import { chatWithScheme, saveScheme, updateSchemeProgress, submitVerifiedLink, translateSchemeAPI } from '../api';
import { useUser } from '@clerk/clerk-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SchemeCard = ({ 
    scheme, index, t, language, 
    initialSavedState = false, onRemove,
    savedSchemeId, progress = {}, onCompareToggle, isSelectedForCompare = false, compareMode = false
}) => {
    const { user } = useUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(initialSavedState);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    // PDF Generation State
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');
    const [isDownloading, setIsDownloading] = useState(false);
    const [translatedScheme, setTranslatedScheme] = useState(null);

    // Progress state
    const [localProgress, setLocalProgress] = useState(progress);

    const handleProgressToggle = async (item) => {
        if (!initialSavedState || !savedSchemeId) return;
        const newState = { ...localProgress, [item]: !localProgress[item] };
        setLocalProgress(newState);
        try {
            await updateSchemeProgress(savedSchemeId, newState);
        } catch (err) {
            console.error("Failed to update progress", err);
            // Revert on failure
            setLocalProgress(localProgress);
        }
    };

    const handleLinkSubmit = async () => {
        const url = prompt("Submit a verified direct application link for this scheme:");
        if (url && url.trim()) {
            try {
                await submitVerifiedLink(scheme.name, url.trim());
                alert("Thank you! Link submitted successfully. It will be used for future recommendations.");
            } catch (err) {
                alert("Failed to submit link. Please try again.");
            }
        }
    };

    const handleSaveToggle = async () => {
        if (!user) { alert("Please sign in to save schemes!"); return; }
        if (isSaved && onRemove) { onRemove(); return; }
        const wasSaved = isSaved;
        setIsSaved(true);
        try {
            await saveScheme(user.id, scheme);
        } catch (error) {
            if (error.message !== "Already saved") {
                console.error("Save failed", error);
                setIsSaved(wasSaved);
                alert("Failed to save. Please try again.");
            }
        } finally {
            setIsSaveLoading(false);
        }
    };

    const handleShare = async () => {
        const text = `Check out this government scheme: *${scheme.name}*\n\n${scheme.description}\n\nFind more at AI Government Scheme Advisor!`;
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            // Fallback for older browsers
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const userMsg = { role: 'user', content: chatInput };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);
        try {
            const data = await chatWithScheme(scheme, userMsg.content, language);
            setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleDownloadConfirm = async () => {
        setIsDownloading(true);
        try {
            // ALWAYS call the translation API so it can EXPAND the description to 10-15 lines,
            // even if the language is English.
            const res = await translateSchemeAPI(scheme, selectedLanguage);
            const schemeToPrint = res.translatedScheme || scheme;
            
            setTranslatedScheme(schemeToPrint);
            
            // Wait for React to render the hidden component
            setTimeout(async () => {
                const safeName = scheme.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
                const element = document.getElementById(`pdf-template-${safeName}`);
                if (element) {
                    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${safeName}_dossier.pdf`);
                }
                setIsDownloading(false);
                setShowDownloadModal(false);
                setTranslatedScheme(null);
            }, 800);

        } catch (err) {
            console.error("Translation/Download failed:", err);
            alert("Failed to generate PDF. Please try again.");
            setIsDownloading(false);
        }
    };

    const hasUrl = scheme.application_url && scheme.application_url !== 'N/A';
    const linkUrl = hasUrl
        ? scheme.application_url
        : `https://www.google.com/search?q=${encodeURIComponent(scheme.name + ' official website apply online')}`;

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="card"
            style={{
                padding: 0, overflow: 'hidden',
                borderRadius: 'var(--radius-cards)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            }}
        >
            {/* Main Card Content */}
            <div style={{ padding: 24 }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                            <span className={scheme.type === 'Central' ? 'badge-central' : 'badge-state'}>
                                {scheme.type === 'Central' ? (t?.central || 'Central') : (t?.state || 'State')}
                            </span>
                            {scheme.deadline &&
                                !['n/a', 'varies', 'check', 'unknown', 'various'].some(bad => scheme.deadline.toLowerCase().includes(bad)) && (
                                    <span style={{
                                        fontSize: 11, padding: '2px 8px',
                                        background: 'rgba(201,123,132,0.1)',
                                        color: 'var(--color-dusty-rose)',
                                        borderRadius: 100,
                                        border: '1px solid rgba(201,123,132,0.2)',
                                    }}>
                                        ⏳ {scheme.deadline === 'Open' ? (language === 'hi' ? 'खुला है' : 'Open') : scheme.deadline}
                                    </span>
                                )}
                        </div>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 400,
                            fontSize: 18,
                            letterSpacing: '-0.02em',
                            color: 'var(--color-carbon)',
                            lineHeight: 1.3,
                            marginBottom: 0,
                        }}>
                            {scheme.name}
                        </h3>
                    </div>

                    {/* Right side actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, marginLeft: 16, flexShrink: 0 }}>
                        {initialSavedState && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <input 
                                    type="checkbox" 
                                    checked={isSelectedForCompare} 
                                    onChange={onCompareToggle} 
                                    id={`compare-${scheme.name}`}
                                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-tangerine-tag)' }}
                                />
                                <label htmlFor={`compare-${scheme.name}`} style={{ fontSize: 12, color: 'var(--color-stone)', cursor: 'pointer' }}>Compare</label>
                            </div>
                        )}
                        {!initialSavedState && (
                            <span className="match-pill">
                                <strong>{scheme.usefulnessScore}%</strong> {t?.match || 'match'}
                            </span>
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={handleShare} title={isCopied ? 'Copied!' : (t?.share || 'Share')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                {isCopied ? <Check size={16} color="var(--color-tangerine-tag)" /> : <Share2 size={16} color="var(--color-ash)" />}
                            </button>
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={handleSaveToggle}
                                disabled={isSaveLoading || isSaved}
                                title={isSaved ? "Saved" : "Save Scheme"}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                            >
                                {initialSavedState ? (
                                    <Trash2 size={18} color="var(--color-ash)" />
                                ) : isSaved ? (
                                    <BookmarkCheck size={18} color="var(--color-tangerine-tag)" style={{ fill: 'var(--color-tangerine-tag)' }} />
                                ) : (
                                    <Bookmark size={18} color="var(--color-ash)" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {scheme.categoryTags && scheme.categoryTags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                        {scheme.categoryTags.map((tag, idx) => (
                            <span key={idx} className="tag-chip">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Description */}
                <p style={{
                    fontSize: 14, color: 'var(--color-stone)', lineHeight: 1.6,
                    letterSpacing: '-0.01em', marginBottom: 20,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {scheme.description}
                </p>

                {/* Action row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 13, fontWeight: 500, color: 'var(--color-stone)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            letterSpacing: '-0.01em', padding: 0,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-carbon)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-stone)'}
                    >
                        {isExpanded ? (t?.showLess || 'Show less') : (t?.viewDetails || 'View details')}
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={14} />
                        </motion.div>
                    </button>

                    <button
                        onClick={() => setShowDownloadModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 13, fontWeight: 500, color: 'var(--color-stone)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            letterSpacing: '-0.01em', padding: 0,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-carbon)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-stone)'}
                    >
                        <Download size={14} />
                        {t?.print || 'Download PDF'}
                    </button>

                    <button
                        onClick={() => setShowChat(!showChat)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 13, fontWeight: 500,
                            color: showChat ? 'var(--color-tangerine-tag)' : 'var(--color-stone)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            letterSpacing: '-0.01em', padding: 0,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { if (!showChat) e.currentTarget.style.color = 'var(--color-carbon)'; }}
                        onMouseLeave={e => { if (!showChat) e.currentTarget.style.color = 'var(--color-stone)'; }}
                    >
                        <MessageSquare size={14} />
                        {t?.askAI || 'Ask AI'}
                    </button>

                    <button 
                        onClick={handleLinkSubmit}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 12, fontWeight: 500, color: 'var(--color-stone)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            textDecoration: 'underline', textDecorationStyle: 'dotted'
                        }}
                    >
                        Submit Better Link
                    </button>

                    <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                            marginLeft: 'auto',
                            padding: '7px 16px',
                            fontSize: 13,
                            background: hasUrl ? 'var(--color-tangerine-tag)' : 'var(--color-fog)',
                            color: hasUrl ? 'var(--color-carbon)' : 'var(--color-stone)',
                        }}
                    >
                        <ExternalLink size={13} />
                        {hasUrl
                            ? (language === 'hi' ? 'आवेदन करें' : 'Apply Now')
                            : (language === 'hi' ? 'खोजें' : 'Search to Apply')
                        }
                    </a>
                </div>
            </div>

            {/* AI Chat Section */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            borderTop: '1px solid rgba(0,0,0,0.06)',
                            background: 'var(--color-fog)',
                            padding: 20,
                        }}>
                            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-pebble)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
                                {t?.chatTitle || 'Ask about this scheme'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto', marginBottom: 14 }}>
                                {chatHistory.length === 0 && (
                                    <p style={{ fontSize: 13, color: 'var(--color-pebble)', fontStyle: 'italic' }}>
                                        {t?.chatPlaceholder || 'Ask anything about eligibility, benefits, or how to apply...'}
                                    </p>
                                )}
                                {chatHistory.map((msg, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ maxWidth: '85%' }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div className="chat-bubble-ai" style={{ display: 'flex', gap: 4 }}>
                                            {[0, 1, 2].map(i => (
                                                <span key={i} style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: 'var(--color-ash)',
                                                    animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="text" value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    placeholder={t?.typeQuestion || 'Type your question...'}
                                    className="input-box"
                                    style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim() || isChatLoading}
                                    className="btn-primary"
                                    style={{ padding: '10px 16px', opacity: (!chatInput.trim() || isChatLoading) ? 0.5 : 1 }}
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            borderTop: '1px solid rgba(0,0,0,0.06)',
                            padding: '24px',
                            display: 'flex', flexDirection: 'column', gap: 24,
                        }}>
                            {/* Detail section helper */}
                            {[
                                { num: '1', label: t?.eligibility || 'Eligibility', items: scheme.eligibilitySummary },
                                scheme.benefits && scheme.benefits.length > 0 && { num: '2', label: t?.benefits || 'Benefits', items: scheme.benefits },
                                { num: '3', label: t?.documents || 'Documents', items: scheme.requiredDocuments, chips: true },
                                { num: '4', label: t?.steps || 'Application Steps', items: scheme.applicationSteps, numbered: true },
                            ].filter(Boolean).map((section) => (
                                <div key={section.num} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{
                                            width: 22, height: 22, borderRadius: 6,
                                            background: 'var(--color-fog)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11, fontWeight: 500, color: 'var(--color-stone)',
                                            flexShrink: 0,
                                        }}>
                                            {section.num}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-stone)', letterSpacing: '-0.01em', paddingTop: 3 }}>
                                            {section.label}
                                        </span>
                                    </div>

                                    <div style={{
                                        background: 'var(--color-fog)',
                                        borderRadius: 12,
                                        padding: '14px 16px',
                                    }}>
                                        {section.chips ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {section.items.map((item, i) => (
                                                    initialSavedState ? (
                                                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-snow)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-fog)', cursor: 'pointer' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={!!localProgress[item]} 
                                                                onChange={() => handleProgressToggle(item)}
                                                                style={{ accentColor: 'var(--color-tangerine-tag)' }}
                                                            />
                                                            <span style={{ fontSize: 13, color: localProgress[item] ? 'var(--color-pebble)' : 'var(--color-carbon)', textDecoration: localProgress[item] ? 'line-through' : 'none' }}>
                                                                {item}
                                                            </span>
                                                        </label>
                                                    ) : (
                                                        <span key={i} className="tag-chip">{item}</span>
                                                    )
                                                ))}
                                            </div>
                                        ) : section.numbered ? (
                                            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {section.items.map((item, i) => (
                                                    <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--color-midnight-ink)', lineHeight: 1.5, alignItems: 'center' }}>
                                                        {initialSavedState ? (
                                                            <input 
                                                                type="checkbox" 
                                                                checked={!!localProgress[item]} 
                                                                onChange={() => handleProgressToggle(item)}
                                                                style={{ accentColor: 'var(--color-tangerine-tag)', cursor: 'pointer', flexShrink: 0 }}
                                                            />
                                                        ) : (
                                                            <span style={{
                                                                width: 20, height: 20, borderRadius: 6,
                                                                background: 'var(--color-snow)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: 11, fontWeight: 500, color: 'var(--color-stone)',
                                                                flexShrink: 0, boxShadow: 'var(--shadow-subtle)',
                                                            }}>
                                                                {i + 1}
                                                            </span>
                                                        )}
                                                        <span style={{ color: localProgress[item] ? 'var(--color-pebble)' : 'var(--color-midnight-ink)', textDecoration: localProgress[item] ? 'line-through' : 'none' }}>
                                                            {item}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {section.items.map((item, i) => (
                                                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--color-midnight-ink)', lineHeight: 1.5 }}>
                                                        <span style={{ color: 'var(--color-tangerine-tag)', flexShrink: 0, marginTop: 2 }}>›</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

            {/* Download Modal */}
            <AnimatePresence>
                {showDownloadModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '90%', maxWidth: 400 }}>
                            <h3 style={{ marginTop: 0, marginBottom: 8, color: '#111' }}>Download Scheme PDF</h3>
                            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Select the language for your PDF document:</p>
                            <select 
                                value={selectedLanguage} 
                                onChange={e => setSelectedLanguage(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: 20, borderRadius: 8, border: '1px solid #ccc', outline: 'none' }}
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="bn">বাংলা (Bengali)</option>
                                <option value="te">తెలుగు (Telugu)</option>
                                <option value="mr">मराठी (Marathi)</option>
                                <option value="ta">தமிழ் (Tamil)</option>
                            </select>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowDownloadModal(false)} className="btn-ghost" disabled={isDownloading} style={{ padding: '8px 16px', fontSize: 13 }}>Cancel</button>
                                <button onClick={handleDownloadConfirm} className="btn-primary" disabled={isDownloading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, background: 'var(--color-tangerine-tag)' }}>
                                    {isDownloading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={16} /> : <Download size={16} />}
                                    {isDownloading ? 'Translating...' : 'Generate PDF'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden PDF Template */}
            {translatedScheme && (
                <div 
                    id={`pdf-template-${scheme.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}`}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: 0,
                        width: '800px',
                        background: '#ffffff',
                        padding: '40px',
                        fontFamily: "'Inter', sans-serif",
                        color: '#111111'
                    }}
                >
                    <h1 style={{ fontSize: '28px', borderBottom: '2px solid #f69251', paddingBottom: '10px', marginBottom: '16px' }}>
                        {translatedScheme.name}
                    </h1>
                    <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
                        {translatedScheme.description}
                    </p>
                    
                    {translatedScheme.eligibilitySummary && translatedScheme.eligibilitySummary.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '18px', color: '#f69251', marginTop: '20px', marginBottom: '10px' }}>Eligibility</h3>
                            <ul style={{ fontSize: '14px', paddingLeft: '20px', color: '#333', lineHeight: 1.5 }}>
                                {translatedScheme.eligibilitySummary.map((item, i) => <li key={i} style={{marginBottom:'6px'}}>{item}</li>)}
                            </ul>
                        </>
                    )}

                    {translatedScheme.requiredDocuments && translatedScheme.requiredDocuments.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '18px', color: '#f69251', marginTop: '20px', marginBottom: '10px' }}>Required Documents</h3>
                            <ul style={{ fontSize: '14px', paddingLeft: '20px', color: '#333', lineHeight: 1.5 }}>
                                {translatedScheme.requiredDocuments.map((item, i) => <li key={i} style={{marginBottom:'6px'}}>{item}</li>)}
                            </ul>
                        </>
                    )}

                    {translatedScheme.applicationSteps && translatedScheme.applicationSteps.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '18px', color: '#f69251', marginTop: '20px', marginBottom: '10px' }}>Application Steps</h3>
                            <ol style={{ fontSize: '14px', paddingLeft: '20px', color: '#333', lineHeight: 1.5 }}>
                                {translatedScheme.applicationSteps.map((item, i) => <li key={i} style={{marginBottom:'6px'}}>{item}</li>)}
                            </ol>
                        </>
                    )}

                    <p style={{ marginTop: '40px', fontSize: '12px', color: '#888', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        Generated by Government Scheme Advisor • Official Link: {translatedScheme.application_url || 'N/A'}
                    </p>
                </div>
            )}
        </>
    );
};

export default SchemeCard;
