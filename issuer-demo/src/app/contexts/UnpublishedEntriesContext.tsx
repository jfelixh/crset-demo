import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UnpublishedEntries {
  name: string;
  email: string;
  jobTitle: string;
  VC: string;
  isPublished: number;
}

interface UnpublishedContextType {
  thereIsUnpublished: boolean;
  unpublishedEntries: UnpublishedEntries[];
  setThereIsUnpublished: (value: boolean) => void;
  setUnpublishedEntries: (value: UnpublishedEntries[]) => void;
}

const UnpublishedContext = createContext<UnpublishedContextType | undefined>(
  undefined
);

export const UnpublishedEntriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [thereIsUnpublished, setThereIsUnpublished] = useState<boolean>(false);
  const [unpublishedEntries, setUnpublishedEntries] = useState<
    UnpublishedEntries[]
  >([]);

  useEffect(() => {
    const numberOfUnpublishedEntries = async () => {
      try {
        const response = await fetch("/api/getUnpublishedEntries");
        const data = await response.json();
        if (data.length > 0) {
          setThereIsUnpublished(true);
        }
      } catch (error) {
        console.error("Error fetching number of unpublished entries:", error);
      }
    };
    numberOfUnpublishedEntries();
  }, []);

  return (
    <UnpublishedContext.Provider
      value={{
        thereIsUnpublished,
        unpublishedEntries,
        setThereIsUnpublished,
        setUnpublishedEntries,
      }}
    >
      {children}
    </UnpublishedContext.Provider>
  );
};

export const useUnpublishedEntriesContext = (): UnpublishedContextType => {
  const context = useContext(UnpublishedContext);
  if (!context) {
    throw new Error(
      "useUnpublishedEntriesContext must be used within an UnpublishedEntriesProvider"
    );
  }
  return context;
};
