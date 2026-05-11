'use client';

import { useEffect, useRef } from 'react';
import { trackVisitor } from '@/lib/api';

/**
 * Hook to track visitor activity on the portfolio site.
 * Generates a session ID, tracks page views, and records time on page.
 */
export function useVisitorTracking() {
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(0);
  const hasTracked = useRef<boolean>(false);

  useEffect(() => {
    // Generate or retrieve session ID
    if (!sessionIdRef.current) {
      const existingId = sessionStorage.getItem('portfolio_session_id');
      if (existingId) {
        sessionIdRef.current = existingId;
      } else {
        sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem('portfolio_session_id', sessionIdRef.current);
      }
    }

    startTimeRef.current = Date.now();

    // Track initial page view (only once per session)
    if (!hasTracked.current) {
      hasTracked.current = true;
      trackVisitor({
        session_id: sessionIdRef.current,
        page: window.location.pathname || '/',
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent || undefined,
      });
    }

    // Track time on page when leaving
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = (Date.now() - startTimeRef.current) / 1000;
        trackVisitor({
          session_id: sessionIdRef.current,
          page: window.location.pathname || '/',
          time_on_page: timeOnPage,
        });
      } else {
        // Reset timer when returning to page
        startTimeRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const timeOnPage = (Date.now() - startTimeRef.current) / 1000;
      // Use sendBeacon for reliability on page unload
      const API_PORT = 8000;
      const url = `/api/visitors/?XTransformPort=${API_PORT}`;
      const payload = JSON.stringify({
        session_id: sessionIdRef.current,
        page: window.location.pathname || '/',
        time_on_page: timeOnPage,
      });
      navigator.sendBeacon(url, payload);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
