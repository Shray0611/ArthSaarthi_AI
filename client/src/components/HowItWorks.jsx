import React from 'react';
import { UserCircle2, BrainCircuit, FileCheck } from 'lucide-react';

const HowItWorks = ({ language, t }) => {
    const steps = [
        {
            icon: <UserCircle2 size={26} color="#484758" />,
            step: '01',
            title: t?.step1Title || "Enter Details",
            desc: t?.step1Desc || "Provide basic information about yourself — age, state, income, and occupation.",
        },
        {
            icon: <BrainCircuit size={26} color="#f69251" />,
            step: '02',
            title: t?.step2Title || "AI Analysis",
            desc: t?.step2Desc || "Our AI instantly scans hundreds of government schemes and finds your matches.",
        },
        {
            icon: <FileCheck size={26} color="#484758" />,
            step: '03',
            title: t?.step3Title || "Get Results",
            desc: t?.step3Desc || "Receive a personalized, ranked list of benefits you're eligible for.",
        }
    ];

    return (
        <section style={{ background: '#f7f7f7', padding: '80px 0' }}>
            <div className="container-dialog">
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span style={{
                        display: 'inline-block', padding: '5px 14px',
                        background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
                        borderRadius: 100, fontSize: 12, fontWeight: 500,
                        color: '#484758', fontFamily: "'Inter', sans-serif",
                        marginBottom: 20,
                    }}>
                        How it works
                    </span>
                    <h2 style={{
                        fontFamily: "'Satoshi', 'Inter', sans-serif",
                        fontWeight: 500, fontSize: 'clamp(26px, 3.5vw, 40px)',
                        letterSpacing: '-0.8px', color: '#111111',
                        marginBottom: 14, lineHeight: 1.2,
                    }}>
                        {t?.howItWorks || 'From your details to your benefits'}
                    </h2>
                    <p style={{
                        fontSize: 17, color: '#636363', maxWidth: 480,
                        margin: '0 auto', lineHeight: 1.65, letterSpacing: '-0.2px',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        Three simple steps to discover the government schemes you deserve.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {steps.map((step, idx) => (
                        <div key={idx} className="card" style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: 22, right: 22,
                                fontSize: 11, fontWeight: 600, color: '#c0c0c0',
                                letterSpacing: '0.04em', fontFamily: "'Inter', sans-serif",
                            }}>
                                {step.step}
                            </div>
                            <div style={{
                                width: 50, height: 50, background: '#f7f7f7',
                                borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 20,
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{
                                fontFamily: "'Satoshi', 'Inter', sans-serif",
                                fontWeight: 500, fontSize: 19,
                                letterSpacing: '-0.3px', color: '#111111', marginBottom: 10,
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: 14, color: '#636363', lineHeight: 1.65,
                                letterSpacing: '-0.1px', fontFamily: "'Inter', sans-serif",
                            }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
