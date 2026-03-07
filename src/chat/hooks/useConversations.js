import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../auth/auth.store";
import { fetchConversations } from "../chat.api";

export const useConversations = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setConversations([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { conversations, setConversations, loading, error, refresh };
};

export default useConversations;
