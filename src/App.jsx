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
    // Simulate checking the email confirmation token
    const confirmEmail = async () => {
      // Example: get token from URL query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('no-token');
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({ token, type: 'signup' });

      if (error) {
        setStatus('error');
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
