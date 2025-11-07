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
    // Extract access_token etc. from the confirmURL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    const confirmFromUrl = async () => {
      if (access_token && refresh_token) {
        // Exchange tokens for a session and confirm the email
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Error confirming email:', error);
          setStatus('error');
          return;
        }

        // Successful sign-in after confirmation
        setStatus('success');

        // Immediately clear the session so user stays logged out
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error clearing session after confirmation:', signOutError);
        }
      } else {
        setStatus('no-confirmation-detected');
      }
    };

    confirmFromUrl();
  }, []);

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        return 'Checking email confirmation status...';
      case 'success':
        return 'Your email has been successfully confirmed! You may now return to the app and sign in.';
      case 'no-confirmation-detected':
        return 'No confirmation data detected. Please use the email link to confirm your account.';
      case 'error':
        return 'An error occurred while confirming your email. Please try again or contact support.';
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
