import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-fog)', padding: '24px' }}>
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
    );
}
