import { useEffect } from "react";
import { useSiteConfigs } from "@/hooks/use-site-config";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

export function LiveChat() {
  const { data: configs } = useSiteConfigs();
  const tawkPropertyId = configs?.tawk_property_id;
  const tawkWidgetId = configs?.tawk_widget_id || 'default';

  useEffect(() => {
    if (!tawkPropertyId) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
    script.async = true;
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    return () => {
      // Tawk.to doesn't provide a perfect way to destroy via script removal,
      // but we can try to hide it if the API is loaded
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      document.head.removeChild(script);
    };
  }, [tawkPropertyId, tawkWidgetId]);

  return null;
}
