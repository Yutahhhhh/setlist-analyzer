import SetList from "@/models/setlists";
import { getSetlists } from "@/services/setlistApi";
import { useEffect, useState } from "react";

export const useSetlist = () => {
  const [setlists, setSetlists] = useState<SetList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const loadSetlists = async () => {
      setIsLoading(true);
      try {
        const result = await getSetlists();
        setSetlists(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSetlists();
  }, []);

  return { setlists, isLoading, error };
};
