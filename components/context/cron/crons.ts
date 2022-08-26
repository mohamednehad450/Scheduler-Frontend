import { createContext, useContext } from "react";
import { cronCRUD } from "../../../api";
import type { CronDbType } from "../../../Scheduler/src/db";
import { CRUDContext, useCRUD } from "../utils";


export const cronsContext = createContext<CRUDContext<CronDbType['id'], CronDbType> | undefined>(undefined)

export const useCronsCRUD = () => useCRUD(cronCRUD, (s) => s.id)

export const useCron = () => useContext(cronsContext)