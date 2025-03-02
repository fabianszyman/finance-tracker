import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const [rememberMe, setRememberMe] = useState(false);

async function handleLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      // When Remember Me is checked, keep the session for 30 days
      expiresIn: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 days vs 1 hour
    }
  });
  
  // Handle login response...
}

// In your form JSX
<div className="flex items-center">
  <input
    type="checkbox"
    id="remember-me"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="h-4 w-4"
  />
  <label htmlFor="remember-me" className="ml-2 text-sm">
    Remember me for 30 days
  </label>
</div> 