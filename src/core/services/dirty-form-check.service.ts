import { createContext, useContext } from "react";

export const DirtyFormContext = createContext(null);

export const useDirtyForm = () => useContext(DirtyFormContext);
