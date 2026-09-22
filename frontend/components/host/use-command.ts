"use client";

import { useState, useTransition } from "react";
import type { HostActionResult } from "@/lib/host/actions";

/** Runs a host server action, tracking pending state and the last error. */
export function useCommand() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run<T>(command: () => Promise<HostActionResult<T>>, onSuccess?: (data: T) => void) {
    setError(null);
    startTransition(async () => {
      const result = await command();
      if (result.ok) {
        onSuccess?.(result.data);
      } else {
        setError(result.error);
      }
    });
  }

  return { pending, error, run, clearError: () => setError(null) };
}
