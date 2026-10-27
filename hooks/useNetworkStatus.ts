import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useNetworkStatus(): { isOffline: boolean; checking: boolean } {
  const [isOffline, setIsOffline] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (!mounted) return;
        const offline =
          state.isConnected === false || state.isInternetReachable === false;
        setIsOffline(offline);
      } catch {
        if (mounted) setIsOffline(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    void refresh();
    const id = setInterval(refresh, 8000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { isOffline, checking };
}
