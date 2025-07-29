import { useState } from 'react';
import Head from 'next/head';
import { LoginPage } from '@/components/LoginPage';
import { BookingFlow } from '@/components/BookingFlow';
import { DoctorDashboard } from '@/components/DoctorDashboard';
import type { User } from '@/utils/types';


// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (credentials: { email: string }, role: 'patient' | 'doctor') => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, role }),
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            const error = await response.json();
            alert(error.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Login request failed:', error);
        alert('An error occurred during login.');
    }
  };
  
  const handleLogout = () => {
      setUser(null);
  }

  const renderContent = () => {
    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }
    if (user.role === 'doctor') {
        // The dashboard now fetches its own data.
        return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
    if (user.role === 'patient') {
        // The booking flow now fetches its own data.
        return <BookingFlow user={user} onLogout={handleLogout} />;
    }
    return <LoginPage onLogin={handleLogin} />;
  };

  return (
    <>
      <Head>
        <title>Shedula - Appointment Booking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {renderContent()}
      </main>
    </>
  );
}
