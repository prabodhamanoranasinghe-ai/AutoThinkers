"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase";

let analyticsInstance: Analytics | null = null;

async function getClientAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}

export function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function track() {
      const analytics = await getClientAnalytics();
      if (!analytics || cancelled) return;

      logEvent(analytics, "page_view", {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    void track();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
