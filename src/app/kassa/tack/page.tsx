import React, { Suspense } from "react";
import TackContent from "./TackContent";

export default function TackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center font-mono text-xs text-ink/70">
          Laddar orderbekräftelse...
        </div>
      }
    >
      <TackContent />
    </Suspense>
  );
}
