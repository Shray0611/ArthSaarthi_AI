import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../translations';
import { SignedIn } from '@clerk/clerk-react';
import UserHistory from '../components/UserHistory';

const DashboardPage = () => {

    const [language, setLanguage] = useState('en');
    const t = translations[language];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-fog)', display: 'flex', flexDirection: 'column' }}>
            <Header language={language} setLanguage={setLanguage} t={t} />

            <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80 }}>
                <div className="container-dialog">
                    <SignedIn>
                        <UserHistory language={language} />
                    </SignedIn>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardPage;
