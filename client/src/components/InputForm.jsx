import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Loader2, ChevronDown, Check } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

const genders = ["Male", "Female", "Other"];
const incomes = ["Less than 1 Lakh", "1 Lakh - 3 Lakhs", "3 Lakhs - 5 Lakhs", "More than 5 Lakhs"];
const categories = ["General", "OBC", "SC", "ST"];
const occupations = ["Student", "Unemployed", "Farmer", "Self-Employed", "Salaried"];

const CustomSelect = ({ label, name, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }} ref={containerRef}>
            <label style={{
                display: 'block', fontSize: 12, fontWeight: 500,
                color: 'var(--color-stone)', marginBottom: 8, letterSpacing: '-0.01em',
            }}>
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="input-box"
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', userSelect: 'none',
                    borderColor: isOpen ? 'var(--color-tangerine-tag)' : undefined,
                    boxShadow: isOpen ? '0 0 0 3px rgba(246,146,81,0.12)' : undefined,
                }}
            >
                <span style={{ color: value ? 'var(--color-carbon)' : 'var(--color-pebble)', fontSize: 14, letterSpacing: '-0.01em' }}>
                    {value || 'Select...'}
                </span>
                <ChevronDown size={14} color="var(--color-stone)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute', zIndex: 60, width: '100%', marginTop: 4,
                            background: 'var(--color-snow)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: 12,
                            boxShadow: 'rgba(24,24,37,0.15) 0px 8px 24px -8px',
                            maxHeight: 220, overflowY: 'auto',
                        }}
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleSelect(option)}
                                style={{
                                    padding: '10px 14px',
                                    cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontSize: 14, color: value === option ? 'var(--color-carbon)' : 'var(--color-stone)',
                                    background: value === option ? 'var(--color-fog)' : 'transparent',
                                    letterSpacing: '-0.01em',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => { if (value !== option) e.currentTarget.style.background = 'var(--color-fog)'; }}
                                onMouseLeave={e => { if (value !== option) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {option}
                                {value === option && <Check size={14} color="var(--color-tangerine-tag)" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InputForm = ({ onSubmit, isLoading, t }) => {
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [formData, setFormData] = useState({
        customQuery: '',
        age: '',
        gender: 'Male',
        state: 'Uttar Pradesh',
        city: '',
        annualIncome: 'Less than 1 Lakh',
        category: 'General',
        occupation: 'Student',
        educationLevel: 'Graduate',
        specialConditions: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isSignedIn) { openSignIn(); return; }
        onSubmit(formData);
    };

    return (
        <motion.section
            id="find-schemes"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ background: 'var(--color-fog)', padding: '80px 0' }}
        >
            <div className="container-dialog">
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    {/* Section header */}
                    <div style={{ marginBottom: 40 }}>
                        <span className="badge badge-fog" style={{ marginBottom: 16 }}>
                            Eligibility Finder
                        </span>
                        <h2 className="headline-lg" style={{ marginBottom: 12 }}>
                            {t?.findSchemes || "Find your schemes"}
                        </h2>
                        <p style={{ fontSize: 16, color: 'var(--color-stone)', letterSpacing: '-0.01em', lineHeight: 1.6 }}>
                            {t?.enterDetails || "Enter your details and our AI will match you with eligible government schemes in seconds."}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="card p-mobile" style={{ padding: 40 }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Removed Full Name */}

                            {/* Row 1: Age + Gender */}
                            <div className="form-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-stone)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                                        {t?.age || 'Age'}
                                    </label>
                                    <input
                                        type="number" name="age" value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 24"
                                        required
                                        className="input-box"
                                    />
                                </div>
                                <CustomSelect label={t?.gender || 'Gender'} name="gender" value={formData.gender} options={genders} onChange={handleChange} />
                            </div>

                            {/* Row 2: State + City */}
                            <div className="form-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <CustomSelect label={t?.state || 'State'} name="state" value={formData.state} options={states} onChange={handleChange} />
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-stone)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                                        {t?.city || 'City'}
                                    </label>
                                    <input
                                        type="text" name="city" value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Lucknow"
                                        className="input-box"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Income + Category */}
                            <div className="form-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <CustomSelect label={t?.annualIncome || 'Annual Income'} name="annualIncome" value={formData.annualIncome} options={incomes} onChange={handleChange} />
                                <CustomSelect label={t?.category || 'Category'} name="category" value={formData.category} options={categories} onChange={handleChange} />
                            </div>

                            {/* Occupation */}
                            <CustomSelect label={t?.occupation || 'Occupation'} name="occupation" value={formData.occupation} options={occupations} onChange={handleChange} />

                            {/* Custom Query */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-stone)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                                    Specific Request or Scheme Name (Optional)
                                </label>
                                <textarea
                                    name="customQuery" value={formData.customQuery}
                                    onChange={handleChange}
                                    placeholder="e.g. I am looking for a laptop scheme for students"
                                    className="input-box"
                                    rows={2}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '15px 28px',
                                    fontSize: 15, marginTop: 8,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        {t?.analyzing || 'Analyzing your profile...'}
                                    </>
                                ) : (
                                    <>
                                        {t?.analyzeButton || 'Find my schemes'}
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </motion.button>

                            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-pebble)', letterSpacing: '-0.01em' }}>
                                Your data is processed anonymously and never stored.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default InputForm;
