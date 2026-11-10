"use client";

import { useEffect, useRef, useState } from "react";

export function AirbnbNotebook() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1000);

  useEffect(() => {
    function resize(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== "airbnb-notebook-height") return;
      if (Number.isFinite(event.data.height) && event.data.height > 0) {
        setHeight(event.data.height);
      }
    }
    window.addEventListener("message", resize);
    frame.current?.contentWindow?.postMessage("measure-notebook", "*");
    return () => window.removeEventListener("message", resize);
  }, []);

  return (
    <section className="page-shell" aria-label="Airbnb machine learning notebook">
      <iframe
        ref={frame}
        src="/media/airbnb-ml/notebook.html"
        onLoad={() => frame.current?.contentWindow?.postMessage("measure-notebook", "*")}
        title="Airbnb Review Activity Prediction — complete notebook"
        sandbox="allow-scripts"
        style={{ display: "block", width: "100%", height, border: 0 }}
      />
    </section>
  );
}
