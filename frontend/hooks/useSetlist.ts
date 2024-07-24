import SetList from "@/models/setlists";
import { getSetLists, getSetList, deleteSetList, createSetList, updateSetList } from "@/services/setlistApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useSetLists = () => {
  const [setLists, setSetLists] = useState<SetList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const handleDeleteSetlist = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteSetList(id);
      setSetLists(setLists.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete setlist:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadSetlists = async () => {
      setIsLoading(true);
      try {
        const result = await getSetLists();
        setSetLists(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSetlists();
  }, []);

  return { 
    setLists, isLoading, error, 
    handleDeleteSetlist 
  };
};

export const useSetList = (id?: number) => {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<any>();
  const [setList, setSetList] = useState<SetList>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const handleCreateSetList = async (val: SetList) => {
    setErrorMessages({})
    try {
      await createSetList(val.toCreateParams());
      router.push("/setlists");
    } catch (e: any) {
      console.error(e);
      if (e.code === "ERR_BAD_REQUEST") {
        setErrorMessages(e.response.data.errorMessages);
      }
    }
  }

  const handleUpdateSetList = async (val: SetList) => {
    setErrorMessages({});
    try {
      await updateSetList(val.toUpdateParams());
      router.push("/setlists");
    } catch (e: any) {
      console.error(e);
      if (e.code === "ERR_BAD_REQUEST") {
        setErrorMessages(e.response.data.errorMessages);
      }
    }
  };

  useEffect(() => {
    if (!id) {
      setSetList(new SetList());
      return;
    }

    const loadSetlist = async () => {
      setIsLoading(true);
      try {
        const result = await getSetList(id);
        setSetList(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSetlist();
  }, [id]);

  return { 
    setList, setSetList, isLoading, error,
    errorMessages, 
    handleCreateSetList, handleUpdateSetList
  };
}