import { UserRoom } from '@/types/room';
import { createContext } from 'react';
import { ReactNode, useState, useContext } from 'react';

interface GlobalContextProps {
  rooms: UserRoom[];
  updateRooms: (rooms: UserRoom[]) => void;
}

const GlobalContext = createContext<GlobalContextProps>({
  rooms: [],
  updateRooms: () => {},
});

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [globalState, setGlobalState] = useState<UserRoom[]>([]);

  const updateGlobalState = (rooms: UserRoom[]) => {
    setGlobalState(rooms);
    console.log('Line 24 - GlobalContextProvider - updateGlobalState', rooms);
  };

  return (
    <GlobalContext.Provider
      value={{ rooms: globalState, updateRooms: updateGlobalState }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalContext must be used within a GlobalContextProvider'
    );
  }
  return context;
};
