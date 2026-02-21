"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function AppToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <Toaster
      position={isMobile ? "top-center" : "top-right"}
      expand={isMobile}
      visibleToasts={isMobile ? 2 : 4}
      closeButton
      offset={isMobile ? 72 : { top: 88, right: 16 }}
      toastOptions={{
        className:
          "rounded-xl border border-slate-200 bg-white/95 text-slate-900 shadow-[0_10px_26px_-20px_rgba(15,23,42,0.45)] backdrop-blur",
        descriptionClassName: "text-slate-600",
      }}
    />
  );
}
