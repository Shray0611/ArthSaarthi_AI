import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SchemeAnalytics = ({ schemes, language }) => {
    const typeCount = schemes.reduce((acc, scheme) => {
        const key = (scheme.type || '').toLowerCase().includes('central') ? 'Central Gov' : 'State Gov';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] }));

    const tagCount = schemes.reduce((acc, scheme) => {
        let tagsFound = false;
        if (scheme.tags && Array.isArray(scheme.tags) && scheme.tags.length > 0) {
            scheme.tags.forEach(tag => {
                const cleanTag = tag.trim();
                if (cleanTag && !['Central', 'State', 'Government', 'Scheme'].includes(cleanTag)) {
                    acc[cleanTag] = (acc[cleanTag] || 0) + 1;
                    tagsFound = true;
                }
            });
        }
        if (!tagsFound && scheme.name) {
            const n = scheme.name.toLowerCase();
            let cat = 'General';
            if (n.includes('kisan') || n.includes('farmer') || n.includes('krishi')) cat = 'Agriculture';
            else if (n.includes('student') || n.includes('scholarship')) cat = 'Education';
            else if (n.includes('health') || n.includes('ayushman')) cat = 'Health';
            else if (n.includes('pension') || n.includes('old age')) cat = 'Pension';
            else if (n.includes('woman') || n.includes('mahila')) cat = 'Women';
            else if (n.includes('loan') || n.includes('mudra')) cat = 'Finance';
            else if (n.includes('home') || n.includes('awas')) cat = 'Housing';
            acc[cat] = (acc[cat] || 0) + 1;
        }
        return acc;
    }, {});

    const barData = Object.entries(tagCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const PIE_COLORS = ['#f69251', '#484758'];
    const isHindi = language !== 'en';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--color-snow)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8, padding: '8px 12px',
                    boxShadow: 'var(--shadow-subtle)',
                    fontSize: 13, color: 'var(--color-carbon)',
                }}>
                    <strong>{payload[0].name}</strong>: {payload[0].value}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 16, marginBottom: 40,
        }}>
            {/* Scheme Type Distribution */}
            <div className="card">
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 400,
                    fontSize: 16, letterSpacing: '-0.02em',
                    color: 'var(--color-carbon)', marginBottom: 24,
                }}>
                    {isHindi ? 'योजना वितरण' : 'Scheme Distribution'}
                </h3>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData} cx="50%" cy="50%"
                                innerRadius={55} outerRadius={75}
                                paddingAngle={4} dataKey="value"
                            >
                                {pieData.map((_, idx) => (
                                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
                    {pieData.map((entry, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-stone)' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[idx % PIE_COLORS.length], flexShrink: 0 }} />
                            {entry.name} ({entry.value})
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Focus Areas */}
            <div className="card">
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 400,
                    fontSize: 16, letterSpacing: '-0.02em',
                    color: 'var(--color-carbon)', marginBottom: 24,
                }}>
                    {isHindi ? 'मुख्य फोकस क्षेत्र' : 'Key Focus Areas'}
                </h3>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name" type="category"
                                tick={{ fill: 'var(--color-stone)', fontSize: 12, fontFamily: 'Inter' }}
                                axisLine={false} tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(246,146,81,0.06)' }} />
                            <Bar dataKey="value" fill="var(--color-tangerine-tag)" radius={[0, 6, 6, 0]} barSize={14} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SchemeAnalytics;
