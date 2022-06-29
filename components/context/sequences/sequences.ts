import { createContext, useContext } from "react";
import { sequenceCRUD } from "../../../api";
import { SequenceDBType } from "../../../Scheduler/src/db";
import { CRUDContext, initCRUDContext } from "../utils";


export const sequencesContext = createContext<CRUDContext<SequenceDBType['id'], SequenceDBType> | undefined>(undefined)

export const initSequencesContext = () => initCRUDContext(sequenceCRUD, (seq) => seq.id)

export const useSequence = () => useContext(sequencesContext)