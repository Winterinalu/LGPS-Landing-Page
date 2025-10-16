import { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Function to handle the email confirmation process
    const confirmEmail = async () => {
      // 1. Get token from URL query params (e.g., from ?token=HASH)
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('no-token');
        return;
      }

      // 2. Call Supabase to verify the token for signup
      // This is the core logic you wanted to ensure was included.
      const { error } = await supabase.auth.verifyOtp({ 
        token, 
        type: 'signup' // Use 'signup' type for email confirmation
      });

      if (error) {
        setStatus('error');
        // Optional: You could log the error here for debugging: console.error(error);
      } else {
        setStatus('success');
      }
    };

    confirmEmail();
  }, []);

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        return 'Confirming your email...';
      case 'success':
        return 'Your email has been successfully confirmed! Welcome to LGPS.';
      case 'error':
        return 'There was an error confirming your email. Please try again.';
      case 'no-token':
        return 'No confirmation token found. Please check your email link.';
      default:
        return '';
    }
  };

  return (
    <div className="landing-container">
      <div className="logo">LGPS</div>
      <h1>Lugaw Pilipinas</h1>
      <div className="confirmation-card">
        <p>{renderMessage()}</p>
      </div>
    </div>
  );
}

export default App;