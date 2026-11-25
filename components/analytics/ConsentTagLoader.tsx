"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStoredConsent, ConsentState } from "@/lib/consent";

interface TrackerConfig {
  ga4MeasurementId: string | null;
  metaPixelId: string | null;
}

export function ConsentTagLoader() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [config, setConfig] = useState<TrackerConfig | null>(null);

  // 1. Fetch public config once
  useEffect(() => {
    fetch("/api/analytics/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setConfig({
            ga4MeasurementId: data.ga4MeasurementId || null,
            metaPixelId: data.metaPixelId || null,
          });
        }
      })
      .catch(() => {});
  }, []);

  // 2. Read stored consent and listen for updates
  useEffect(() => {
    setConsent(getStoredConsent());

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentState>;
      setConsent(customEvent.detail || getStoredConsent());
    };

    window.addEventListener("megascript_consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("megascript_consent_changed", handleConsentChange);
    };
  }, []);

  // 3. Inject or remove GA4 tag based on analytics consent
  useEffect(() => {
    if (!config?.ga4MeasurementId) return;
    const ga4ScriptId = "megascript-ga4-script";
    const ga4InitId = "megascript-ga4-init";

    if (consent?.analytics) {
      if (!document.getElementById(ga4ScriptId)) {
        const script = document.createElement("script");
        script.id = ga4ScriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`;
        document.head.appendChild(script);

        const initScript = document.createElement("script");
        initScript.id = ga4InitId;
        initScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.ga4MeasurementId}', { anonymize_ip: true });
        `;
        document.head.appendChild(initScript);
      }
    } else {
      // Remove GA4 if consent revoked
      document.getElementById(ga4ScriptId)?.remove();
      document.getElementById(ga4InitId)?.remove();
    }
  }, [consent?.analytics, config?.ga4MeasurementId]);

  // 4. Inject or remove Meta Pixel tag based on marketing consent
  useEffect(() => {
    if (!config?.metaPixelId) return;
    const pixelScriptId = "megascript-fb-pixel";

    if (consent?.marketing) {
      if (!document.getElementById(pixelScriptId)) {
        const script = document.createElement("script");
        script.id = pixelScriptId;
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${config.metaPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
    } else {
      // Remove Meta Pixel if consent revoked
      document.getElementById(pixelScriptId)?.remove();
    }
  }, [consent?.marketing, config?.metaPixelId]);

  // 5. Track pageviews on route changes when consented
  useEffect(() => {
    if (consent?.analytics && config?.ga4MeasurementId && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "page_view", {
        page_path: pathname,
      });
    }
    if (consent?.marketing && config?.metaPixelId && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname, consent?.analytics, consent?.marketing, config]);

  return null;
}
