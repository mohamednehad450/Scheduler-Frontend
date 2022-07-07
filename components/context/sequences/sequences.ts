import { createContext, useContext } from "react";
import { sequenceCRUD } from "../../../api";
import type { SequenceDBType } from "../../../Scheduler/src/db";
import { CRUDContext, useCRUD } from "../utils";


export const sequencesContext = createContext<CRUDContext<SequenceDBType['id'], SequenceDBType> | undefined>(undefined)

export const useSequencesCRUD = () => useCRUD(sequenceCRUD, (seq) => seq.id)

export const useSequence = () => useContext(sequencesContext)