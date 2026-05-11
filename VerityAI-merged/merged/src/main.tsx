import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { trpcQuery } from './lib/axios';
import { useAuthStore } from './store/authStore';

// Bootstrap: fetch current user from session cookie on page load
async function bootstrap() {
  try {
    const user = await trpcQuery<any>('auth.me');
    if (user) {
      useAuthStore.getState().setUser({
        id: user.id,
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        avatar: user.avatar,
        walletBalance: Number(user.walletBalance),
        verificationCount: user.verificationCount,
      });
    }
  } catch {
    // Not logged in — that's fine
    useAuthStore.getState().setUser(null);
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
