import * as React from "react";

/*
  Any global application context can be maintained here.
*/

export interface IAppContext {}

const AppContext = React.createContext<IAppContext>({});

export interface ContextProviderProps {
  children: React.ReactNode;
}

export function ContextProvider(props: ContextProviderProps) {
  // all useful code is gone from here since we don't include prisma
  // here we would extract values from the JWT, hydrate them, and make them
  // available to the app via the context

  const contextValue = {};

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return React.useContext(AppContext);
}
