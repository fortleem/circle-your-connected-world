import { useEffect, useState } from "react";

export type GeoState = {
  loading: boolean;
  lat?: number;
  lon?: number;
  city?: string;
  country?: string;
  error?: string;
};

const CACHE_KEY = "cirkel-geo";

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>(() => {
    try {
      const c = localStorage.getItem(CACHE_KEY);
      if (c) return { loading: false, ...JSON.parse(c) };
    } catch {}
    return { loading: true };
  });

  useEffect(() => {
    if (state.city) return;
    // Try IP-based first (no permission prompt)
    (async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        if (r.ok) {
          const j = await r.json();
          const next = { lat: j.latitude, lon: j.longitude, city: j.city, country: j.country_name };
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
          setState({ loading: false, ...next });
          return;
        }
      } catch {}
      // Fallback to browser geolocation
      if (!navigator.geolocation) {
        setState({ loading: false, error: "unavailable" }); return;
      }
      navigator.geolocation.getCurrentPosition(
        async (p) => {
          const { latitude, longitude } = p.coords;
          let city, country;
          try {
            const r = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en`);
            const j = await r.json();
            city = j?.results?.[0]?.name; country = j?.results?.[0]?.country;
          } catch {}
          const next = { lat: latitude, lon: longitude, city, country };
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
          setState({ loading: false, ...next });
        },
        () => setState({ loading: false, error: "denied" }),
        { timeout: 6000 },
      );
    })();
     
  }, []);

  return state;
}
