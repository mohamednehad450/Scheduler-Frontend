import { createContext, useContext } from "react";
import { sequenceCRUD, SequenceData } from "../../../api";
import { CRUDContext, initCRUDContext } from "../utils";


export const sequencesContext = createContext<CRUDContext<SequenceData> | undefined>(undefined)

export const initSequencesContext = () => initCRUDContext(sequenceCRUD)

export const useSequence = () => useContext(sequencesContext)