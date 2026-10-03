"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    const key = "promises_anonymous_id";
    let anonymousId = window.localStorage.getItem(key);

    if (!anonymousId) {
      anonymousId = crypto.randomUUID();
      window.localStorage.setItem(key, anonymousId);
    }

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "page_view",
        anonymous_id: anonymousId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
