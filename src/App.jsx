import { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [status, setStatus] = useState('loading');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // This function runs on every page load to check for a session
    // that Supabase might have injected into the URL fragment (#...) 
    // after the ConfirmationURL redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // The 'SIGNED_IN' event fires after a successful login or confirmation redirect
      if (event === 'SIGNED_IN' && session) {
        // If we successfully get a session, it means the user was confirmed and logged in.
        setIsConfirmed(true); 
        setStatus('success');
      } else if (event === 'INITIAL_SESSION' && session) {
        // Handle cases where the user is already logged in on initial load, 
        // though typically not what we want for a confirmation page.
        setIsConfirmed(true); 
        setStatus('success');
      } else {
        // Check if there is no session and no hash data (meaning no redirect happened)
        // Note: Checking for the specific hash data is complex, so we simplify 
        // by looking at the session and assuming if it's not success, it might be an issue.
        if (event === 'INITIAL_SESSION' && !session) {
           setStatus('no-session');
        }
      }
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        // Wait for the onAuthStateChange listener to process the URL fragment
        return 'Checking confirmation status...'; 
      case 'success':
        return 'Your email has been successfully confirmed! Welcome to LGPS.';
      case 'no-session':
        // This is a default message if no token or session was found.
        return 'Please check your email link or try signing in.';
      default:
        // You might want to remove the default case or make it a fallback message
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