import { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  // Status tracks the confirmation process state
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // This listener watches for state changes, which occurs when 
    // Supabase reads the session tokens from the URL fragment (#...) 
    // after the email confirmation redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // The SIGNED_IN event means a new session was just established, 
      // likely from the email confirmation redirect URL.
      if (event === 'SIGNED_IN' && session) {
        
        // 1. We know the email is confirmed because they are now signed in.
        setStatus('success');
        
        // 2. CRITICAL STEP: IMMEDIATELY SIGN THEM OUT
        // This clears the session and prevents the JWT from being saved 
        // in local storage, fulfilling your requirement.
        const { error: signOutError } = await supabase.auth.signOut();
        
        if (signOutError) {
          console.error("Error clearing session after confirmation:", signOutError);
        }
        
      } else if (event === 'INITIAL_SESSION') {
        // If the initial check is complete and no new session was detected,
        // we can assume the user wasn't just redirected from the confirmation link.
        setStatus('no-confirmation-detected');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        // Show while the listener is waiting for the URL fragment to be processed
        return 'Checking email confirmation status...'; 
      case 'success':
        // This message is shown right after the session has been created AND destroyed.
        return 'Your email has been successfully confirmed! You may now return to the app and sign in.';
      case 'no-confirmation-detected':
        // Fallback for a regular user landing on the page
        return 'Welcome! If you are looking to sign up, please do so.';
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