import { useState, useEffect } from 'react';
import './App.css';
import logo from './Images/LP Logo Transparent.png';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Read tokens from the URL fragment that Supabase appends to the confirmation link
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    const confirmFromUrl = async () => {
      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Error confirming email:', error);
          setStatus('error');
          return;
        }

        // show success briefly
        setStatus('success');

        // Immediately clear the session so the user remains logged out
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error('Error clearing session after confirmation:', signOutError);
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
        return 'Your email has been successfully confirmed. You may now sign in.';
      case 'no-confirmation-detected':
        return 'No confirmation data detected. Please use the link sent to your email.';
      case 'error':
        return 'There was a problem confirming your email. Please try again or contact support.';
      default:
        return '';
    }
  };

  return (
    <div className="confirm-root">
      <div className="confirm-center">
        <div className="confirm-card">
          <div className="confirm-top">
            <img src={logo} alt="LGPS logo" className="logo" />
            <h2>Confirm your signup</h2>
          </div>

          <div className="confirm-body">
            <div className="status-dot" data-status={status}></div>
            <p className="message">{renderMessage()}</p>
            <small className="hint">If you did not request this, you can ignore this message.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
