import { useEffect } from "react";
import { useSiteConfigs } from "@/hooks/use-site-config";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat() {
  const { data: configs } = useSiteConfigs();
  const crispId = configs?.crisp_website_id;

  useEffect(() => {
    if (!crispId) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispId;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Crisp doesn't always clean up well, but we can remove the script
      document.head.removeChild(script);
      // And hide the widget if it's there
      const crispWidget = document.getElementById("crisp-chatbox");
      if (crispWidget) crispWidget.style.display = "none";
    };
  }, [crispId]);

  return null;
}
