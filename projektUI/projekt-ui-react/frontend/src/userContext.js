import { createContext } from 'react';

 export const UserContext = createContext({
     user: null,
     setUserContext: () => {},
     filter: false,
     setFilter: () => {}
 });