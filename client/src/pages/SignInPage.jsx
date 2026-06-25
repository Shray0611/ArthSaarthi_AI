import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-fog)', padding: '24px' }}>
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    );
}
