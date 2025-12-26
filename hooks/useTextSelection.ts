import { useEffect } from "react";

function useTextSelection(callback: (text: string) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleMouseUp = () => {
      const text = window.getSelection()?.toString().trim();
      if (text) callback(text);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [callback, enabled]);
}

export { useTextSelection };
