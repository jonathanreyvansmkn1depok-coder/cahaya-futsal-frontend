import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}
