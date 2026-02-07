import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getDeviceId } from '@/services/device';
import { apiGetStatus, StatusResponse } from '@/services/api';
import { initPurchases, getCustomerInfo } from '@/services/purchases';

interface Quota {
  freeUsed: number;
  freeLimit: number;
  credits: number;
  subscription: {
    active: boolean;
    used: number;
    limit: number;
    proModelAccess: boolean;
  };
}

interface AppContextType {
  deviceId: string | null;
  quota: Quota | null;
  isProSubscriber: boolean;
  totalRemaining: number;
  refreshQuota: () => Promise<void>;
  loading: boolean;
}

const defaultQuota: Quota = {
  freeUsed: 0,
  freeLimit: 3,
  credits: 0,
  subscription: {
    active: false,
    used: 0,
    limit: 100,
    proModelAccess: false,
  },
};

const AppContext = createContext<AppContextType>({
  deviceId: null,
  quota: null,
  isProSubscriber: false,
  totalRemaining: 3,
  refreshQuota: async () => {},
  loading: true,
});

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const id = await getDeviceId();
        setDeviceId(id);
        await initPurchases(id);
        await fetchQuota(id);
      } catch (e) {
        console.error('Failed to initialize app context:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchQuota = async (id: string) => {
    try {
      const status = await apiGetStatus(id);
      setQuota(status);
    } catch (e) {
      console.error('Failed to fetch quota:', e);
      // Use defaults if fetch fails (e.g., offline)
    }
  };

  const refreshQuota = useCallback(async () => {
    if (deviceId) {
      await fetchQuota(deviceId);
    }
    // Also check client-side entitlements via RevenueCat SDK
    try {
      const info = await getCustomerInfo();
      if (info) {
        setClientProEntitlement(info.entitlements.active['pro'] !== undefined);
      }
    } catch {
      // Ignore — server-side check is the primary source
    }
  }, [deviceId]);

  const [clientProEntitlement, setClientProEntitlement] = useState(false);

  // Pro status: trust either server or client-side SDK
  const isProSubscriber = (quota?.subscription?.active ?? false) || clientProEntitlement;

  const totalRemaining = (() => {
    if (!quota) return 3; // Default assumption
    let remaining = 0;

    // Free gens remaining
    remaining += Math.max(0, quota.freeLimit - quota.freeUsed);

    // Credits
    remaining += quota.credits;

    // Subscription remaining
    if (quota.subscription.active) {
      remaining += Math.max(0, quota.subscription.limit - quota.subscription.used);
    }

    return remaining;
  })();

  return (
    <AppContext.Provider
      value={{
        deviceId,
        quota,
        isProSubscriber,
        totalRemaining,
        refreshQuota,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
