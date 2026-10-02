import { useCallback, useEffect, useState } from "react";

export function useApiList<T>(
  loader: () => Promise<T[]>,
  enabled = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [loader, enabled]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
