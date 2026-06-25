import React from 'react';
import { Info } from 'lucide-react';

const Disclaimer = ({ t }) => {
    return (
        <div style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            background: 'var(--color-snow)',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 12, padding: '16px 20px',
        }}>
            <Info size={16} color="var(--color-pebble)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
                <h4 style={{
                    fontSize: 13, fontWeight: 500,
                    color: 'var(--color-graphite)',
                    marginBottom: 4, letterSpacing: '-0.01em',
                }}>
                    {t?.disclaimerTitle || 'Disclaimer'}
                </h4>
                <p style={{
                    fontSize: 12, color: 'var(--color-pebble)',
                    lineHeight: 1.6, letterSpacing: '-0.01em',
                }}>
                    {t?.disclaimerText || "This application uses Artificial Intelligence to recommend government schemes. While we strive for accuracy, please verify all details on official government portals before applying."}
                </p>
            </div>
        </div>
    );
};

export default Disclaimer;
