"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
